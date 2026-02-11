const expenseDao=require('../dao/expenseDao');
const Group=require('../model/group')
const Expense=require('../model/expense')
const expenseController={
    getExpensesByGroup: async (request, response)=>{
        try{
            const {groupId} = request.params;
            const expenses=await expenseDao.getExpensesByGroupId(groupId);
            response.status(200).json(expenses);
        }
        catch(error){
            console.log(error);
            response.status(500).json({message: "Error fetching expenses"});
        }
    },
    
    createExpense: async (request, response)=>{
        try{
            const {groupId}=request.params;
            const {title, amount, splits}= request.body;
            if (!title || amount <= 0) {
                return response.status(400).json({ message: "Invalid expense data" });
            }
            const group = await Group.findById(groupId);
            if (!group) {
                return response.status(404).json({ message: "Group not found" });
            }

            const paidByEmail = request.user.email;
            if (!group.membersEmail.includes(paidByEmail)) {
                return response.status(400).json({
                    message: "Payer must be a member of the group"
                });
            }
            if (!splits || splits.length === 0) {
                return response.status(400).json({
                    message: "Splits required"
                });
            }

            const groupMembers = group.membersEmail;
            let totalSplit = 0;
            const uniqueMembers = new Set();
            for (let split of splits) {

                if (!groupMembers.includes(split.email)) {
                    return response.status(400).json({
                        message: `Invalid member: ${split.email}`
                    });
                }

                if (uniqueMembers.has(split.email)) {
                    return response.status(400).json({
                        message: "Duplicate member in splits"
                    });
                }

                uniqueMembers.add(split.email);

                if (split.amount < 0) {
                    return response.status(400).json({
                        message: "Split amount cannot be negative"
                    });
                }

                totalSplit += Number(split.amount);
            }

            if (totalSplit !== Number(amount)) {
                return response.status(400).json({
                    message: "Split total must equal expense amount"
                });
            }

            const expense = await expenseDao.createExpense({
                groupId,
                title,
                amount,
                paidByEmail,
                splits
            });
            response.status(201).json({ message: "Expense created successfully", expense });
        }
        catch(error){
            console.log(error);
            response.status(500).json({message: "Error creating expenses"});
        }
    },
    
    getSettlement: async (request, response)=>{
        try {
            const {groupId}=request.params;
            const group = await Group.findById(groupId);
            if (!group) {
                return response.status(404).json({ message: "Group not found" });
            }
            const expenses = await Expense.find({
                groupId: groupId
            });
            console.log(expenses);
            
            //initialize the balance array and keeping 0 at default
            const balances={};
            group.membersEmail.forEach(email => {
                balances[email] = 0;
            });
            

            expenses.forEach(exp=>{
                balances[exp.paidByEmail]+=exp.amount;
                exp.splits.forEach(split=>{
                    balances[split.email] -= split.amount;
                })
            })
            response.status(200).json(balances);
        } catch (error) {
            response.status(500).json({message: "Error getting settlements"});
        }
    }
};
module.exports=expenseController;
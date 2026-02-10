const { request, response } = require('express');
const expenseDao=require('../dao/expenseDao');
const Group=require('../model/group')
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
            const {title, amount, paidByEmail}= req.body;

            if (!title || amount <= 0) {
                return res.status(400).json({ message: "Invalid expense data" });
            }
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }

            if (!group.membersEmail.includes(paidByEmail)) {
                return res.status(400).json({
                    message: "Payer must be a member of the group"
                });
            }
            const members=group.membersEmail;
            const splitAmount=amount/members.length;
            const splits=members.map(email =>({
                email,
                amount: splitAmount
            }));

            const expense = await expenseDao.createExpense({
                groupId: new mongoose.Types.ObjectId(groupId),
                title,
                amount,
                paidByEmail,
                splits
            });
            res.status(201).json({ message: "Expense created successfully", expense });
        }
        catch(error){
            response.status(500).json({message: "Error creating expenses"});
        }
    },
    
    getSettlement: async (request, response)=>{
        try {
            
        } catch (error) {
            response.status(500).json({message: "Error getting settlements"});
        }
    }
};
module.exports=expenseController;
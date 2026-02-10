const Expense=require('../model/expense');
const expenseDao={
    createExpense: async (data)=>{
        return await Expense.create(data);
    },
    
    getExpensesByGroupId: async (groupId)=>{
        return await Expense.find({
            groupId: groupId
        }).sort({ createdAt: -1 });
    },

};
module.exports=expenseDao;
const Expense=require('../model/expense');
const group = require('../model/group');
const { getGroupByEmail } = require('./groupDao');
const expenseDao={
    createExpense: async (data)=>{
        const expense= new Expense(data);
        return await expense.save();
    },
    
    getExpensesByGroupId: async (groupId)=>{
        return await Expense.find({groupId}).sort({createdAt: -1});
    },

};
module.exports=expenseDao;
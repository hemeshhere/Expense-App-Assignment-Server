const mongoose =require('mongoose');
const splitSchema = new mongoose.Schema({
    email: { type: String, required: true },
    amount: { type: Number, required: true }
});

const expenseSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    paidByEmail: { type: String, required: true },
    splits: [splitSchema],
    createdAt: { type: Date, default: Date.now }
});
module.exports=mongoose.model('Expense', expenseSchema);
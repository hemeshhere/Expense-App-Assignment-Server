const express=require("express")
const expenseController=require('../controllers/expenseController')
const router=express.Router();

router.get("/:groupId", expenseController.getExpensesByGroup);
router.post("/create/:groupId", expenseController.createExpense);
module.exports=router;
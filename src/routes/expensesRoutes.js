const express=require("express")
const expenseController=require('../controllers/expenseController');
const authMiddleware = require("../middlewares/authMiddleware");
const router=express.Router();

router.get("/:groupId", authMiddleware.protect, expenseController.getExpensesByGroup);
router.post("/create/:groupId", authMiddleware.protect, expenseController.createExpense);
router.get("/settlements/:groupId", authMiddleware.protect, expenseController.getSettlement);
module.exports=router;
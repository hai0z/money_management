const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

// Create a new budget
router.post("/", budgetController.createBudget);

// Get all budgets
router.get("/", budgetController.getAllBudgets);

// Get user's budgets
router.get("/user/:userId", budgetController.getUserBudgets);

// Get specific budget
router.get("/:id", budgetController.getBudget);

// Update budget
router.put("/:id", budgetController.updateBudget);

// Delete budget
router.delete("/:id", budgetController.deleteBudget);

// Get budget statistics
router.get("/:id/stats", budgetController.getBudgetStats);

module.exports = router;

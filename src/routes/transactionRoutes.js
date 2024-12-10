const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getAllTransactions);
router.get("/user/:userId", transactionController.getUserTransactions);
router.get("/:id", transactionController.getTransaction);
router.put("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);
router.get(
  "/user/:userId/period",
  transactionController.getTransactionsByPeriod
);
router.get("/wallet/:walletId", transactionController.getTransactionsByWallet);

router.get("/analyze/user/:userId", transactionController.analyzeTransactions);
module.exports = router;

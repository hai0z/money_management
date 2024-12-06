const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

router.post("/", walletController.createWallet);
router.get("/user/:userId", walletController.getUserWallets);
router.get("/:id", walletController.getWallet);
router.put("/:id", walletController.updateWallet);
router.delete("/:id", walletController.deleteWallet);

module.exports = router;

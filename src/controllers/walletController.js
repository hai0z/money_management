const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const walletController = {
  async createWallet(req, res) {
    try {
      const { userId, name, balance, currency } = req.body;
      const wallet = await prisma.wallet.create({
        data: {
          userId: parseInt(userId),
          name,
          balance: parseFloat(balance),
          currency,
        },
      });
      res.json(wallet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getUserWallets(req, res) {
    try {
      const { userId } = req.params;
      const wallets = await prisma.wallet.findMany({
        where: { userId: parseInt(userId) },
        include: {
          transactions: {
            include: {
              category: true,
            },
          },
        },
      });
      res.json(wallets);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getTotalBalance(req, res) {
    try {
      const { userId } = req.params;
      const wallets = await prisma.wallet.findMany({
        where: { userId: parseInt(userId) },
        select: {
          balance: true,
          currency: true,
        },
      });

      const totalBalance = wallets.reduce(
        (acc, wallet) => acc + parseFloat(wallet.balance),
        0
      );
      res.json({
        totalBalance,
        wallets: wallets.map((w) => ({
          balance: w.balance,
          currency: w.currency,
          id: w.id,
          name: w.name,
        })),
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getWallet(req, res) {
    try {
      const { id } = req.params;
      const wallet = await prisma.wallet.findUnique({
        where: { id: parseInt(id) },
        include: {
          transactions: {
            include: {
              category: true,
            },
          },
        },
      });
      res.json(wallet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateWallet(req, res) {
    try {
      const { id } = req.params;
      const { name, balance, currency } = req.body;
      const wallet = await prisma.wallet.update({
        where: { id: parseInt(id) },
        data: {
          name,
          balance: parseFloat(balance),
          currency,
        },
      });
      res.json(wallet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteWallet(req, res) {
    try {
      const { id } = req.params;
      await prisma.wallet.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: "Wallet deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = walletController;

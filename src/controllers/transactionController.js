const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const transactionController = {
  async createTransaction(req, res) {
    try {
      const {
        userId,
        categoryId,
        budgetId,
        amount,
        description,
        transactionDate,
        walletId,
      } = req.body;

      // Lấy thông tin category để biết là thu hay chi
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      });

      // Tính toán số tiền thực tế dựa vào loại giao dịch
      const actualAmount =
        category.type === "income" ? parseFloat(amount) : -parseFloat(amount);

      const transaction = await prisma.transaction.create({
        data: {
          userId: parseInt(userId),
          categoryId: parseInt(categoryId),
          budgetId: budgetId ? parseInt(budgetId) : null,
          amount: parseFloat(amount),
          description,
          transactionDate: new Date(transactionDate),
          walletId: parseInt(walletId),
        },
        include: {
          category: true,
          wallet: true,
          budget: true,
        },
      });

      // Cập nhật số dư ví dựa vào loại giao dịch (thu/chi)
      await prisma.wallet.update({
        where: { id: parseInt(walletId) },
        data: {
          balance: {
            increment: actualAmount,
          },
        },
      });

      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllTransactions(req, res) {
    try {
      const transactions = await prisma.transaction.findMany({
        include: {
          category: true,
          wallet: true,
          budget: true,
        },
      });
      res.json(transactions);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getUserTransactions(req, res) {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      const where = {
        userId: parseInt(userId),
      };

      if (startDate && endDate) {
        where.transactionDate = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      const transactions = await prisma.transaction.findMany({
        where,
        include: {
          category: true,
          wallet: true,
          budget: true,
        },
        orderBy: {
          transactionDate: "desc",
        },
      });
      res.json(transactions);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await prisma.transaction.findUnique({
        where: { id: parseInt(id) },
        include: {
          category: true,
          wallet: true,
          budget: true,
        },
      });
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateTransaction(req, res) {
    try {
      const { id } = req.params;
      const {
        categoryId,
        budgetId,
        amount,
        description,
        transactionDate,
        walletId,
      } = req.body;

      const oldTransaction = await prisma.transaction.findUnique({
        where: { id: parseInt(id) },
        include: {
          category: true,
        },
      });

      // Lấy thông tin category mới để biết là thu hay chi
      const newCategory = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      });

      // Tính toán số tiền cũ cần hoàn lại
      const oldActualAmount =
        oldTransaction.category.type === "income"
          ? -parseFloat(oldTransaction.amount)
          : parseFloat(oldTransaction.amount);

      // Tính toán số tiền mới cần cập nhật
      const newActualAmount =
        newCategory.type === "income"
          ? parseFloat(amount)
          : -parseFloat(amount);

      const transaction = await prisma.transaction.update({
        where: { id: parseInt(id) },
        data: {
          categoryId: parseInt(categoryId),
          budgetId: budgetId ? parseInt(budgetId) : null,
          amount: parseFloat(amount),
          description,
          transactionDate: new Date(transactionDate),
          walletId: parseInt(walletId),
        },
        include: {
          category: true,
          wallet: true,
          budget: true,
        },
      });

      // Cập nhật số dư ví: hoàn lại số cũ và cộng số mới
      await prisma.wallet.update({
        where: { id: parseInt(walletId) },
        data: {
          balance: {
            increment: oldActualAmount + newActualAmount,
          },
        },
      });

      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteTransaction(req, res) {
    try {
      const { id } = req.params;

      const transaction = await prisma.transaction.findUnique({
        where: { id: parseInt(id) },
        include: {
          category: true,
        },
      });

      // Tính toán số tiền cần hoàn lại dựa vào loại giao d��ch
      const actualAmount =
        transaction.category.type === "income"
          ? -parseFloat(transaction.amount)
          : parseFloat(transaction.amount);

      await prisma.transaction.delete({
        where: { id: parseInt(id) },
      });

      // Cập nhật số dư ví
      await prisma.wallet.update({
        where: { id: transaction.walletId },
        data: {
          balance: {
            increment: actualAmount,
          },
        },
      });

      res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getTransactionsByPeriod(req, res) {
    try {
      const { userId } = req.params;
      const { period } = req.query; // period có thể là: 'today', 'week', 'month'

      const now = new Date();
      let startDate = new Date();
      let endDate = new Date();

      // Thiết lập thời gian dựa vào period
      switch (period) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;

        case "week":
          // Lấy ngày đầu tuần (Thứ 2)
          const day = startDate.getDay();
          const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
          startDate = new Date(startDate.setDate(diff));
          startDate.setHours(0, 0, 0, 0);

          // Ngày cuối tuần (Chủ nhật)
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;

        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
          break;

        default:
          return res.status(400).json({ error: "Invalid period" });
      }

      // Lấy giao dịch trong khoảng thời gian
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: parseInt(userId),
          transactionDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          category: true,
          wallet: true,
        },
        orderBy: {
          transactionDate: "desc",
        },
      });

      // Tính tổng thu chi
      const totals = await prisma.$queryRaw`
        SELECT 
          SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END) as totalIncome,
          SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END) as totalExpense
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ${parseInt(userId)}
        AND t.transaction_date >= ${startDate}
        AND t.transaction_date <= ${endDate}
      `;

      // Nhóm giao dịch theo ngày
      const groupedTransactions = transactions.reduce((groups, transaction) => {
        const date = new Date(transaction.transactionDate)
          .toISOString()
          .split("T")[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
      }, {});

      res.json({
        periodSummary: {
          startDate,
          endDate,
          totalIncome: totals[0].totalIncome || 0,
          totalExpense: totals[0].totalExpense || 0,
        },
        groupedTransactions,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = transactionController;

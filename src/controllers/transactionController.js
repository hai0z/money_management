const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const transactionController = {
  async createTransaction(req, res) {
    try {
      const {
        userId,
        categoryId,
        amount,
        description,
        transactionDate,
        walletId,
        budgetId,
      } = req.body;

      console.log("Transaction request body:", req.body);

      // Kiểm tra category
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      });

      if (!category) {
        return res.status(400).json({ error: "Category not found" });
      }

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
      const { period } = req.query; // period có thể là: 'today', 'week', 'month', 'year',

      let startDate, endDate;
      const now = new Date();

      if (period === "custom") {
        startDate = req.query.startDate;
        endDate = req.query.endDate;
      } else {
        startDate = new Date();
        endDate = new Date();
      }
      // Thiết lập thời gian dựa vào period
      switch (period) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;

        case "week":
          // Lấy ngày đầu tuần (Thứ 2)
          startDate = new Date(now);
          startDate.setDate(
            now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
          );
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

        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), 11, 31);
          endDate.setHours(23, 59, 59, 999);
          break;

        case "custom":
          startDate = new Date(startDate);
          endDate = new Date(endDate);
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

      // Tính tổng thu chi theo category
      const categoryTotals = await prisma.$queryRaw`
        SELECT 
          c.id,
          c.name,
          c.type,
          SUM(t.amount) as total
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ${parseInt(userId)}
        AND t.transaction_date >= ${startDate}
        AND t.transaction_date <= ${endDate}
        AND c.type IN ('expense')
        GROUP BY c.id, c.name, c.type
      `;

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
          categoryTotals: categoryTotals.map((cat) => ({
            id: cat.id,
            name: cat.name,
            type: cat.type,
            total: parseFloat(cat.total) || 0,
          })),
        },
        groupedTransactions: Object.entries(groupedTransactions).reduce(
          (acc, [date, transactions]) => {
            const totals = transactions.reduce(
              (sums, transaction) => {
                if (transaction.category.type === "income") {
                  sums.totalIncome += parseFloat(transaction.amount);
                } else {
                  sums.totalExpense += parseFloat(transaction.amount);
                }
                return sums;
              },
              { totalIncome: 0, totalExpense: 0 }
            );

            acc[date] = {
              transactions,
              ...totals,
            };
            return acc;
          },
          {}
        ),
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getTransactionsByWallet(req, res) {
    try {
      const { walletId } = req.params;
      const { period } = req.query;

      let startDate, endDate;
      const now = new Date();

      if (period === "custom") {
        startDate = req.query.startDate;
        endDate = req.query.endDate;
      } else {
        startDate = new Date();
        endDate = new Date();
      }

      // Thiết lập thời gian dựa vào period
      switch (period) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;

        case "week":
          // Lấy ngày đầu tuần (Thứ 2)
          startDate = new Date(now);
          startDate.setDate(
            now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
          );
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

        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), 11, 31);
          endDate.setHours(23, 59, 59, 999);
          break;
      }

      // Query điều kiện cho wallet
      const walletCondition = walletId ? { id: parseInt(walletId) } : {};

      // Lấy thông tin ví và giao dịch
      const wallets = await prisma.wallet.findMany({
        where: walletCondition,
        include: {
          transactions: {
            where: {
              transactionDate: {
                gte: startDate,
                lte: endDate,
              },
            },
            include: {
              category: true,
            },
            orderBy: {
              transactionDate: "desc",
            },
          },
        },
      });

      // Tính tổng theo category và loại giao dịch cho mỗi ví
      const walletsWithStats = wallets.map((wallet) => {
        const categoryStats = wallet.transactions.reduce((acc, transaction) => {
          const categoryId = transaction.categoryId;
          if (!acc[categoryId]) {
            acc[categoryId] = {
              id: categoryId,
              name: transaction.category.name,
              type: transaction.category.type,
              total: 0,
              description: transaction.description,
              transactionDate: transaction.transactionDate,
              icon: transaction.category.icon,
            };
          }
          acc[categoryId].total += parseFloat(transaction.amount);
          return acc;
        }, {});

        const totals = wallet.transactions.reduce(
          (acc, transaction) => {
            if (transaction.category.type === "income") {
              acc.totalIncome += parseFloat(transaction.amount);
            } else {
              acc.totalExpense += parseFloat(transaction.amount);
            }
            return acc;
          },
          { totalIncome: 0, totalExpense: 0 }
        );

        return {
          id: wallet.id,
          name: wallet.name,
          balance: wallet.balance,
          currency: wallet.currency,
          transactions: wallet.transactions,
          categoryStats: Object.values(categoryStats),
          ...totals,
        };
      });

      res.json({
        period: {
          startDate,
          endDate,
        },
        wallets: walletsWithStats,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  analyzeTransactions: async (req, res) => {
    try {
      const { userId } = req.params;
      const { walletId, categoryId, period } = req.query;

      let startDate = new Date();
      let endDate = new Date();

      const now = new Date();

      // Xử lý period trước khi switch case
      if (period === "custom") {
        if (!req.query.startDate || !req.query.endDate) {
          return res.status(400).json({
            error: "Missing start date or end date for custom period",
          });
        }
        startDate = new Date(req.query.startDate);
        endDate = new Date(req.query.endDate);
      } else {
        switch (period) {
          case "today":
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;

          case "week":
            // Lấy ngày đầu tuần (Thứ 2)
            startDate = new Date(now);
            startDate.setDate(
              now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
            );
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

          case "year":
            startDate = new Date(now.getFullYear(), 0, 1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now.getFullYear(), 11, 31);
            endDate.setHours(23, 59, 59, 999);
            break;

          default:
            // Default to current month if period is invalid
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            endDate.setHours(23, 59, 59, 999);
        }
      }

      const whereConditions = {
        userId: parseInt(userId),
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      };

      if (walletId) {
        whereConditions.walletId = parseInt(walletId);
      }

      if (categoryId) {
        whereConditions.categoryId = {
          in: [
            parseInt(categoryId),
            ...(
              await prisma.category.findMany({
                where: { parentId: parseInt(categoryId) },
                select: { id: true },
              })
            ).map((cat) => cat.id),
          ],
        };
      }

      // Get transactions with related data
      const transactions = await prisma.transaction.findMany({
        where: whereConditions,
        include: {
          category: true,
          wallet: true,
        },
        orderBy: {
          transactionDate: "asc",
        },
      });

      // Analysis by category
      const categoryAnalysis = transactions.reduce((acc, transaction) => {
        const categoryId = transaction.categoryId;
        if (!acc[categoryId]) {
          acc[categoryId] = {
            id: categoryId,
            name: transaction.category.name,
            type: transaction.category.type,
            total: 0,
            count: 0,
            transactions: [],
            dailyAverage: 0,
            monthlyTotal: {},
          };
        }
        acc[categoryId].total += parseFloat(transaction.amount);
        acc[categoryId].count += 1;

        // Track monthly totals
        const monthYear = new Date(transaction.transactionDate).toLocaleString(
          "en-US",
          { month: "2-digit", year: "numeric" }
        );
        if (!acc[categoryId].monthlyTotal[monthYear]) {
          acc[categoryId].monthlyTotal[monthYear] = 0;
        }
        acc[categoryId].monthlyTotal[monthYear] += parseFloat(
          transaction.amount
        );

        acc[categoryId].transactions.push({
          id: transaction.id,
          amount: transaction.amount,
          date: transaction.transactionDate,
          description: transaction.description,
        });
        return acc;
      }, {});

      // Calculate daily averages for categories
      Object.values(categoryAnalysis).forEach((category) => {
        const daysDiff = Math.ceil(
          (endDate - startDate) / (1000 * 60 * 60 * 24)
        );
        category.dailyAverage = category.total / daysDiff;
      });

      // Analysis by wallet
      const walletAnalysis = transactions.reduce((acc, transaction) => {
        const walletId = transaction.walletId;
        if (!acc[walletId]) {
          acc[walletId] = {
            id: walletId,
            name: transaction.wallet.name,
            totalIncome: 0,
            totalExpense: 0,
            transactions: [],
            monthlyStats: {},
          };
        }
        if (transaction.category.type === "income") {
          acc[walletId].totalIncome += parseFloat(transaction.amount);
        } else {
          acc[walletId].totalExpense += parseFloat(transaction.amount);
        }

        // Track monthly stats
        const monthYear = new Date(transaction.transactionDate).toLocaleString(
          "en-US",
          { month: "2-digit", year: "numeric" }
        );
        if (!acc[walletId].monthlyStats[monthYear]) {
          acc[walletId].monthlyStats[monthYear] = {
            income: 0,
            expense: 0,
          };
        }
        if (transaction.category.type === "income") {
          acc[walletId].monthlyStats[monthYear].income += parseFloat(
            transaction.amount
          );
        } else {
          acc[walletId].monthlyStats[monthYear].expense += parseFloat(
            transaction.amount
          );
        }

        acc[walletId].transactions.push({
          id: transaction.id,
          amount: transaction.amount,
          type: transaction.category.type,
          date: transaction.transactionDate,
        });
        return acc;
      }, {});

      // Analysis by time
      const timeAnalysis = transactions.reduce((acc, transaction) => {
        const date = transaction.transactionDate.toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = {
            income: 0,
            expense: 0,
            transactions: [],
            categoryBreakdown: {},
          };
        }
        if (transaction.category.type === "income") {
          acc[date].income += parseFloat(transaction.amount);
        } else {
          acc[date].expense += parseFloat(transaction.amount);
        }

        // Track category breakdown per day
        if (!acc[date].categoryBreakdown[transaction.categoryId]) {
          acc[date].categoryBreakdown[transaction.categoryId] = {
            name: transaction.category.name,
            type: transaction.category.type,
            total: 0,
          };
        }
        acc[date].categoryBreakdown[transaction.categoryId].total += parseFloat(
          transaction.amount
        );

        acc[date].transactions.push({
          id: transaction.id,
          amount: transaction.amount,
          type: transaction.category.type,
          categoryName: transaction.category.name,
          categoryId: transaction.categoryId,
        });
        return acc;
      }, {});

      // Calculate totals and trends
      const totals = transactions.reduce(
        (acc, transaction) => {
          if (transaction.category.type === "income") {
            acc.totalIncome += parseFloat(transaction.amount);
          } else {
            acc.totalExpense += parseFloat(transaction.amount);
          }
          return acc;
        },
        {
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
        }
      );

      totals.netAmount = totals.totalIncome - totals.totalExpense;

      res.json({
        period: {
          startDate,
          endDate,
        },
        totals,
        categoryAnalysis: Object.values(categoryAnalysis),
        walletAnalysis: Object.values(walletAnalysis),
        timeAnalysis,
        selectedCategory: categoryId ? categoryAnalysis[categoryId] : null,
      });
    } catch (error) {
      console.error("Error in analyzeTransactions:", error);
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = transactionController;

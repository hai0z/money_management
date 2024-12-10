const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const budgetController = {
  async createBudget(req, res) {
    try {
      const { userId, amount, startDate, endDate, name } = req.body;

      const budget = await prisma.budget.create({
        data: {
          userId: parseInt(userId),
          amount: parseFloat(amount),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          name,
        },
      });

      res.json(budget);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllBudgets(req, res) {
    try {
      const budgets = await prisma.budget.findMany({
        include: {
          user: {
            select: {
              username: true,
              email: true,
            },
          },
          transactions: {
            include: {
              category: true,
            },
          },
        },
      });
      res.json(budgets);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getUserBudgets(req, res) {
    try {
      const { userId } = req.params;
      const { active } = req.query;

      let where = {
        userId: parseInt(userId),
      };

      // If active=true, only return current active budgets
      if (active === "true") {
        const currentDate = new Date();
        where = {
          ...where,
          startDate: {
            lte: currentDate,
          },
          endDate: {
            gte: currentDate,
          },
        };
      }

      const budgets = await prisma.budget.findMany({
        where,
        include: {
          transactions: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          startDate: "desc",
        },
      });

      // Calculate spent amount for each budget
      const budgetsWithProgress = await Promise.all(
        budgets.map(async (budget) => {
          const spent = await prisma.transaction.aggregate({
            where: {
              budgetId: budget.id,
              category: {
                type: "expense",
              },
            },
            _sum: {
              amount: true,
            },
          });

          return {
            ...budget,
            spent: spent._sum.amount || 0,
            remaining: parseFloat(budget.amount) - (spent._sum.amount || 0),
          };
        })
      );

      res.json(budgetsWithProgress);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getBudget(req, res) {
    try {
      const { id } = req.params;
      const budget = await prisma.budget.findUnique({
        where: { id: parseInt(id) },
        include: {
          transactions: {
            include: {
              category: true,
              wallet: true,
            },
            orderBy: {
              transactionDate: "desc",
            },
          },
        },
      });

      if (!budget) {
        return res.status(404).json({ error: "Budget not found" });
      }

      // Calculate spent amount
      const spent = await prisma.transaction.aggregate({
        where: {
          budgetId: budget.id,
          category: {
            type: "expense",
          },
        },
        _sum: {
          amount: true,
        },
      });

      // Get all transactions for this budget
      const transactions = await prisma.transaction.findMany({
        where: {
          budgetId: budget.id,
        },
        include: {
          category: true,
          wallet: true,
        },
        orderBy: {
          transactionDate: "desc",
        },
      });

      const budgetWithProgress = {
        ...budget,
        spent: spent._sum.amount || 0,
        remaining: parseFloat(budget.amount) - (spent._sum.amount || 0),
        transactions: transactions,
      };

      res.json(budgetWithProgress);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateBudget(req, res) {
    try {
      const { id } = req.params;
      const { amount, startDate, endDate } = req.body;

      const budget = await prisma.budget.update({
        where: { id: parseInt(id) },
        data: {
          amount: amount ? parseFloat(amount) : undefined,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
        include: {
          transactions: {
            include: {
              category: true,
            },
          },
        },
      });

      res.json(budget);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteBudget(req, res) {
    try {
      const { id } = req.params;

      await prisma.budget.delete({
        where: { id: parseInt(id) },
      });

      res.json({ message: "Budget deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getBudgetStats(req, res) {
    try {
      const { id } = req.params;

      const budget = await prisma.budget.findUnique({
        where: { id: parseInt(id) },
        include: {
          transactions: {
            include: {
              category: true,
            },
          },
        },
      });

      if (!budget) {
        return res.status(404).json({ error: "Budget not found" });
      }

      // Calculate category-wise spending
      const categorySpending = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
          budgetId: parseInt(id),
          category: {
            type: "expense",
          },
        },
        _sum: {
          amount: true,
        },
      });

      // Get category details
      const categoriesDetails = await prisma.category.findMany({
        where: {
          id: {
            in: categorySpending.map((cs) => cs.categoryId),
          },
        },
      });

      // Combine spending with category details
      const spendingByCategory = categorySpending.map((cs) => ({
        category: categoriesDetails.find((c) => c.id === cs.categoryId),
        amount: cs._sum.amount,
      }));

      // Calculate total spent
      const totalSpent = spendingByCategory.reduce(
        (sum, item) => sum + parseFloat(item.amount),
        0
      );

      res.json({
        budget,
        spendingByCategory,
        totalSpent,
        remaining: parseFloat(budget.amount) - totalSpent,
        percentageUsed: (totalSpent / parseFloat(budget.amount)) * 100,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = budgetController;

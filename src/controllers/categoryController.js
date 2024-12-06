const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categoryController = {
  async createCategory(req, res) {
    try {
      const { name, type, parentId, icon } = req.body;
      const category = await prisma.category.create({
        data: {
          name,
          type,
          parentId: parentId ? parseInt(parentId) : null,
          icon
        }
      });
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllCategories(req, res) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          children: true
        }
      });
      res.json(categories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: {
          children: true
        }
      });
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, type, parentId, icon, isActive } = req.body;
      const category = await prisma.category.update({
        where: { id: parseInt(id) },
        data: {
          name,
          type,
          parentId: parentId ? parseInt(parentId) : null,
          icon,
          isActive
        }
      });
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await prisma.category.delete({
        where: { id: parseInt(id) }
      });
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = categoryController; 
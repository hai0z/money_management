const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userController = {
  // Đăng ký người dùng mới
  async register(req, res) {
    try {
      const { username, password, email, fullName } = req.body;
      const user = await prisma.user.create({
        data: {
          username,
          password, // Note: Remember to hash password in production
          email,
          fullName,
        },
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Đăng nhập
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { username },
      });
      // Add your authentication logic here
      if (user && user.password === password) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lấy thông tin người dùng
  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Cập nhật thông tin người dùng
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { email, fullName } = req.body;
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { email, fullName },
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Xóa người dùng
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = userController;

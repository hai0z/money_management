const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userController = {
  // Đăng ký người dùng mới
  async register(req, res) {
    try {
      const { username, password, fullName } = req.body;

      // Check if username exists
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = await prisma.user.create({
        data: {
          username,
          password, // Note: Remember to hash password in production
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
        res.json({ message: "Login successful", user });
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
      const { username, email, fullName, address, phone, avatar, birthDate } =
        req.body;

      // Validate input data
      if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      if (phone && !phone.match(/^\+?[0-9]{10,15}$/)) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }

      // Check if username exists
      if (username) {
        const existingUsername = await prisma.user.findFirst({
          where: {
            username,
            NOT: {
              id: parseInt(id),
            },
          },
        });
        if (existingUsername) {
          return res.status(400).json({ error: "Username already exists" });
        }
      }

      // Check if email exists
      if (email) {
        const existingEmail = await prisma.user.findFirst({
          where: {
            email,
            NOT: {
              id: parseInt(id),
            },
          },
        });
        if (existingEmail) {
          return res.status(400).json({ error: "Email already exists" });
        }
      }

      // Only include fields that are provided in the request
      const updateData = {};
      if (email) updateData.email = email;
      if (fullName) updateData.fullName = fullName;
      if (address) updateData.address = address;
      if (phone) updateData.phone = phone;
      if (avatar) updateData.avatar = avatar;
      if (birthDate) updateData.birthDate = new Date(birthDate);
      if (username) updateData.username = username;

      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Đổi mật khẩu
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      // Kiểm tra mật khẩu hiện tại
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user || user.password !== currentPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Validate mật khẩu mới
      if (!newPassword || newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "New password must be at least 6 characters long" });
      }

      // Cập nhật mật khẩu mới
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { password: newPassword },
      });

      res.json({ message: "Password changed successfully" });
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

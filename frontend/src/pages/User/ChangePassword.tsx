import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Lock, KeyRound, Key, Save, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user?.user?.id}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast.success("Đổi mật khẩu thành công!");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi đổi mật khẩu!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto bg-base-100 rounded-2xl shadow-2xl p-8 border border-base-300 hover:shadow-3xl transition-all duration-300"
      >
        <div className="flex items-center gap-4 mb-8 border-b pb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="p-3 bg-primary/10 rounded-full"
          >
            <Lock className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-primary">Đổi mật khẩu</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div whileHover={{ scale: 1.02 }} className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 font-medium">
                <KeyRound className="w-4 h-4 text-primary" />
                Mật khẩu hiện tại
              </span>
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="input input-bordered w-full focus:input-primary transition-all hover:border-primary"
              required
              placeholder="Nhập mật khẩu hiện tại"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 font-medium">
                <Key className="w-4 h-4 text-secondary" />
                Mật khẩu mới
              </span>
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="input input-bordered w-full focus:input-primary transition-all hover:border-primary"
              required
              minLength={6}
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 font-medium">
                <Key className="w-4 h-4 text-accent" />
                Xác nhận mật khẩu mới
              </span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input input-bordered w-full focus:input-primary transition-all hover:border-primary"
              required
              minLength={6}
              placeholder="Nhập lại mật khẩu mới"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 justify-end pt-4 border-t"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-ghost gap-2 hover:bg-error/20"
            >
              <X className="w-4 h-4" />
              Hủy
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn btn-primary gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChangePassword;

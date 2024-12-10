import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { X, Minus, Square, LogIn, User, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        login(userData);
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng nhập");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
      <div
        className="w-full flex flex-row items-center justify-end backdrop-blur-3xl"
        style={{
          zIndex: "9999",
          position: "absolute",
          top: 0,
          height: 25,
          backgroundColor: "oklch(var(--b2))",
        }}
      >
        <div className="drag px-4 flex flex-row items-center justify-start backdrop:blur-md w-full flex-1 h-full"></div>
        <motion.div
          whileHover={{ backgroundColor: "rgba(var(--p) / 0.1)" }}
          className="cursor-pointer h-10 w-10 justify-center items-center flex"
        >
          <Minus className="mt-2" onClick={() => {}} />
        </motion.div>
        <motion.div
          whileHover={{ backgroundColor: "rgba(var(--p) / 0.1)" }}
          className="cursor-pointer h-10 w-10 justify-center items-center flex"
        >
          <Square size={18} className="mt-2" />
        </motion.div>
        <motion.div
          whileHover={{ backgroundColor: "rgba(var(--p) / 0.1)" }}
          onClick={close}
          className="cursor-pointer h-10 w-10 justify-center items-center flex"
        >
          <X className="mt-2" size={22} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-[400px] bg-base-100 shadow-2xl border border-primary/10"
      >
        <div className="card-body p-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-base-content/90">
              Chào mừng trở lại!
            </h2>
            <p className="text-base-content/60 text-center">
              Đăng nhập để tiếp tục quản lý tài chính của bạn
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Tên đăng nhập
                </span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập của bạn"
                className="input input-bordered bg-base-200/50 focus:border-primary"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mật khẩu
                </span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered bg-base-200/50 focus:border-primary"
                required
              />
              <label className="label">
                <a
                  href="#"
                  className="label-text-alt link link-primary hover:link-primary-focus"
                >
                  Quên mật khẩu?
                </a>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary w-full"
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </motion.button>

            <p className="text-center text-sm text-base-content/70">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="link link-primary hover:link-primary-focus"
              >
                Đăng ký ngay
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

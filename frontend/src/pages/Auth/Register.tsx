import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Square, Minus, X, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";

const Register = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const register = async (
    username: string,
    password: string,
    fullName: string
  ) => {
    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }

      toast.success("Đăng ký thành công!");
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Đăng ký thất bại");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);
      await register(formData.username, formData.password, formData.fullName);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-screen bg-base-100 flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-8">
        <div className="text-white max-w-xl">
          <h1 className="text-4xl font-bold mb-4">
            Chào mừng bạn đến với ứng dụng của chúng tôi
          </h1>
          <p className="text-lg opacity-90">
            Tạo tài khoản để trải nghiệm những tính năng tuyệt vời
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Window controls */}
        <div
          className="w-full flex flex-row items-center justify-end "
          style={{
            zIndex: "9999",
            position: "fixed",
            top: 0,
            right: 0,
            height: 25,
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

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-primary-content" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Đăng ký tài khoản
              </h2>
              <p className="text-base-content/60 text-base">
                Tạo tài khoản mới để bắt đầu
              </p>
            </div>

            {error && (
              <div className="alert alert-error bg-error/10 border border-error/20 mb-4">
                <span className="text-error text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">
                    Họ và tên
                  </span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input input-bordered bg-base-200/50 focus:bg-base-100 transition-colors h-10 text-sm"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">
                    Tên đăng nhập
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input input-bordered bg-base-200/50 focus:bg-base-100 transition-colors h-10 text-sm"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">
                    Mật khẩu
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors h-10 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-base-content/50" />
                    ) : (
                      <Eye className="w-4 h-4 text-base-content/50" />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">
                    Xác nhận mật khẩu
                  </span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input input-bordered bg-base-200/50 focus:bg-base-100 transition-colors h-10 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full h-10 text-base hover:scale-[1.02] transition-transform mt-6`}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>

            <div className="divider my-6">Hoặc</div>

            <p className="text-center text-base-content/70 text-sm">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="link link-primary font-medium hover:text-primary/80 transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;

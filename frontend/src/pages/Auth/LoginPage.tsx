import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Square, Minus, X, LogIn } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: localStorage.getItem("rememberedUsername") || "",
    password: localStorage.getItem("rememberedPassword") || "",
  });

  React.useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedUsername && rememberedPassword) {
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
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

        if (rememberMe) {
          localStorage.setItem("rememberedUsername", formData.username);
          localStorage.setItem("rememberedPassword", formData.password);
        } else {
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberedPassword");
        }

        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-base-100 flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-8">
        <div className="text-white max-w-xl">
          <h1 className="text-4xl font-bold mb-4">Chào mừng trở lại!</h1>
          <p className="text-lg opacity-90">
            Đăng nhập để tiếp tục quản lý tài chính của bạn
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
                <LogIn className="w-8 h-8 text-primary-content" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Đăng nhập
              </h2>
              <p className="text-base-content/60 text-base">
                Đăng nhập để tiếp tục
              </p>
            </div>

            {error && (
              <div className="alert alert-error bg-error/10 border border-error/20 mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <label className="label cursor-pointer">
                  <span className="label-text ml-2">Ghi nhớ đăng nhập</span>
                </label>
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full h-10 text-base hover:scale-[1.02] transition-transform mt-6`}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>

            <div className="divider my-6">Hoặc</div>

            <p className="text-center text-base-content/70 text-sm">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="link link-primary font-medium hover:text-primary/80 transition-colors"
              >
                Đăng ký
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

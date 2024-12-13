import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet as WalletIcon, ArrowLeft, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";

const AddWallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    balance: 0,
    userId: user?.user?.id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await toast.promise(
        fetch("http://localhost:3000/api/wallets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }),
        {
          loading: "Đang tạo ví...",
          success: () => {
            navigate("/wallet");
            return "Tạo ví thành công!";
          },
          error: "Có lỗi xảy ra khi tạo ví",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 bg-base-100 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-ghost btn-sm gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <div className="divider divider-horizontal"></div>
            <h1 className="text-2xl font-bold">Tạo ví mới</h1>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Form */}
          <div className="col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 rounded-2xl shadow-lg p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-medium">
                      Tên ví
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered input-lg w-full bg-base-100"
                    placeholder="Ví dụ: Ví tiền mặt, Ví ngân hàng..."
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-medium">
                      Số dư ban đầu
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/60 text-lg">
                      ₫
                    </span>
                    <input
                      name="balance"
                      value={
                        formData.balance
                          ? formData.balance.toLocaleString("vi-VN")
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[,.]/g, "");
                        setFormData((prev) => ({
                          ...prev,
                          balance: parseInt(rawValue) || 0,
                        }));
                      }}
                      className="input input-bordered input-lg w-full pl-8 bg-base-100"
                      placeholder="Nhập số dư hiện tại"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost btn-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Tạo ví mới
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Column - Preview Card */}
          <div className="col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-base-100 rounded-2xl shadow-lg overflow-hidden sticky top-8"
            >
              <div className="bg-gradient-to-r from-primary to-secondary p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <WalletIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Xem trước</p>
                    <h2 className="text-2xl font-bold text-white">
                      {formData.name || "Tên ví"}
                    </h2>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-white/80 text-sm">Số dư</p>
                  <p className="text-3xl font-bold text-white">
                    ₫ {formData.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWallet;

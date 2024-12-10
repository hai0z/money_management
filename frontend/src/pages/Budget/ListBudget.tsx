import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleDollarSign,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  ChevronRight,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  MoreVertical,
  ArrowRight,
  List,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/formatters";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { motion } from "framer-motion";

interface Budget {
  id: number;
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  spent: number;
  remaining: number;
}

const ListBudget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [viewMode, setViewMode] = useState("grid");
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/budgets/user/${user?.user?.id}`
        );
        const data = await response.json();
        setBudgets(data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    if (user?.user?.id) {
      fetchBudgets();
    }
  }, [user?.user?.id]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ngân sách này?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/budgets/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setBudgets(budgets.filter((budget) => budget.id !== id));
          toast.success("Xóa ngân sách thành công");
        } else {
          toast.error("Có lỗi xảy ra khi xóa ngân sách");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa ngân sách");
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 min-h-screen">
      {/* Header Section */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-1 ">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-4">
                  <CircleDollarSign className="w-12 h-12 text-primary" />
                  Quản lý ngân sách
                </h1>
              </div>
              <p className="text-base-content/60 mt-4 text-lg">
                Theo dõi và kiểm soát chi tiêu của bạn một cách hiệu quả
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/budgets/add")}
              className="btn btn-primary btn-lg gap-3 shadow-xl hover:shadow-primary/30"
            >
              <Plus size={24} />
              Thêm ngân sách mới
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stats shadow-xl bg-gradient-to-br from-base-100 to-primary/5"
          >
            <div className="stat">
              <div className="stat-figure text-primary">
                <CircleDollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Tổng ngân sách</div>
              <div className="stat-value text-primary">
                {formatCurrency(
                  budgets.reduce((acc, curr) => acc + Number(curr.amount), 0)
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stats shadow-xl bg-gradient-to-br from-base-100 to-success/5"
          >
            <div className="stat">
              <div className="stat-figure text-success">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title">Còn lại</div>
              <div className="stat-value text-success">
                {formatCurrency(
                  budgets.reduce(
                    (acc, curr) => acc + (curr.amount - curr.spent),
                    0
                  )
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stats shadow-xl bg-gradient-to-br from-base-100 to-error/5"
          >
            <div className="stat">
              <div className="stat-figure text-error">
                <TrendingDown className="w-8 h-8" />
              </div>
              <div className="stat-title">Đã chi tiêu</div>
              <div className="stat-value text-error">
                {formatCurrency(
                  budgets.reduce((acc, curr) => acc + Number(curr.spent), 0)
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Budget Cards */}
        <div className="flex justify-end mb-6">
          <div className="btn-group">
            <button
              className={`btn btn-sm ${
                viewMode === "grid" ? "btn-active" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              className={`btn btn-sm ${
                viewMode === "list" ? "btn-active" : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {budgets.map((budget, index) => {
              const isOverBudget = +budget.spent > +budget.amount;
              const progress = (budget.spent / budget.amount) * 100;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={budget.id}
                  onClick={() => navigate(`/budgets/${budget.id}`)}
                  className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-base-200 relative overflow-hidden cursor-pointer group bg-gradient-to-br from-base-100 to-primary/5"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full translate-y-12 -translate-x-12" />
                  <div className="card-body p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-primary/5 rounded-2xl animate-pulse"></div>
                            <CircleDollarSign className="text-primary w-10 h-10 relative z-10" />
                          </div>
                          <div className="flex flex-1 justify-center items-center">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              {budget.name}
                            </h2>
                          </div>
                        </div>
                        <div className="dropdown dropdown-end">
                          <label
                            tabIndex={0}
                            className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10"
                          >
                            <MoreVertical size={16} />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200 backdrop-blur-lg"
                          >
                            <li>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/budgets/edit/${budget.id}`);
                                }}
                                className="flex items-center gap-2 text-base-content hover:bg-primary/10"
                              >
                                <Pencil size={16} />
                                Chỉnh sửa
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(budget.id);
                                }}
                                className="flex items-center gap-2 text-error hover:bg-error/10"
                              >
                                <Trash2 size={16} />
                                Xóa
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-base-200/50 backdrop-blur-sm hover:bg-base-200/70 transition-colors">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">
                              {dayjs(budget.startDate).format("DD/MM/YYYY")}
                            </span>
                          </div>
                          <span className="text-base-content/40">→</span>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-base-200/50 backdrop-blur-sm hover:bg-base-200/70 transition-colors">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">
                              {dayjs(budget.endDate).format("DD/MM/YYYY")}
                            </span>
                          </div>
                        </div>
                        {dayjs().isAfter(budget.endDate) && (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-error/10 border border-error/20">
                            <span className="text-sm font-medium text-error">
                              Đã hết hạn
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <span className="text-base-content/60 text-sm">
                            Đã chi tiêu
                          </span>
                          <p className="text-2xl font-bold text-primary mt-1 font-mono">
                            {formatCurrency(budget.spent)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-base-content/60 text-sm">
                            Ngân sách
                          </span>
                          <p className="text-2xl font-bold mt-1 font-mono">
                            {formatCurrency(budget.amount)}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="w-full h-4 bg-base-200 rounded-full overflow-hidden backdrop-blur-sm border border-primary/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full relative ${
                              isOverBudget
                                ? "bg-gradient-to-r from-error to-error/70"
                                : "bg-gradient-to-r from-primary to-secondary"
                            }`}
                          >
                            <span className="absolute right-1 text-[10px] font-medium text-white leading-4">
                              {Math.min(progress, 100).toFixed(0)}%
                            </span>
                          </motion.div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-base-content/70">
                            {isOverBudget ? "Vượt chi" : "Còn lại"}
                          </span>
                          <span
                            className={`font-bold font-mono ${
                              isOverBudget ? "text-error" : "text-success"
                            }`}
                          >
                            {formatCurrency(
                              Math.abs(budget.amount - budget.spent)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-1 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="flex items-center gap-2 text-primary">
                        <span className="text-sm">Xem chi tiết</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {budgets.map((budget, index) => {
              const isOverBudget = +budget.spent > +budget.amount;
              const progress = (budget.spent / budget.amount) * 100;
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/budgets/${budget.id}`)}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative p-4 z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <CircleDollarSign className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <h2 className="text-xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {budget.name}
                          </h2>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-base-content/60" />
                              <p className="text-sm text-base-content/60">
                                {dayjs(budget.startDate).format("DD/MM/YYYY")}
                              </p>
                            </div>
                            <span className="text-base-content/40">→</span>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-base-content/60" />
                              <p className="text-sm text-base-content/60">
                                {dayjs(budget.endDate).format("DD/MM/YYYY")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="min-w-[200px] p-3 rounded-lg bg-base-100/50 backdrop-blur-sm border border-base-300/50 group-hover:border-primary/30 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-base-content/70">
                              {isOverBudget ? "Vượt chi" : "Còn lại"}
                            </span>
                            <span
                              className={`font-bold ${
                                isOverBudget ? "text-error" : "text-success"
                              }`}
                            >
                              {formatCurrency(
                                Math.abs(budget.amount - budget.spent)
                              )}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(progress, 100)}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full ${
                                isOverBudget
                                  ? "bg-gradient-to-r from-error to-error/70"
                                  : "bg-gradient-to-r from-primary to-secondary"
                              }`}
                            />
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {budgets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-base-100 rounded-3xl shadow-xl border border-base-200"
          >
            <CircleDollarSign className="w-24 h-24 text-primary/20 mx-auto mb-8" />
            <h3 className="text-3xl font-bold text-base-content/70">
              Chưa có ngân sách nào
            </h3>
            <p className="text-base-content/50 mt-4 text-lg max-w-md mx-auto">
              Tạo ngân sách đầu tiên của bạn để bắt đầu theo dõi và kiểm soát
              chi tiêu một cách hiệu quả
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/budgets/add")}
              className="btn btn-primary btn-lg gap-3 mt-8 shadow-lg hover:shadow-primary/30"
            >
              <Plus size={24} />
              Thêm ngân sách mới
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ListBudget;

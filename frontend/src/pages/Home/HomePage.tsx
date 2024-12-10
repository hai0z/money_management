import React from "react";
import {
  ArrowRight,
  CircleDollarSign,
  Eye,
  EyeOff,
  History,
  Notebook,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  BarChart2,
  PieChart,
  Clock,
  Calendar,
  CreditCard,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
} from "lucide-react";
import BarChart from "../../components/ui/BarChart";
import DonutChart from "../../components/ui/DonutChart";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/formatters";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = React.useState(true);
  const [budgets, setBudgets] = React.useState<any[]>([]);
  const [period, setPeriod] = React.useState("month");
  const { user } = useAuth();
  const [totalBalance, setTotalBalance] = React.useState(0);
  const [totalIncome, setTotalIncome] = React.useState(0);
  const [totalExpense, setTotalExpense] = React.useState(0);
  const [userTransactions, setUserTransactions] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const getTotalBalance = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/wallets/total-balance/${user?.user?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch balance");
      const data = await response.json();
      setTotalBalance(data.totalBalance);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getTransactionsByPeriod = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/transactions/user/${user?.user?.id}/period?period=${period}`
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTotalIncome(data.periodSummary.totalIncome);
      setTotalExpense(data.periodSummary.totalExpense);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getUserTransactions = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/transactions/user/${user?.user?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch user transactions");
      const data = await response.json();
      setUserTransactions(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getUserBudgets = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/budgets/user/${user?.user?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch budgets");
      const data = await response.json();
      setBudgets(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const refreshData = async () => {
    setError(null);
    try {
      await Promise.all([
        getTotalBalance(),
        getUserTransactions(),
        getUserBudgets(),
        getTransactionsByPeriod(),
      ]);
    } catch (err: any) {
      setError("Failed to refresh data");
    }
  };

  React.useEffect(() => {
    refreshData();
  }, [period]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-error">Error</h2>
          <p className="text-base-content/70">{error}</p>
          <button onClick={refreshData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-hidden min-h-[calc(100vh-6rem)] bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="px-4 h-full w-full my-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl font-bold ">
            Xin chào {user?.user?.fullName}!
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-100 shadow-lg"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium">Tổng số dư</h2>
                    <p className="text-3xl font-bold text-primary">
                      {showBalance ? formatCurrency(totalBalance) : "****** đ"}
                    </p>
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-circle"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-success/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-4 h-4 text-success" />
                    <span className="text-sm">Thu nhập</span>
                  </div>
                  <p className="text-xl font-bold text-success">
                    {showBalance ? formatCurrency(totalIncome) : "****** đ"}
                  </p>
                </div>

                <div className="bg-error/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownRight className="w-4 h-4 text-error" />
                    <span className="text-sm">Chi tiêu</span>
                  </div>
                  <p className="text-xl font-bold text-error">
                    {showBalance ? formatCurrency(totalExpense) : "****** đ"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-100 shadow-lg"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <CircleDollarSign className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium">Ngân sách</h2>
                    <p className="text-sm text-base-content/70">
                      {budgets.length} ngân sách hiện có
                    </p>
                  </div>
                </div>
                <Link to="/budgets" className="btn btn-ghost btn-sm">
                  Xem tất cả
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {budgets.length > 0 ? (
                <div className="space-y-4">
                  {budgets.slice(0, 1).map((budget) => (
                    <div
                      key={budget.id}
                      className="bg-base-200/50 p-4 rounded-xl"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">{budget.name}</h3>
                        <span className="text-sm text-base-content/70">
                          {dayjs(budget.endDate).diff(dayjs(), "day")} ngày còn
                          lại
                        </span>
                      </div>

                      <div className="w-full bg-base-300 rounded-full h-2.5 mb-2">
                        <div
                          className={`h-full rounded-full ${
                            budget.spent > budget.amount
                              ? "bg-error"
                              : "bg-success"
                          }`}
                          style={{
                            width: `${Math.min(
                              (budget.spent / budget.amount) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Đã chi: {formatCurrency(budget.spent)}</span>
                        <span>
                          Còn lại:{" "}
                          {formatCurrency(budget.amount - budget.spent)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-base-content/70 mb-3">
                    Chưa có ngân sách nào
                  </p>
                  <Link to="/budgets/add" className="btn btn-secondary btn-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm ngân sách
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="mx-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart2 className="w-8 h-8 text-primary" />
            Tình hình thu chi
          </h1>
          <motion.select
            whileHover={{ scale: 1.05 }}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="select select-bordered select-sm bg-base-100 min-w-[140px] shadow-sm"
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm này</option>
          </motion.select>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-base-100 rounded-2xl p-6 h-[450px]">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                Biểu đồ chi tiêu
              </h2>
              <BarChart period={period} />
            </div>
          </motion.div>

          {/* Right Column - Donut Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-base-100 rounded-2xl p-6 h-[450px]">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Phân bổ chi tiêu
              </h2>
              <DonutChart period={period} />
            </div>
          </motion.div>
        </div>

        <div className="divider"></div>

        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-6  flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-primary" />
              Giao dịch gần đây
            </div>
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to="/history"
                className="btn btn-ghost btn-sm gap-2 text-primary hover:bg-primary/10"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTransactions?.slice(0, 6).map((transaction, index) => (
              <motion.div
                onClick={() =>
                  navigate(`/transactions/edit-transaction/${transaction.id}`)
                }
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{
                  scale: 1.02,
                  translateY: -5,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                className="bg-base-100 rounded-2xl p-4 transition-all border border-primary/20 cursor-pointer hover:border-primary/40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-3 flex items-center justify-center">
                    <img
                      src={
                        transaction.category.icon || "https://picsum.photos/200"
                      }
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base-content/90 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {transaction.category.type === "expense" ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10">
                            <TrendingDown className="w-3 h-3 text-error" />
                            <span className="text-xs text-error font-medium">
                              Chi
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10">
                            <TrendingUp className="w-3 h-3 text-success" />
                            <span className="text-xs text-success font-medium">
                              Thu
                            </span>
                          </div>
                        )}
                        <span
                          className="whitespace-nowrap truncate max-w-[100px]"
                          title={transaction.category.name}
                        >
                          {transaction.category.name}
                        </span>
                      </div>
                      <span className="text-sm text-base-content/60 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dayjs(transaction.transactionDate).format(
                          "DD/MM/YYYY"
                        )}
                      </span>
                    </h3>
                    <p className="text-sm text-base-content/60 truncate mt-1 flex items-center gap-1">
                      <Notebook className="w-3 h-3" />
                      {transaction.description || "Không có ghi chú"}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs text-base-content/60 bg-base-200/50 px-2 py-1 rounded-full">
                        <CreditCard className="w-3 h-3" />
                        {transaction.wallet.name}
                      </div>
                      <p
                        className={`text-lg font-bold font-mono ${
                          transaction.category.type === "expense"
                            ? "text-error"
                            : "text-success"
                        }`}
                      >
                        {transaction.category.type === "expense" ? "-" : "+"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.5,
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        className="fixed bottom-8 right-16 group"
      >
        <Link
          to="/transactions/add-transaction"
          className="btn btn-primary btn-circle btn-lg shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 relative"
        >
          <Plus className="w-7 h-7 group-hover:rotate-180 transition-transform duration-300" />
          <div className="absolute -top-12 scale-0 group-hover:scale-100 transition-transform duration-200 bg-base-100 px-3 py-1.5 rounded-lg shadow-lg">
            <p className="text-sm whitespace-nowrap font-medium text-base-content">
              Thêm giao dịch mới
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default HomePage;

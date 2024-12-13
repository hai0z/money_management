import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  Plus,
  Sparkles,
  Rocket,
  Zap,
  LightbulbIcon,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import ReactApexChart from "react-apexcharts";

interface Transaction {
  id: number;
  amount: number;
  description: string;
  transactionDate: string;
  category: {
    name: string;
    icon: string;
    type: string;
  };
}

interface Budget {
  id: number;
  name: string;
  amount: number;
  spent: number;
  remaining: number;
  startDate: string;
  endDate: string;
  transactions: Transaction[];
}

const BudgetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [budget, setBudget] = React.useState<Budget | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState("");

  const [spendingByCategory, setSpendingByCategory] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/budgets/${id}`);
        const data = await response.json();
        setBudget(data);
      } catch (error) {
        console.error("Error fetching budget:", error);
      }
    };
    const fetchStats = async () => {
      const response = await fetch(
        `http://localhost:3000/api/budgets/${id}/stats`
      );
      const data = await response.json();
      setSpendingByCategory(data.spendingByCategory || []);
    };

    fetchBudget();
    fetchStats();
  }, [id]);

  if (!budget) return null;

  const progress = (budget.spent / budget.amount) * 100;
  const daysLeft = dayjs(budget.endDate).diff(dayjs(), "day");
  const isExpired = daysLeft < 0;

  const getSpendingAdvice = () => {
    const dailyBudget = budget.remaining / (daysLeft || 1);

    if (isExpired) {
      return {
        title: "Ngân sách đã kết thúc",
        message: "Hãy đánh giá lại chi tiêu và lập kế hoạch cho ngân sách mới",
        color: "text-base-content",
      };
    }

    if (budget.remaining <= 0) {
      return {
        title: "Cảnh báo vượt ngân sách!",
        message:
          "Bạn nên dừng chi tiêu và xem xét điều chỉnh kế hoạch tài chính",
        color: "text-error",
      };
    }

    if (progress >= 80) {
      return {
        title: "Cần thắt chặt chi tiêu!",
        message: `Bạn chỉ nên chi tiêu tối đa ${formatCurrency(
          dailyBudget
        )} mỗi ngày trong ${daysLeft} ngày tới`,
        color: "text-warning",
      };
    }

    if (daysLeft <= 7) {
      return {
        title: "Sắp kết thúc ngân sách",
        message: `Bạn có thể chi tiêu ${formatCurrency(
          dailyBudget
        )} mỗi ngày trong ${daysLeft} ngày còn lại`,
        color: "text-info",
      };
    }

    return {
      title: "Chi tiêu hợp lý",
      message: `Bạn có thể chi tiêu khoảng ${formatCurrency(
        dailyBudget
      )} mỗi ngày trong ${daysLeft} ngày tới`,
      color: "text-success",
    };
  };

  const handleDelete = async (id: number) => {
    if (confirmDelete === budget.name) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/budgets/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          toast.success("Xóa ngân sách thành công");
          navigate("/budgets");
        } else {
          toast.error("Có lỗi xảy ra khi xóa ngân sách");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa ngân sách");
      }
      setShowDeleteModal(false);
    } else {
      toast.error("Tên ngân sách không đúng");
    }
  };

  const advice = getSpendingAdvice();

  // Chart options for spending by category
  const pieChartOptions = {
    chart: {
      type: "pie" as const,
      background: "transparent",
      foreColor: "oklch(var(--bc))",
    },

    labels: spendingByCategory.map((stat) => stat.category.name),
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    legend: {
      position: "bottom" as const,
      labels: {
        colors: "oklch(var(--bc))", // Màu chữ cho legend
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
      style: {
        fontSize: "14px",
        colors: ["#fff"],
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => formatCurrency(value),
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  // Chart options for spending trend
  const lineChartOptions = {
    chart: {
      type: "line" as const,
      background: "transparent",
      foreColor: "oklch(var(--bc))",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    xaxis: {
      categories: budget.transactions
        .map((t) => dayjs(t.transactionDate).format("DD/MM"))
        .slice(-7),
    },
    yaxis: {
      labels: {
        formatter: (value: number) => formatCurrency(value),
      },
    },
    colors: ["#FF6384"],
    grid: {
      borderColor: "#f1f1f1",
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value: number) => formatCurrency(value),
      },
    },
  };

  const lineChartSeries = [
    {
      name: "Chi tiêu",
      data: budget.transactions.map((t) => t.amount).slice(-7),
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa ngân sách</h3>
            <p className="mb-4">
              Nhập "<span className="font-bold">{budget.name}</span>" để xác
              nhận xóa ngân sách này
            </p>
            <input
              type="text"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              className="input input-bordered w-full mb-4"
              placeholder="Nhập tên ngân sách"
            />
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmDelete("");
                }}
              >
                Hủy
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDelete(Number(id))}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="bg-base-100/80 backdrop-blur-xl border-b border-base-200 sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
              <Link to="/budgets" className="btn btn-ghost btn-sm gap-2">
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Link>
            </motion.div>
            <div className="divider divider-horizontal mx-0"></div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              {budget.name}
            </motion.h1>
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
                    setShowDeleteModal(true);
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
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-primary/20"
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-base-content/60 text-sm mb-1">
                    Tổng ngân sách
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {formatCurrency(budget.amount)}
                  </div>
                </div>
                <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg">
                  <CircleDollarSign className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-error/20"
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-base-content/60 text-sm mb-1">
                    Đã chi tiêu
                  </div>
                  <div className="text-2xl font-bold text-error">
                    {formatCurrency(budget.spent)}
                  </div>
                  <div className="text-sm text-base-content/60 mt-1">
                    {progress.toFixed(1)}% ngân sách
                  </div>
                </div>
                <div className="p-2 bg-gradient-to-br from-error/10 to-error/20 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-error" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-success/20"
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-base-content/60 text-sm mb-1">
                    Còn lại
                  </div>
                  <div className="text-2xl font-bold text-success">
                    {formatCurrency(budget.remaining)}
                  </div>
                  <div className="text-sm text-base-content/60 mt-1">
                    {(100 - progress).toFixed(1)}% ngân sách
                  </div>
                </div>
                <div className="p-2 bg-gradient-to-br from-success/10 to-success/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-primary/20"
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-base-content/60 text-sm mb-1">
                    Thời gian
                  </div>
                  <div className="text-2xl font-bold">
                    {isExpired ? "Đã kết thúc" : `${daysLeft} ngày`}
                  </div>
                  <div className="text-sm text-base-content/60 mt-1">
                    {dayjs(budget.startDate).format("DD/MM")} -{" "}
                    {dayjs(budget.endDate).format("DD/MM/YYYY")}
                  </div>
                </div>
                <div className="p-2 bg-gradient-to-br from-base-200 to-base-300 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Spending Advice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="card bg-base-100 shadow-lg border border-base-200 mb-8 hover:shadow-xl transition-all duration-300"
        >
          <div className="card-body">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-base-200 rounded-xl">
                <LightbulbIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${advice.color}`}>
                  {advice.title}
                </h3>
                <p className="text-base-content/70">{advice.message}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-base-100 shadow-lg border border-base-200 mb-8 hover:shadow-xl transition-all duration-300"
        >
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Tiến độ chi tiêu
              </h3>
              {progress >= 80 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-warning"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Đã sử dụng {progress.toFixed(1)}% ngân sách</span>
                </motion.div>
              )}
            </div>

            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col">
                <span className="text-base-content/60 text-sm">
                  Đã chi tiêu
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(budget.spent)}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-base-content/60 text-sm">
                  Tổng ngân sách
                </span>
                <span className="text-xl font-bold">
                  {formatCurrency(budget.amount)}
                </span>
              </div>
            </div>

            <div className="w-full h-4 bg-base-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full relative ${
                  progress >= 100
                    ? "bg-gradient-to-r from-error to-error/70"
                    : progress >= 80
                    ? "bg-gradient-to-r from-warning to-warning/70"
                    : "bg-gradient-to-r from-success to-success/70"
                }`}
              >
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-bold">
                  {progress.toFixed(1)}%
                </span>
              </motion.div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    progress >= 100
                      ? "bg-error"
                      : progress >= 80
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                ></div>
                <span className="text-base-content/70 text-sm">
                  {progress >= 100
                    ? "Vượt ngân sách"
                    : progress >= 80
                    ? "Gần hết ngân sách"
                    : "Trong ngân sách"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-base-content/60">Còn lại: </span>
                <span
                  className={`font-bold ${
                    progress >= 100 ? "text-error" : "text-success"
                  }`}
                >
                  {formatCurrency(Math.max(budget.amount - budget.spent, 0))}
                </span>
              </div>
            </div>

            {progress >= 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-error/10 rounded-xl flex items-center gap-2 text-error"
              >
                <AlertCircle className="w-5 h-5" />
                <div>
                  <span className="font-medium">Vượt ngân sách </span>
                  <span className="font-bold">
                    {formatCurrency(budget.spent - budget.amount)}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="card-body">
              <h3 className="text-lg font-bold mb-4">Chi tiêu theo danh mục</h3>
              <ReactApexChart
                options={pieChartOptions}
                series={spendingByCategory.map((stat) => +stat.amount)}
                type="pie"
                height={350}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="card-body">
              <h3 className="text-lg font-bold mb-4">
                Xu hướng chi tiêu 7 ngày qua
              </h3>
              <ReactApexChart
                options={lineChartOptions}
                series={lineChartSeries}
                type="line"
                height={350}
              />
            </div>
          </motion.div>
        </div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl transition-all duration-300"
        >
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" />
                Lịch sử giao dịch
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Danh mục</th>
                    <th>Mô tả</th>
                    <th>Ngày</th>
                    <th className="text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {budget?.transactions.map((transaction, index) => (
                    <motion.tr
                      onClick={() =>
                        navigate(
                          `/transactions/edit-transaction/${transaction.id}`
                        )
                      }
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={transaction.id}
                      className="hover cursor-pointer"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-base-200 to-base-300 p-2">
                            <img
                              src={transaction.category.icon}
                              alt={transaction.category.name}
                              className="w-full h-full"
                            />
                          </div>
                          <span className="font-medium">
                            {transaction.category.name}
                          </span>
                        </div>
                      </td>
                      <td>{transaction.description}</td>
                      <td>
                        {dayjs(transaction.transactionDate).format(
                          "DD/MM/YYYY"
                        )}
                      </td>
                      <td
                        className={`text-right font-medium ${
                          transaction.category.type === "expense"
                            ? "text-error"
                            : "text-success"
                        }`}
                      >
                        {transaction.category.type === "expense" ? "-" : "+"}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {budget?.transactions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium text-base-content/70">
                    Chưa có giao dịch nào
                  </p>
                  <motion.button
                    onClick={() => navigate("/transactions/add-transaction")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary btn-sm gap-2 mt-4"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm giao dịch mới
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BudgetDetail;

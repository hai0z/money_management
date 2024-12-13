import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  MoreVertical,
  Edit3,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/formatters";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import ReactApexChart from "react-apexcharts";

const WalletDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wallet, setWallet] = React.useState<any>(null);
  const [transactions, setTransactions] = React.useState<any>(null);
  const [periodStats, setPeriodStats] = React.useState({
    income: 0,
    expense: 0,
    dailyAverageIncome: 0,
    dailyAverageExpense: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = React.useState("month");
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState("");

  const pieChartOptions = {
    labels: ["Thu nhập", "Chi tiêu"],
    colors: ["#36D399", "#F87272"],
    legend: {
      position: "bottom" as const,
    },
    chart: {
      type: "donut" as const,
      foreColor: "oklch(var(--bc))",
    },
    tooltip: {
      y: {
        formatter: (value: number) => formatCurrency(value),
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
  };

  const pieChartSeries = [periodStats.income, periodStats.expense];

  const lineChartOptions = {
    chart: {
      type: "area" as const,
      toolbar: {
        show: false,
      },
      foreColor: "oklch(var(--bc))",
    },
    stroke: {
      curve: "smooth" as const,
      width: 2,
    },
    colors: ["#36D399", "#F87272"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories:
        transactions?.wallets[0]?.categoryStats?.map((stat: any) =>
          dayjs(stat.transactionDate).format("DD/MM")
        ) || [],
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return formatCurrency(value);
        },
      },
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
      name: "Thu nhập",
      data:
        transactions?.wallets[0]?.categoryStats
          ?.filter((stat: any) => stat.type === "income")
          .map((stat: any) => +stat.total) || [],
    },
    {
      name: "Chi tiêu",
      data:
        transactions?.wallets[0]?.categoryStats
          ?.filter((stat: any) => stat.type === "expense")
          .map((stat: any) => +stat.total) || [],
    },
  ];

  React.useEffect(() => {
    const fetchWalletDetails = async () => {
      const response = await fetch(`http://localhost:3000/api/wallets/${id}`);
      const data = await response.json();
      setWallet(data);
    };

    const fetchWalletTransactions = async () => {
      const response = await fetch(
        `http://localhost:3000/api/transactions/wallet/${id}?period=${selectedPeriod}`
      );
      const data = await response.json();

      // Calculate days in period
      const startDate = new Date(data.period.startDate).getTime();
      const endDate = new Date(data.period.endDate).getTime();
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      setPeriodStats({
        income: data.wallets[0].totalIncome,
        expense: data.wallets[0].totalExpense,
        dailyAverageIncome: data.wallets[0].totalIncome / daysDiff,
        dailyAverageExpense: data.wallets[0].totalExpense / daysDiff,
      });
      setTransactions(data);
    };

    Promise.all([fetchWalletDetails(), fetchWalletTransactions()]);
  }, [id, selectedPeriod]);

  const incomeTransactions = transactions?.wallets[0]?.categoryStats.filter(
    (transaction) => transaction.type === "income"
  );

  const expenseTransactions = transactions?.wallets[0]?.categoryStats.filter(
    (transaction) => transaction.type === "expense"
  );

  const periods = [
    { value: "today", label: "Hôm nay" },
    { value: "week", label: "Tuần này" },
    { value: "month", label: "Tháng này" },
    { value: "year", label: "Năm nay" },
  ];

  const handleDelete = async () => {
    if (deleteConfirmation !== wallet?.name) {
      toast.error("Tên ví không đúng");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/wallets/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Ví đã được xóa thành công");
        navigate("/wallet");
      } else {
        toast.error("Có lỗi xảy ra khi xóa ví");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa ví");
    } finally {
      setShowDeleteModal(false);
      setDeleteConfirmation("");
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-[1440px] mx-auto p-8">
        {/* Top Navigation Bar */}
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
            <h1 className="text-2xl font-bold">
              {wallet?.name || "Loading..."}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="dropdown dropdown-end z-50">
              <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                <MoreVertical className="w-4 h-4" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to={`/wallet/edit/${id}`}>
                    <Edit3 className="w-4 h-4" />
                    Chỉnh sửa ví
                  </Link>
                </li>
                <li>
                  <button
                    className="text-error"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa ví
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-2xl w-[400px]">
              <h3 className="text-lg font-bold mb-4">Xác nhận xóa ví</h3>
              <p className="text-sm text-base-content/70 mb-4">
                Nhập "<span className="font-bold">{wallet?.name}</span>" để xác
                nhận xóa ví này. Hành động này không thể hoàn tác.
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="input input-bordered w-full mb-4"
                placeholder="Nhập tên ví để xác nhận"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                  }}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleDelete}
                  disabled={deleteConfirmation !== wallet?.name}
                >
                  Xóa ví
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Wallet Stats */}
          <div className="col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-base-100 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-secondary p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <PiggyBank className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Số dư hiện tại</p>
                    <h2 className="text-2xl font-bold text-white">
                      {formatCurrency(wallet?.balance || 0)}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-success/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-success" />
                      <div>
                        <p className="text-sm text-base-content/70">Thu nhập</p>
                        <p className="font-semibold text-success">
                          {formatCurrency(periodStats.income)}
                        </p>
                        <p className="text-xs text-base-content/50">
                          Trung bình:{" "}
                          {formatCurrency(periodStats.dailyAverageIncome)}
                          /ngày
                        </p>
                      </div>
                    </div>
                    <span className="text-success text-sm">
                      +
                      {(
                        (periodStats.income / (wallet?.balance || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-error/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="w-5 h-5 text-error" />
                      <div>
                        <p className="text-sm text-base-content/70">Chi tiêu</p>
                        <p className="font-semibold text-error">
                          {formatCurrency(periodStats.expense)}
                        </p>
                        <p className="text-xs text-base-content/50">
                          Trung bình:{" "}
                          {formatCurrency(periodStats.dailyAverageExpense)}
                          /ngày
                        </p>
                      </div>
                    </div>
                    <span className="text-error text-sm">
                      -
                      {(
                        (periodStats.expense / (wallet?.balance || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>

                <div className="divider">Thời gian</div>

                <div className="flex flex-wrap gap-2">
                  {periods.map((period) => (
                    <button
                      key={period.value}
                      onClick={() => setSelectedPeriod(period.value)}
                      className={`btn btn-sm ${
                        selectedPeriod === period.value
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>

                {/* Pie Chart */}
                <div className="mt-6">
                  <ReactApexChart
                    options={pieChartOptions}
                    series={pieChartSeries}
                    type="donut"
                    height={250}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Transactions */}
          <div className="col-span-8 space-y-8">
            {/* Line Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 rounded-2xl shadow-lg overflow-hidden p-6"
            >
              <ReactApexChart
                options={lineChartOptions}
                series={lineChartSeries}
                type="area"
                height={350}
              />
            </motion.div>

            {/* Income Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <h2 className="text-xl font-bold">Thu nhập</h2>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Danh mục</th>
                      <th>Số tiền</th>
                      <th>% Tổng</th>
                      <th>Ngày</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomeTransactions?.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-base-200 p-2">
                            <img
                              src={transaction.icon}
                              alt="x"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.name}</p>
                          </div>
                        </td>
                        <td className="font-bold text-success">
                          {formatCurrency(transaction.total)}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-base-200 rounded-full h-2">
                              <div
                                className="bg-success h-2 rounded-full"
                                style={{
                                  width: `${
                                    (transaction.total / periodStats.income) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm">
                              {(
                                (transaction.total / periodStats.income) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </td>
                        <td>
                          {dayjs(transaction.transactionDate).format(
                            "DD/MM/YYYY"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Expense Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-5 h-5 text-error" />
                    <h2 className="text-xl font-bold">Chi tiêu</h2>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Danh mục</th>
                      <th>Số tiền</th>
                      <th>% Tổng</th>
                      <th>Ngày</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseTransactions?.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-base-200 p-2">
                            <img
                              src={transaction?.icon}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.name}</p>
                          </div>
                        </td>
                        <td className="font-bold text-error">
                          {formatCurrency(transaction.total)}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-base-200 rounded-full h-2">
                              <div
                                className="bg-error h-2 rounded-full"
                                style={{
                                  width: `${
                                    (transaction.total / periodStats.expense) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm">
                              {(
                                (transaction.total / periodStats.expense) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </td>
                        <td>
                          {dayjs(transaction.transactionDate).format(
                            "DD/MM/YYYY"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDetail;

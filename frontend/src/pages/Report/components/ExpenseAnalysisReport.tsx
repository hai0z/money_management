import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  TrendingUp,
  Wallet,
  BarChart3,
  ArrowLeft,
  Calendar,
  Filter,
  DollarSign,
  TrendingDown,
  Target,
} from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";
import { useAuth } from "../../../contexts/AuthContext";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";

const ExpenseAnalysisReport = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const { user } = useAuth();
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchWallets = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/wallets/user/${user?.user?.id}`
      );
      const data = await response.json();
      setWallets(data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/categories`);
      const data = await response.json();
      setCategories(data.filter((cat: any) => cat.type === "expense"));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchReport = async () => {
    try {
      let url = `http://localhost:3000/api/transactions/analyze/user/${user?.user?.id}?period=${selectedPeriod}`;

      if (selectedWallet) url += `&walletId=${selectedWallet}`;
      if (selectedCategory) url += `&categoryId=${selectedCategory}`;
      if (selectedPeriod === "custom" && customStartDate && customEndDate) {
        url += `&startDate=${customStartDate}&endDate=${customEndDate}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setReport(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  useEffect(() => {
    fetchWallets();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user?.user?.id) {
      fetchReport();
    }
  }, [
    selectedWallet,
    selectedCategory,
    selectedPeriod,
    customStartDate,
    customEndDate,
  ]);

  const getTimeSeriesChartOptions = () => {
    const dates = Object.keys(report?.timeAnalysis || {}).map((date) =>
      new Date(date).toLocaleDateString("vi-VN")
    );
    const expenses = Object.values(report?.timeAnalysis || {}).map(
      (data: any) => data.expense || 0
    );

    return {
      chart: {
        type: "area",
        height: 350,
        foreColor: "oklch(var(--bc))",
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => formatCurrency(value),
        },
        theme: "dark",
        x: {
          show: true,
          format: "dd/MM/yyyy",
        },
        marker: {
          show: true,
        },
        fixed: {
          enabled: true,
          position: "topRight",
          offsetX: 0,
          offsetY: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      xaxis: {
        categories: dates,
      },
      yaxis: {
        labels: {
          formatter: (value: number) => formatCurrency(value),
        },
      },
      colors: ["#EF4444"],
      series: [
        {
          name: "Chi tiêu",
          data: expenses,
        },
      ],
    };
  };

  const getCategoryPieChartOptions = () => {
    const expenseCategories =
      report?.categoryAnalysis?.filter((cat: any) => cat.type === "expense") ||
      [];
    const categories = expenseCategories.map((cat: any) => cat.name);
    const values = expenseCategories.map((cat: any) => Math.abs(cat.total));

    return {
      chart: {
        type: "pie",
        height: 350,
        foreColor: "oklch(var(--bc)",
      },
      tooltip: {
        y: {
          formatter: (value: number) => formatCurrency(value),
        },
      },
      labels: categories,
      series: values,
      colors: ["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6", "#EC4899"],
      legend: {
        position: "bottom",
      },
    };
  };

  const getDaysInRange = (selectedPeriod: string) => {
    if (selectedPeriod === "custom") {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    if (selectedPeriod === "today") {
      return 1;
    }
    if (selectedPeriod === "week") {
      return 7;
    }
    if (selectedPeriod === "month") {
      return 30;
    }
    if (selectedPeriod === "year") {
      return 365;
    }
    return 0;
  };
  return (
    <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-circle btn-ghost"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-4xl font-bold flex items-center gap-3 text-primary">
              <TrendingUp className="w-10 h-10" />
              Báo cáo chi tiêu
            </h2>
          </div>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="stat-title">Kỳ báo cáo</div>
              <div className="stat-value text-lg">
                {selectedPeriod === "month"
                  ? "Tháng này"
                  : selectedPeriod === "year"
                  ? "Năm nay"
                  : "Tùy chỉnh"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 p-6 rounded-2xl shadow-lg mb-8"
        >
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Filter className="w-5 h-5" />
            <h3 className="font-semibold">Bộ lọc</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="form-control">
              <select
                className="select select-bordered w-full focus:select-primary"
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
              >
                <option value="">Tất cả ví</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <select
                className="select select-bordered w-full focus:select-primary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục chi tiêu</option>
                {categories
                  .filter((category) => !category.parentId)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-control">
              <select
                className="select select-bordered w-full focus:select-primary"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="year">Năm nay</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
            </div>

            {selectedPeriod === "custom" && (
              <div className="col-span-4 grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="input input-bordered focus:input-primary"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
                <input
                  type="date"
                  className="input input-bordered focus:input-primary"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stats shadow bg-base-100"
          >
            <div className="stat">
              <div className="stat-figure text-error">
                <TrendingDown className="w-8 h-8" />
              </div>
              <div className="stat-title">Tổng chi tiêu</div>
              <div className="stat-value text-error">
                {formatCurrency(report?.totals?.totalExpense)}
              </div>
              <div className="stat-desc">Trong kỳ báo cáo</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stats shadow bg-base-100"
          >
            <div className="stat">
              <div className="stat-figure text-error">
                <Target className="w-8 h-8" />
              </div>
              <div className="stat-title">Chi tiêu trung bình/ngày</div>
              <div className="stat-value text-error">
                {formatCurrency(
                  report?.totals?.totalExpense / getDaysInRange(selectedPeriod)
                )}
              </div>
              <div className="stat-desc">
                Dựa trên {getDaysInRange(selectedPeriod)} ngày gần nhất
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h3 className="card-title text-primary flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Biểu đồ chi tiêu theo thời gian
              </h3>
              <ReactApexChart
                options={getTimeSeriesChartOptions() as ApexOptions}
                series={getTimeSeriesChartOptions().series}
                type="area"
                height={350}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h3 className="card-title text-primary flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Phân bổ chi tiêu theo danh mục
              </h3>
              <ReactApexChart
                options={getCategoryPieChartOptions() as ApexOptions}
                series={getCategoryPieChartOptions().series}
                type="pie"
                height={350}
              />
            </div>
          </motion.div>
        </div>

        {/* Detailed Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <h3 className="card-title text-2xl font-bold flex items-center gap-2 text-primary mb-6">
              <DollarSign className="w-6 h-6" />
              Chi tiết chi tiêu theo danh mục
            </h3>
            <div className="overflow-x-auto rounded-xl border border-base-300">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200/50">
                    <th className="text-base font-semibold">Danh mục</th>
                    <th className="text-base font-semibold text-center">
                      Số giao dịch
                    </th>
                    <th className="text-base font-semibold text-right">
                      Tổng chi tiêu
                    </th>
                    <th className="text-base font-semibold text-right">
                      Trung bình/ngày
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report?.categoryAnalysis
                    ?.filter((cat: any) => cat.type === "expense")
                    .map((cat: any) => (
                      <tr
                        key={cat.id}
                        className="hover:bg-base-200/50 transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          (
                            document.getElementById(
                              `modal-${cat.id}`
                            ) as HTMLDialogElement
                          )?.showModal();
                        }}
                      >
                        <td className="font-medium">{cat.name}</td>
                        <td className="text-center">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {cat.count}
                          </span>
                        </td>
                        <td className="text-error font-semibold text-right">
                          {formatCurrency(Math.abs(cat.total))}
                        </td>
                        <td className="text-right font-medium">
                          {formatCurrency(Math.abs(cat.dailyAverage))}
                        </td>
                        <dialog id={`modal-${cat.id}`} className="modal">
                          <div className="modal-box max-w-2xl">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-error" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold">
                                  Chi tiết giao dịch
                                </h3>
                                <p className="text-base-content/60">
                                  {cat.name}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {cat.transactions?.map((transaction: any) => (
                                <div
                                  key={transaction.id}
                                  className="p-4 rounded-xl border border-base-200 hover:bg-base-100/50 transition-colors"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-lg">
                                      {transaction.description}
                                    </span>
                                    <span className="text-error font-bold text-lg">
                                      {formatCurrency(
                                        Math.abs(transaction.amount)
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-base-content/60">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {new Date(
                                        transaction.date
                                      ).toLocaleDateString("vi-VN")}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="modal-action">
                              <form method="dialog">
                                <button className="btn btn-primary">
                                  Đóng
                                </button>
                              </form>
                            </div>
                          </div>
                          <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                          </form>
                        </dialog>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="bg-base-200/50 font-bold">
                    <td colSpan={2}>Tổng cộng</td>
                    <td className="text-error text-right">
                      {formatCurrency(
                        report?.categoryAnalysis
                          ?.filter((cat: any) => cat.type === "expense")
                          .reduce(
                            (sum: number, cat: any) =>
                              sum + Math.abs(cat.total),
                            0
                          )
                      )}
                    </td>
                    <td className="text-right">
                      {formatCurrency(
                        report?.categoryAnalysis
                          ?.filter((cat: any) => cat.type === "expense")
                          .reduce(
                            (sum: number, cat: any) =>
                              sum + Math.abs(cat.dailyAverage),
                            0
                          )
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpenseAnalysisReport;

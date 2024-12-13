import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  PencilLine,
  Calendar,
  ArrowLeft,
  Search,
  ArrowUpDown,
} from "lucide-react";
import ReactApexChart from "react-apexcharts";
import { useAuth } from "../../../contexts/AuthContext";
import { formatCurrency } from "../../../utils/formatters";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";
interface Wallet {
  id: number;
  name: string;
  balance: number;
  currency: string;
}

const CurrentFinanceReport = () => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [filteredWallets, setFilteredWallets] = useState<Wallet[]>([]);
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Wallet;
    direction: "asc" | "desc";
  }>({ key: "balance", direction: "desc" });

  const [totalIncome, setTotalIncome] = React.useState(0);
  const [totalExpense, setTotalExpense] = React.useState(0);

  const getTransactionsByPeriod = async (period: string) => {
    const response = await fetch(
      `http://localhost:3000/api/transactions/user/${user?.user?.id}/period?period=${period}`
    );
    const data = await response.json();
    console.log(data);
    setTotalIncome(data.periodSummary.totalIncome);
    setTotalExpense(data.periodSummary.totalExpense);
  };

  const getWallets = async () => {
    const response = await fetch(
      `http://localhost:3000/api/wallets/user/${user?.user.id}`
    );
    const data = await response.json();
    setWallets(data);
    setFilteredWallets(data);
  };

  useEffect(() => {
    getWallets();
    getTransactionsByPeriod(selectedPeriod);
  }, [selectedPeriod]);

  useEffect(() => {
    const filtered = wallets.filter(
      (wallet) =>
        wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wallet.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      const aValue =
        sortConfig.key === "balance"
          ? Number(a[sortConfig.key])
          : a[sortConfig.key];
      const bValue =
        sortConfig.key === "balance"
          ? Number(b[sortConfig.key])
          : b[sortConfig.key];

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    setFilteredWallets(sorted);
  }, [searchTerm, wallets, sortConfig]);

  const handleSort = (key: keyof Wallet) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const totalBalance = wallets.reduce(
    (acc, wallet) => acc + Number(wallet.balance),
    0
  );

  const pieChartOptions = {
    chart: {
      type: "donut" as const,
      background: "transparent",
      animations: {
        enabled: true,
        speed: 500,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    labels: wallets.map((w) => w.name),
    legend: {
      position: "bottom" as const,
      horizontalAlign: "center",
      floating: false,
      fontSize: "14px",
      fontFamily: "system-ui",
      labels: {
        colors: "oklch(var(--bc))",
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: false,
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val) + "%";
      },
    },
    tooltip: {
      y: {
        formatter: function (value: number) {
          return formatCurrency(value);
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

  const pieChartSeries = wallets.map((w) => Number(w.balance));

  return (
    <div className="p-6 space-y-8 bg-base-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-circle btn-ghost"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Báo cáo tài chính hiện tại
          </motion.h2>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="select select-bordered select-primary"
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-lg shadow-xl"
        >
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-base-content/60 font-medium">
                  Tổng số dư
                </p>
                <p className="text-2xl font-bold font-mono">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-success/10 to-primary/10 backdrop-blur-lg shadow-xl"
        >
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
              <div>
                <p className="text-sm text-base-content/60 font-medium">
                  Thu nhập{" "}
                  {selectedPeriod === "week"
                    ? "tuần"
                    : selectedPeriod === "month"
                    ? "tháng"
                    : selectedPeriod === "today"
                    ? "hôm"
                    : "năm"}{" "}
                  nay
                </p>
                <p className="text-2xl font-bold font-mono">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-error/10 to-warning/10 backdrop-blur-lg shadow-xl"
        >
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-error/20 flex items-center justify-center">
                <TrendingDown className="w-8 h-8 text-error" />
              </div>
              <div>
                <p className="text-sm text-base-content/60 font-medium">
                  Chi tiêu{" "}
                  {selectedPeriod === "week"
                    ? "tuần"
                    : selectedPeriod === "month"
                    ? "tháng"
                    : selectedPeriod === "today"
                    ? "hôm"
                    : "năm"}{" "}
                  nay
                </p>
                <p className="text-2xl font-bold font-mono">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Phân bổ tài sản
            </h3>
            <ReactApexChart
              options={pieChartOptions as ApexOptions}
              series={pieChartSeries}
              type="donut"
              height={400}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Chi tiết các ví
            </h3>

            <div className="flex gap-4 mb-4">
              <div className="form-control flex-1">
                <div className="input-group">
                  <span className="btn btn-square btn-ghost">
                    <Search className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm ví..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="dropdown dropdown-end z-[20]">
                <label tabIndex={0} className="btn btn-ghost gap-2">
                  <ArrowUpDown className="w-5 h-5" />
                  Sắp xếp
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <button onClick={() => handleSort("balance")}>
                      Theo số dư{" "}
                      {sortConfig.key === "balance" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleSort("name")}>
                      Theo tên{" "}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
              {filteredWallets.map((wallet, index) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-100 to-base-200 p-2 border border-base-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-base-content/60">
                          {wallet.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-xs text-success">Hoạt động</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-base-content mb-1 ml-4">
                        {wallet.name}
                      </h4>
                      <p className="font-mono text-2xl font-bold bg-base-100/50 inline-block px-4 py-2 rounded-xl">
                        {formatCurrency(wallet.balance)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        className="btn btn-sm btn-ghost gap-2"
                        onClick={() => navigate(`/wallet/${wallet.id}`)}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        Chi tiết
                      </button>
                      <button
                        className="btn btn-sm btn-ghost gap-2"
                        onClick={() => navigate(`/wallet/edit/${wallet.id}`)}
                      >
                        <PencilLine className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CurrentFinanceReport;

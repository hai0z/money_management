import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { formatCurrency } from "../utils/formatters";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  Wallet,
  History,
  Search,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState<any>(null);
  const [period, setPeriod] = React.useState<string>("month");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateRange, setDateRange] = React.useState({
    start: dayjs().format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
  });
  const [filteredTransactions, setFilteredTransactions] =
    React.useState<any>(null);

  const getTransactionsByPeriod = async (
    period: string,
    startDate?: string,
    endDate?: string
  ) => {
    let url = `http://localhost:3000/api/transactions/user/${user?.user?.id}/period?period=${period}`;

    if (period === "custom" && startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    setTransactions(data);
    setFilteredTransactions(data);
  };

  React.useEffect(() => {
    if (period === "custom") {
      getTransactionsByPeriod(period, dateRange.start, dateRange.end);
    } else {
      getTransactionsByPeriod(period);
    }
  }, [period, dateRange]);

  React.useEffect(() => {
    if (!transactions) return;

    if (searchTerm.trim() === "") {
      setFilteredTransactions(transactions);
      return;
    }

    const searchResults = {
      ...transactions,
      groupedTransactions: Object.keys(transactions.groupedTransactions).reduce(
        (acc: any, date) => {
          const filteredDayTransactions = transactions.groupedTransactions[
            date
          ].transactions.filter(
            (transaction: any) =>
              transaction.category.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              transaction.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              transaction.wallet.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              formatCurrency(transaction.amount).includes(searchTerm)
          );

          if (filteredDayTransactions.length > 0) {
            acc[date] = {
              ...transactions.groupedTransactions[date],
              transactions: filteredDayTransactions,
              totalIncome: filteredDayTransactions
                .filter((t: any) => t.category.type === "income")
                .reduce((sum: number, t: any) => sum + Number(t.amount), 0),
              totalExpense: filteredDayTransactions
                .filter((t: any) => t.category.type === "expense")
                .reduce((sum: number, t: any) => sum + Number(t.amount), 0),
            };
          }
          return acc;
        },
        {}
      ),
      periodSummary: {
        ...transactions.periodSummary,
        totalIncome: Object.values(transactions.groupedTransactions)
          .flatMap((group: any) => group.transactions)
          .filter(
            (t: any) =>
              t.category.type === "income" &&
              (t.category.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                t.description
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                t.wallet.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                formatCurrency(t.amount).includes(searchTerm))
          )
          .reduce((sum: number, t: any) => sum + Number(t.amount), 0),
        totalExpense: Object.values(transactions.groupedTransactions)
          .flatMap((group: any) => group.transactions)
          .filter(
            (t: any) =>
              t.category.type === "expense" &&
              (t.category.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                t.description
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                t.wallet.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                formatCurrency(t.amount).includes(searchTerm))
          )
          .reduce((sum: number, t: any) => sum + Number(t.amount), 0),
      },
    };

    setFilteredTransactions(searchResults);
  }, [searchTerm, transactions]);

  const totalTransactions = React.useMemo(() => {
    if (!filteredTransactions?.groupedTransactions) return 0;
    return Object.values(filteredTransactions.groupedTransactions).reduce(
      (total: number, group: any) => total + group.transactions.length,
      0
    );
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-8 h-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center gap-3 mb-8"
        >
          <History className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Lịch sử giao dịch
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-6">
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Tìm kiếm giao dịch..."
                      className="input input-primary w-full pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                  </div>

                  <div className="flex gap-4">
                    <select
                      className="select select-primary min-w-[180px] bg-base-100"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <option value="today">Hôm nay</option>
                      <option value="week">Tuần này</option>
                      <option value="month">Tháng này</option>
                      <option value="year">Năm này</option>
                      <option value="custom">Tùy chỉnh</option>
                    </select>
                  </div>
                </div>

                <AnimatePresence>
                  {period === "custom" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-base-300"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Từ ngày</span>
                          </label>
                          <input
                            type="date"
                            className="input input-bordered"
                            value={dateRange.start}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                start: e.target.value,
                              })
                            }
                            max={dateRange.end}
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Đến ngày</span>
                          </label>
                          <input
                            type="date"
                            className="input input-bordered"
                            value={dateRange.end}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                end: e.target.value,
                              })
                            }
                            min={dateRange.start}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="stats shadow-xl bg-base-100 w-full border border-base-300 backdrop-blur-lg bg-opacity-80">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="stat-title font-semibold text-base-content/70">
                  Tổng số giao dịch
                </div>
                <div className="stat-value text-primary text-2xl">
                  {totalTransactions}
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure text-success">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                </div>
                <div className="stat-title font-semibold text-base-content/70">
                  Tổng thu
                </div>
                <div className="stat-value text-success text-2xl">
                  {formatCurrency(
                    Number(
                      filteredTransactions?.periodSummary?.totalIncome || 0
                    )
                  )}
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure text-error">
                  <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-error" />
                  </div>
                </div>
                <div className="stat-title font-semibold text-base-content/70">
                  Tổng chi
                </div>
                <div className="stat-value text-error text-2xl">
                  {formatCurrency(
                    Number(
                      filteredTransactions?.periodSummary?.totalExpense || 0
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          <div className="space-y-6">
            {Object.keys(filteredTransactions?.groupedTransactions || {}).map(
              (date, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  key={date}
                  className="card bg-base-100 shadow-xl border border-base-300 backdrop-blur-lg bg-opacity-80 hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="card-body">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">
                          {dayjs(date).format("DD MMMM, YYYY")}
                        </h2>
                        <p className="text-base-content/60 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {dayjs(date).fromNow()}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20 hover:bg-success/20 transition-all">
                          <TrendingUp className="w-5 h-5 text-success" />
                          <p className="text-success font-bold text-lg">
                            {formatCurrency(
                              Number(
                                filteredTransactions?.groupedTransactions[date]
                                  ?.totalIncome || 0
                              )
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 border border-error/20 hover:bg-error/20 transition-all">
                          <TrendingDown className="w-5 h-5 text-error" />
                          <p className="text-error font-bold text-lg">
                            {formatCurrency(
                              Number(
                                filteredTransactions?.groupedTransactions[date]
                                  ?.totalExpense || 0
                              )
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      <div className="space-y-4">
                        {filteredTransactions?.groupedTransactions[
                          date
                        ]?.transactions.map((transaction: any) => (
                          <motion.div
                            onClick={() =>
                              navigate(
                                `/transactions/edit-transaction/${transaction.id}`
                              )
                            }
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={transaction.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-base-200/50 to-base-100/50 hover:from-base-200 hover:to-base-100 transition-all border border-base-300 cursor-pointer relative group overflow-hidden"
                          >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full translate-y-12 -translate-x-12" />

                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center shadow-lg border border-base-300 relative z-10">
                              <img
                                src={
                                  transaction.category.icon ||
                                  "https://picsum.photos/200"
                                }
                                className="w-8 h-8 rounded-lg object-cover"
                                alt={transaction.category.name}
                              />
                            </div>
                            <div className="flex-1 relative z-10">
                              <h3 className="font-semibold text-base-content">
                                {transaction.category.name}
                              </h3>
                              <p className="text-sm text-base-content/60">
                                {transaction.description}
                              </p>
                            </div>
                            <div className="text-right relative z-10">
                              <p
                                className={`font-bold text-lg font-mono ${
                                  transaction.category.type === "expense"
                                    ? "text-error"
                                    : "text-success"
                                }`}
                              >
                                {transaction.category.type === "expense"
                                  ? "-"
                                  : "+"}
                                {formatCurrency(Number(transaction.amount))}
                              </p>
                              <p className="text-sm text-base-content/60 flex items-center gap-1.5 justify-end mt-0.5">
                                <Wallet className="w-4 h-4" />
                                {transaction.wallet.name}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoryPage;

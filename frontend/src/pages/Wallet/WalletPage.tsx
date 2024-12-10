import React from "react";
import {
  CirclePlus,
  Pencil,
  Trash2,
  Wallet,
  ArrowRight,
  Info,
  TrendingUp,
  TrendingDown,
  History,
  List,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/formatters";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const WalletAccountPage = () => {
  const navigate = useNavigate();
  const [userWallets, setUserWallets] = React.useState<any[]>([]);
  const [totalBalance, setTotalBalance] = React.useState(0);
  const { user } = useAuth();
  const [totalIncome, setTotalIncome] = React.useState(0);
  const [totalExpense, setTotalExpense] = React.useState(0);
  const [viewMode, setViewMode] = React.useState("grid");
  const getTransactionsByPeriod = async () => {
    const response = await fetch(
      `http://localhost:3000/api/transactions/user/${user?.user?.id}/period?period=month`
    );
    const data = await response.json();
    console.log(data);
    setTotalIncome(data.periodSummary.totalIncome);
    setTotalExpense(data.periodSummary.totalExpense);
  };

  React.useEffect(() => {
    const fetchUserWallets = async () => {
      const response = await fetch(
        `http://localhost:3000/api/wallets/user/${user?.user?.id}`
      );
      const data = await response.json();
      setUserWallets(data);
    };

    const getTotalBalance = async () => {
      const response = await fetch(
        `http://localhost:3000/api/wallets/total-balance/${user?.user?.id}`
      );
      const data = await response.json();
      setTotalBalance(data.totalBalance);
    };

    Promise.all([
      fetchUserWallets(),
      getTotalBalance(),
      getTransactionsByPeriod(),
    ]);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5  p-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-secondary p-8 rounded-3xl shadow-2xl mb-8 backdrop-blur-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-lg">
                  <Wallet className="w-8 h-8 text-primary-content" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-primary-content">
                    Quản lý ví
                  </h1>
                  <p className="text-primary-content/80 mt-1">
                    Quản lý tài chính hiệu quả
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate("/wallet/add")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-lg glass text-primary-content gap-2 hover:bg-white/30"
              >
                <CirclePlus className="w-6 h-6" />
                Thêm ví mới
              </motion.button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <p className="text-primary-content/90 font-medium flex items-center gap-2">
                  <Info className="w-5 h-5" /> Tổng số dư
                </p>
                <h2 className="text-4xl font-bold text-primary-content mt-2">
                  {formatCurrency(totalBalance)}
                </h2>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <p className="text-primary-content/90 font-medium flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Thu nhập tháng này
                </p>
                <h2 className="text-4xl font-bold text-primary-content mt-2">
                  {formatCurrency(totalIncome)}
                </h2>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <p className="text-primary-content/90 font-medium flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" /> Chi tiêu tháng này
                </p>
                <h2 className="text-4xl font-bold text-primary-content mt-2">
                  {formatCurrency(totalExpense)}
                </h2>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Wallets Grid */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-end">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userWallets?.map((wallet, index) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/wallet/${wallet.id}`)}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-100 to-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full translate-y-12 -translate-x-12" />

                  <div className="relative p-6 z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {wallet.name}
                          </h2>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <History className="w-3.5 h-3.5 text-base-content/60" />
                            <p className="text-sm text-base-content/60">
                              {dayjs(wallet.createdAt).format("DD/MM/YYYY")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Balance Card */}
                    <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 border border-base-300">
                      <p className="text-sm font-medium text-base-content/70">
                        Số dư hiện tại
                      </p>
                      <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {formatCurrency(wallet.balance)}
                      </h3>
                    </div>

                    {/* Subtle indicator for clickable */}
                    <div className="absolute bottom-0 mb-1 mt-2 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 flex items-center gap-2">
                      <motion.div
                        initial={{ x: 10 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </motion.div>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-primary"
                      >
                        Xem chi tiết
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {userWallets?.map((wallet, index) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/wallet/${wallet.id}`)}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative p-4 z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Wallet className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <h2 className="text-xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {wallet.name}
                          </h2>
                          <div className="flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5 text-base-content/60" />
                            <p className="text-sm text-base-content/60">
                              {dayjs(wallet.createdAt).format("DD/MM/YYYY")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="min-w-[200px] p-3 rounded-lg bg-base-100/50 backdrop-blur-sm border border-base-300/50 group-hover:border-primary/30 transition-colors">
                          <p className="text-sm font-medium text-base-content/70">
                            Số dư hiện tại
                          </p>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
                            {formatCurrency(wallet.balance)}
                          </h3>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {userWallets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-base-100 rounded-3xl shadow-lg backdrop-blur-lg border border-base-200"
          >
            <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-base-content/70">
              Bạn chưa có ví nào
            </h3>
            <p className="text-base-content/50 mt-3 text-lg max-w-md mx-auto">
              Hãy tạo ví đầu tiên của bạn để bắt đầu quản lý tài chính một cách
              hiệu quả
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("wallet/add")}
              className="btn btn-primary btn-lg mt-8 gap-2"
            >
              <CirclePlus className="w-6 h-6" />
              Tạo ví mới
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WalletAccountPage;

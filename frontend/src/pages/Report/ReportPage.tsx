import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PieChart,
  LineChart,
  Wallet,
  TrendingUp,
  ChartBar,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";

const ReportPage = () => {
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5  p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <ChartBar className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Báo cáo tài chính
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 p-6 rounded-2xl shadow-lg mb-8 border border-base-200"
        >
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Tổng quan tài chính</h3>
              <p className="text-base-content/70">
                Xem các báo cáo chi tiết về tình hình tài chính của bạn. Phân
                tích thu chi, xu hướng chi tiêu và đánh giá sức khỏe tài chính
                tổng thể.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="card shadow-xl hover:shadow-2xl transition-all backdrop-blur-lg bg-opacity-90 border border-base-200 bg-gradient-to-br from-base-100 to-primary/5"
          >
            <div className="card-body">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <h2 className="card-title text-xl mb-2 text-base-content/90">
                Tài chính hiện tại
              </h2>
              <p className="text-base-content/60 mb-6 text-sm">
                Xem tổng quan về tình hình tài chính của bạn
              </p>
              <div className="card-actions justify-end">
                <Link
                  to="/report/current-finance"
                  className="btn btn-primary btn-sm gap-2 hover:gap-3 transition-all group"
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4 group-hover:transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="card shadow-xl hover:shadow-2xl transition-all backdrop-blur-lg bg-opacity-90 border border-base-200 bg-gradient-to-br from-base-100 to-secondary/5"
          >
            <div className="card-body">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/30 flex items-center justify-center mb-4">
                <LineChart className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="card-title text-xl mb-2 text-base-content/90">
                Tình hình thu chi
              </h2>
              <p className="text-base-content/60 mb-6 text-sm">
                Phân tích chi tiết thu nhập và chi tiêu
              </p>
              <div className="card-actions justify-end">
                <Link
                  to="/report/income-expense"
                  className="btn btn-secondary btn-sm gap-2 hover:gap-3 transition-all group"
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4 group-hover:transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="card shadow-xl hover:shadow-2xl transition-all backdrop-blur-lg bg-opacity-90 border border-base-200 bg-gradient-to-br from-base-100 to-error/5"
          >
            <div className="card-body">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-error/10 to-error/30 flex items-center justify-center mb-4">
                <PieChart className="w-8 h-8 text-error" />
              </div>
              <h2 className="card-title text-xl mb-2 text-base-content/90">
                Phân tích chi tiêu
              </h2>
              <p className="text-base-content/60 mb-6 text-sm">
                Thống kê chi tiết các khoản chi tiêu
              </p>
              <div className="card-actions justify-end">
                <Link
                  to="/report/expense-analysis"
                  className="btn btn-error btn-sm gap-2 hover:gap-3 transition-all group"
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4 group-hover:transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="card shadow-xl hover:shadow-2xl transition-all backdrop-blur-lg bg-opacity-90 border border-base-200 bg-gradient-to-br from-base-100 to-success/5"
          >
            <div className="card-body">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success/10 to-success/30 flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
              <h2 className="card-title text-xl mb-2 text-base-content/90">
                Phân tích thu nhập
              </h2>
              <p className="text-base-content/60 mb-6 text-sm">
                Thống kê chi tiết các nguồn thu nhập
              </p>
              <div className="card-actions justify-end">
                <Link
                  to="/report/income-analysis"
                  className="btn btn-success btn-sm gap-2 hover:gap-3 transition-all group"
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4 group-hover:transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-200">
            <h3 className="font-bold text-lg mb-4 text-primary">
              Lời khuyên tài chính
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-base-content/70">
                  Theo dõi chi tiêu hàng ngày để kiểm soát tài chính tốt hơn
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-base-content/70">
                  Lập kế hoạch ngân sách cho các mục tiêu tài chính
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-base-content/70">
                  Xem xét và điều chỉnh chi tiêu định kỳ
                </p>
              </li>
            </ul>
          </div>

          <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-200">
            <h3 className="font-bold text-lg mb-4 text-secondary">
              Mục tiêu tài chính
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                <p className="text-base-content/70">Thiết lập quỹ khẩn cấp</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                <p className="text-base-content/70">
                  Tiết kiệm cho các mục tiêu dài hạn
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                <p className="text-base-content/70">Cân đối thu chi hợp lý</p>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportPage;

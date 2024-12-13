import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  MinusCircle,
  Calendar,
  Wallet2,
  FileText,
  ArrowLeft,
  X,
  Target,
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AnUongLogo = new URL(
  "../../assets/app_icon/an-uong/an-uong.png",
  import.meta.url
).href;

interface Category {
  id: number;
  name: string;
  icon: string;
  type: "expense" | "income";
  parentId: number;
}

interface Budget {
  id: number;
  name: string;
  amount: number;
  spent: number;
  remaining: number;
}

const AddTransaction = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [type, setType] = React.useState<"expense" | "income">("expense");
  const [userWallets, setUserWallets] = React.useState<any[]>([]);
  const [userBudgets, setUserBudgets] = React.useState<Budget[]>([]);
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);
  const [selectedParentCategory, setSelectedParentCategory] =
    React.useState<Category | null>(null);
  const [showSubcategories, setShowSubcategories] = React.useState(false);
  const [showNoWalletWarning, setShowNoWalletWarning] = React.useState(false);

  // Form fields
  const [date, setDate] = React.useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = React.useState<string>("");
  const [amount, setAmount] = React.useState<number>(0);
  const [walletId, setWalletId] = React.useState<number>(0);
  const [budgetId, setBudgetId] = React.useState<number>(0);

  const addTransaction = async () => {
    toast.promise(
      fetch("http://localhost:3000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.user?.id,
          categoryId: selectedCategory?.id,
          amount,
          description: note,
          transactionDate: date,
          walletId,
          budgetId: budgetId || null,
        }),
      }),
      {
        loading: "Đang thêm giao dịch...",
        success: "Thêm giao dịch thành công!",
        error: "Có lỗi xảy ra khi thêm giao dịch",
      }
    );
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, walletsRes, budgetsRes] = await Promise.all([
          fetch("http://localhost:3000/api/categories"),
          fetch(`http://localhost:3000/api/wallets/user/${user?.user?.id}`),
          fetch(
            `http://localhost:3000/api/budgets/user/${user?.user?.id}?active=true`
          ),
        ]);

        const [categoriesData, walletsData, budgetsData] = await Promise.all([
          categoriesRes.json(),
          walletsRes.json(),
          budgetsRes.json(),
        ]);

        setCategories(categoriesData);
        setUserWallets(walletsData);
        setUserBudgets(budgetsData);

        // Check if user has no wallets
        if (walletsData.length === 0) {
          setShowNoWalletWarning(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user?.user?.id]);

  useEffect(() => {
    setSelectedCategory(null);
    setSelectedParentCategory(null);
  }, [type]);

  const handleCategorySelect = (category: Category) => {
    const hasSubcategories = categories.some((c) => c.parentId === category.id);

    if (hasSubcategories) {
      setSelectedParentCategory(category);
      setShowSubcategories(true);
    } else {
      setSelectedCategory(
        selectedCategory?.id === category.id ? null : category
      );
    }
  };

  const handleSubcategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedParentCategory(
      categories.find((c) => c.id === category.parentId) || null
    );
    setShowSubcategories(false);
  };

  const isSelected = (categoryId: number) =>
    selectedCategory?.id === categoryId ||
    selectedCategory?.parentId === categoryId ||
    selectedParentCategory?.id === categoryId;

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-6xl mx-auto mt-8 ">
        <div className="flex gap-4 ">
          {/* Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-2/3 bg-base-100 rounded-2xl shadow-lg border border-base-300 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary to-secondary text-primary-content">
              <div className="flex items-center justify-between mb-2">
                <Link to="/" className="btn btn-circle btn-ghost btn-sm">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-lg font-bold">Thêm giao dịch mới</h1>
                <div className="w-8" />
              </div>

              {/* Amount Input */}
              <div className="text-center">
                <input
                  value={amount ? amount.toLocaleString("vi-VN") : ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[,.]/g, "");
                    setAmount(parseInt(rawValue) || 0);
                  }}
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  className="text-3xl font-bold text-center bg-transparent border-none focus:outline-none text-primary-content placeholder-primary-content/50 w-full"
                />
                <p className="text-primary-content/70 mt-1 text-sm">VNĐ</p>
              </div>
            </div>

            {/* Category Grid */}
            <div className="p-4">
              <div className="space-y-3">
                {/* Transaction Type Toggle */}
                <div className="flex p-1 bg-base-200 rounded-full max-w-sm mx-auto">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType("expense")}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-full transition-all ${
                      type === "expense"
                        ? "bg-error text-white shadow-md"
                        : "text-base-content/70 hover:bg-base-300"
                    }`}
                  >
                    <MinusCircle className="w-4 h-4" />
                    Chi tiền
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType("income")}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-full transition-all ${
                      type === "income"
                        ? "bg-success text-white shadow-md"
                        : "text-base-content/70 hover:bg-base-300"
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Thu tiền
                  </motion.button>
                </div>

                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2 flex items-center justify-center"
                  >
                    <div
                      className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                        type === "expense" ? "bg-error/10" : "bg-success/10"
                      }`}
                    >
                      <img
                        src={selectedCategory.icon || AnUongLogo}
                        className="h-5 w-5"
                        alt={selectedCategory.name}
                      />
                      <span
                        className={`font-medium ${
                          type === "expense" ? "text-error" : "text-success"
                        }`}
                      >
                        {selectedCategory.name}
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-5 gap-2">
                  <AnimatePresence>
                    {categories
                      .filter((c) => c.parentId === null && c.type === type)
                      .map((category, index) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            transition: {
                              delay: index * 0.05,
                            },
                          }}
                          whileTap={{ scale: 0.95 }}
                          key={category.id}
                          onClick={() => handleCategorySelect(category)}
                          className={`aspect-square flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl cursor-pointer transition-all ${
                            isSelected(category.id)
                              ? "bg-primary text-primary-content shadow-md"
                              : "bg-base-200 hover:bg-base-300"
                          }`}
                        >
                          <img
                            src={category.icon || AnUongLogo}
                            className="h-6 w-6"
                            alt={category.name}
                          />
                          <p className="text-xs font-medium text-center line-clamp-2">
                            {category.name}
                          </p>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-1/3 bg-base-100 rounded-2xl shadow-lg border border-base-300 p-4"
          >
            <h2 className="text-xl font-bold mb-4">Chi tiết giao dịch</h2>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Ngày giao dịch</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="w-4 h-4 text-base-content/70" />
                  </div>
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    className="input input-bordered input-sm w-full pl-10 focus:outline-none focus:border-primary rounded-lg"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Chọn ví</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Wallet2 className="w-4 h-4 text-base-content/70" />
                  </div>
                  <select
                    className="select select-bordered select-sm w-full pl-10 focus:outline-none focus:border-primary rounded-lg"
                    value={walletId}
                    onChange={(e) => setWalletId(parseInt(e.target.value))}
                  >
                    <option disabled value={0}>
                      Chọn ví tiền
                    </option>
                    {userWallets?.map((wallet) => (
                      <option key={wallet.id} value={wallet.id}>
                        {wallet.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {type === "expense" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Chọn ngân sách
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Target className="w-4 h-4 text-base-content/70" />
                    </div>
                    <select
                      className="select select-bordered select-sm w-full pl-10 focus:outline-none focus:border-primary rounded-lg"
                      value={budgetId}
                      onChange={(e) => setBudgetId(parseInt(e.target.value))}
                    >
                      <option value={0}>Không sử dụng ngân sách</option>
                      {userBudgets?.map((budget) => (
                        <option key={budget.id} value={budget.id}>
                          {budget.name} - Còn{" "}
                          {budget.remaining.toLocaleString("vi-VN")}đ
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Ghi chú</span>
                </label>
                <div className="relative">
                  <div className="absolute top-2 left-3">
                    <FileText className="w-4 h-4 text-base-content/70" />
                  </div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="textarea textarea-bordered w-full pl-10 focus:outline-none focus:border-primary h-20 rounded-lg resize-none text-sm"
                    placeholder="Thêm ghi chú..."
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary w-full btn-sm mt-4 rounded-lg"
                onClick={addTransaction}
                disabled={!amount || !date || !walletId || !selectedCategory}
              >
                Lưu giao dịch
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="btn btn-ghost w-full btn-sm mt-2 rounded-lg"
                onClick={() => window.history.back()}
              >
                Quay lại
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subcategories Modal */}
      {showSubcategories && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-base-100 rounded-xl p-4 w-[400px] shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Chọn danh mục con</h3>
              <button
                className="btn btn-ghost btn-circle btn-sm"
                onClick={() => {
                  handleSubcategorySelect(selectedParentCategory!);
                  setShowSubcategories(false);
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Parent Category */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleSubcategorySelect(selectedParentCategory!)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer bg-primary text-primary-content shadow-md"
              >
                <img
                  src={selectedParentCategory?.icon || AnUongLogo}
                  className="w-10 h-10"
                  alt={selectedParentCategory?.name}
                />
                <p className="text-xs font-medium text-center">
                  {selectedParentCategory?.name}
                </p>
              </motion.div>

              {/* Subcategories */}
              {categories
                .filter((c) => c.parentId === selectedParentCategory?.id)
                .map((subcategory, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.05 },
                    }}
                    key={subcategory.id}
                    onClick={() => handleSubcategorySelect(subcategory)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer bg-base-200 hover:bg-base-300 transition-all"
                  >
                    <img
                      src={subcategory.icon || AnUongLogo}
                      className="w-10 h-10"
                      alt={subcategory.name}
                    />
                    <p className="text-xs font-medium text-center">
                      {subcategory.name}
                    </p>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* No Wallet Warning Modal */}
      {showNoWalletWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-base-100 rounded-xl p-6 w-[400px] shadow-xl"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-lg font-bold">Bạn chưa có ví tiền nào</h3>
              <p className="text-base-content/70">
                Vui lòng tạo ít nhất một ví tiền để thêm giao dịch
              </p>
              <div className="flex gap-2 mt-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate("/wallet/add")}
                >
                  Tạo ví tiền mới
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-ghost btn-sm"
                  onClick={() => window.history.back()}
                >
                  Quay lại
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AddTransaction;

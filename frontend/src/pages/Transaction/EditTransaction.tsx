import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  MinusCircle,
  Calendar,
  FileText,
  ArrowLeft,
  Trash2,
  Wallet2,
  X,
  Target,
} from "lucide-react";

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

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [type, setType] = React.useState<"expense" | "income">("expense");
  const [userWallets, setUserWallets] = React.useState<any[]>([]);
  const [userBudgets, setUserBudgets] = React.useState<Budget[]>([]);
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);
  const [date, setDate] = React.useState<string>("");
  const [note, setNote] = React.useState<string>("");
  const [amount, setAmount] = React.useState<number>(0);
  const [walletId, setWalletId] = React.useState<number>(0);
  const [budgetId, setBudgetId] = React.useState<number>(0);
  const [showSubcategories, setShowSubcategories] = React.useState(false);
  const [selectedParentCategory, setSelectedParentCategory] =
    React.useState<Category | null>(null);

  React.useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/transactions/${id}`
        );
        const data = await response.json();

        setType(data.category.type);
        setSelectedCategory(data.category);
        setDate(data.transactionDate.split("T")[0]);
        setNote(data.description);
        setAmount(data.amount);
        setWalletId(data.walletId);
        setBudgetId(data.budgetId || 0);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        toast.error("Không thể tải thông tin giao dịch");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchUserWallets = async () => {
      const response = await fetch(
        `http://localhost:3000/api/wallets/user/${user?.user?.id}`
      );
      const data = await response.json();
      setUserWallets(data);
    };

    const fetchUserBudgets = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/budgets/user/${user?.user?.id}`
        );
        const data = await response.json();
        setUserBudgets(data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchTransaction();
    fetchCategories();
    fetchUserWallets();
    fetchUserBudgets();
  }, [id]);

  const handleCategorySelect = (category: Category) => {
    const hasSubcategories = categories.some((c) => c.parentId === category.id);

    if (hasSubcategories) {
      setSelectedParentCategory(category);
      setShowSubcategories(true);
    } else {
      if (selectedCategory?.id === category.id) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(category);
      }
    }
  };

  const handleSubcategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedParentCategory(
      categories.find((c) => c.id === category.parentId) || null
    );
    setShowSubcategories(false);
  };

  const isSelected = (categoryId: number) => {
    return (
      selectedCategory?.id === categoryId ||
      selectedCategory?.parentId === categoryId ||
      selectedParentCategory?.id === categoryId
    );
  };

  const updateTransaction = async () => {
    toast.promise(
      fetch(`http://localhost:3000/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.user?.id,
          categoryId: selectedCategory?.id,
          amount: amount,
          description: note,
          transactionDate: date,
          walletId: walletId,
          budgetId: budgetId || null,
        }),
      }).then(() => {
        navigate(-1);
      }),
      {
        loading: "Đang cập nhật giao dịch...",
        success: "Cập nhật giao dịch thành công!",
        error: "Có lỗi xảy ra khi cập nhật giao dịch",
      }
    );
  };

  const deleteTransaction = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      toast.promise(
        fetch(`http://localhost:3000/api/transactions/${id}`, {
          method: "DELETE",
        }).then(() => {
          navigate(-1);
        }),
        {
          loading: "Đang xóa giao dịch...",
          success: "Xóa giao dịch thành công!",
          error: "Có lỗi xảy ra khi xóa giao dịch",
        }
      );
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-2rem)]">
          {/* Left Column - Categories */}
          <div className="col-span-8 h-full overflow-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-base-100 rounded-2xl shadow-lg overflow-hidden h-full"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-circle btn-ghost btn-sm"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <h1 className="text-xl font-bold text-white">
                    Chỉnh sửa giao dịch
                  </h1>
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
                    className="text-4xl font-bold text-center bg-transparent border-none focus:outline-none text-white placeholder-white/50 w-full"
                  />
                  <p className="text-white/70 mt-1">VNĐ</p>
                </div>
              </div>

              {/* Category Selection */}
              <div className="p-6">
                {/* Transaction Type Toggle */}
                <div className="flex p-1 bg-base-200 rounded-full max-w-md mx-auto mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType("expense")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all ${
                      type === "expense"
                        ? "bg-error text-white shadow-lg"
                        : "text-base-content/70 hover:bg-base-300"
                    }`}
                  >
                    <MinusCircle className="w-4 h-4" />
                    Chi tiền
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType("income")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all ${
                      type === "income"
                        ? "bg-success text-white shadow-lg"
                        : "text-base-content/70 hover:bg-base-300"
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Thu tiền
                  </motion.button>
                </div>
                {/* Categories Grid */}
                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-center justify-center"
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
                <div className="grid grid-cols-5 gap-3">
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
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={category.id}
                          onClick={() => handleCategorySelect(category)}
                          className={`aspect-square flex flex-col items-center justify-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${
                            isSelected(category.id)
                              ? "bg-primary text-primary-content shadow-lg"
                              : "bg-base-200 hover:bg-base-300"
                          }`}
                        >
                          <img
                            src={category.icon || AnUongLogo}
                            className="h-8 w-8"
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
            </motion.div>
          </div>

          {/* Right Column - Details */}
          <div className="col-span-4 h-full overflow-auto">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-base-100 rounded-2xl shadow-lg p-6 h-full"
            >
              <h2 className="text-xl font-bold mb-6">Chi tiết giao dịch</h2>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Ngày giao dịch
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <Calendar className="w-5 h-5 text-base-content/70" />
                    </div>
                    <input
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      type="date"
                      className="input input-bordered w-full pl-12"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Chọn ví</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <Wallet2 className="w-5 h-5 text-base-content/70" />
                    </div>
                    <select
                      className="select select-bordered w-full pl-12"
                      value={walletId}
                      onChange={(e) => setWalletId(parseInt(e.target.value))}
                    >
                      <option disabled value={0}>
                        Chọn ví tiền
                      </option>
                      {userWallets.map((wallet) => (
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
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <Target className="w-5 h-5 text-base-content/70" />
                      </div>
                      <select
                        className="select select-bordered w-full pl-12"
                        value={budgetId}
                        onChange={(e) => setBudgetId(parseInt(e.target.value))}
                      >
                        <option value={0}>Không có ngân sách</option>
                        {userBudgets.map((budget) => (
                          <option key={budget.id} value={budget.id}>
                            {budget.name} (
                            {budget.remaining.toLocaleString("vi-VN")} VNĐ còn
                            lại)
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
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FileText className="w-5 h-5 text-base-content/70" />
                    </div>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      type="text"
                      placeholder="Thêm ghi chú cho giao dịch"
                      className="input input-bordered w-full pl-12"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <button
                    onClick={updateTransaction}
                    className="btn btn-primary"
                    disabled={
                      !amount || !date || !walletId || !selectedCategory
                    }
                  >
                    Cập nhật giao dịch
                  </button>
                  <button onClick={deleteTransaction} className="btn btn-error">
                    <Trash2 className="w-5 h-5" />
                    Xóa giao dịch
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {showSubcategories && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-base-100 rounded-2xl p-6 w-[480px] shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Chọn danh mục con</h3>
              <button
                className="btn btn-ghost btn-circle btn-sm"
                onClick={() => setShowSubcategories(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Parent Category */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                onClick={() => {
                  handleSubcategorySelect(selectedParentCategory!);
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer bg-primary text-primary-content shadow-lg"
              >
                <img
                  src={selectedParentCategory?.icon || AnUongLogo}
                  className="w-12 h-12"
                  alt={selectedParentCategory?.name}
                />
                <p className="text-sm font-medium text-center">
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
                    className="flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer bg-base-200 hover:bg-base-300 transition-all"
                  >
                    <img
                      src={subcategory.icon || AnUongLogo}
                      className="w-12 h-12"
                      alt={subcategory.name}
                    />
                    <p className="text-sm font-medium text-center">
                      {subcategory.name}
                    </p>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EditTransaction;

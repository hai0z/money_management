import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CircleDollarSign, Calendar, Save } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

interface Budget {
  id: number;
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
}

const EditBudget = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = React.useState<Budget | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/budgets/${id}`);
        const data = await response.json();
        setBudget(data);
      } catch (error) {
        console.error("Error fetching budget:", error);
        toast.error("Không thể tải thông tin ngân sách");
      }
    };

    fetchBudget();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/budgets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budget),
      });

      if (response.ok) {
        toast.success("Cập nhật ngân sách thành công");
        navigate(`/budgets/${id}`);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật ngân sách");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật ngân sách");
    } finally {
      setLoading(false);
    }
  };

  if (!budget) return null;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Top Navigation Bar */}
      <div className="bg-base-100/80 backdrop-blur-xl border-b border-base-200 sticky top-0 ">
        <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/budgets/${id}`}
                className="btn btn-ghost btn-sm gap-2"
              >
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
              Chỉnh sửa ngân sách
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-xl border border-base-200"
        >
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Tên ngân sách</span>
                </label>
                <input
                  type="text"
                  value={budget.name}
                  onChange={(e) =>
                    setBudget({ ...budget, name: e.target.value })
                  }
                  className="input input-bordered bg-base-100 focus:border-primary"
                  placeholder="Nhập tên ngân sách"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Số tiền</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CircleDollarSign className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="number"
                    value={budget.amount}
                    onChange={(e) =>
                      setBudget({ ...budget, amount: Number(e.target.value) })
                    }
                    className="input input-bordered bg-base-100 pl-10 focus:border-primary"
                    placeholder="Nhập số tiền"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Ngày bắt đầu</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="date"
                      value={dayjs(budget.startDate).format("YYYY-MM-DD")}
                      onChange={(e) =>
                        setBudget({ ...budget, startDate: e.target.value })
                      }
                      className="input input-bordered bg-base-100 pl-10 focus:border-primary w-full"
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Ngày kết thúc
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="date"
                      value={dayjs(budget.endDate).format("YYYY-MM-DD")}
                      onChange={(e) =>
                        setBudget({ ...budget, endDate: e.target.value })
                      }
                      className="input input-bordered bg-base-100 pl-10 focus:border-primary w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`btn btn-primary w-full gap-2 ${
                    loading ? "loading" : ""
                  }`}
                  disabled={loading}
                >
                  {!loading && <Save className="w-4 h-4" />}
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditBudget;

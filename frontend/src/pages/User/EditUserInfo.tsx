import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User2,
  AtSign,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  address?: string;
  phone?: string;
  avatar?: string;
  birthDate?: string;
}

const EditUserInfo = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [user, setUser] = React.useState<User | null>(null);
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    fullName: "",
    address: "",
    phone: "",
    avatar: "",
    birthDate: "",
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`);
        const data = await response.json();
        setUser(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          fullName: data.fullName || "",
          address: data.address || "",
          phone: data.phone || "",
          avatar: data.avatar || "",
          birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
        });
      } catch (error) {
        toast.error("Không thể tải thông tin người dùng");
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert image"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      if (!base64.startsWith("data:image/")) {
        throw new Error("Invalid image format");
      }

      setFormData((prev) => ({
        ...prev,
        avatar: base64,
      }));
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Có lỗi xảy ra khi xử lý ảnh");
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Cập nhật thông tin thành công");
        navigate(-1);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex justify-center items-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn btn-circle btn-ghost"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <User2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Chỉnh sửa thông tin</h1>
            <p className="text-base-content/60">
              Cập nhật thông tin cá nhân của bạn
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Avatar Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/3"
          >
            <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <div className="relative group">
                  <div className="avatar">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-48 h-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden"
                    >
                      <img
                        src={
                          formData.avatar || "https://via.placeholder.com/150"
                        }
                        alt={formData.fullName}
                        className="object-cover w-full h-full"
                      />
                    </motion.div>
                  </div>
                  <label className="absolute bottom-0 right-0 btn btn-circle btn-primary cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-2xl font-bold mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {formData.fullName}
                </h2>
                <p className="text-base-content/60">@{formData.username}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-2/3"
          >
            <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6 text-primary">
                  Thông tin cá nhân
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="form-control"
                    >
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          <AtSign className="w-4 h-4 text-primary" /> Tên đăng
                          nhập
                        </span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all hover:border-primary"
                        required
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="form-control"
                    >
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          <User2 className="w-4 h-4 text-secondary" /> Họ và tên
                        </span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all hover:border-primary"
                        required
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="form-control"
                    >
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-accent" /> Email
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all hover:border-primary"
                        required
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="form-control"
                    >
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4 text-success" /> Số điện
                          thoại
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all hover:border-primary"
                        placeholder="Nhập số điện thoại của bạn"
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="form-control"
                    >
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-warning" /> Ngày
                          sinh
                        </span>
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all hover:border-primary"
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="form-control md:col-span-2"
                    >
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-error" /> Địa chỉ
                        </span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all hover:border-primary"
                        placeholder="Nhập địa chỉ của bạn"
                      />
                    </motion.div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="btn btn-primary flex-1 gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Lưu thay đổi
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn btn-outline flex-1 gap-2"
                    >
                      <X className="w-4 h-4" />
                      Hủy
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditUserInfo;

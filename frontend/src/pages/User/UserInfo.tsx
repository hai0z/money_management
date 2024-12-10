import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Settings,
  Camera,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const UserInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-circle btn-ghost"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Thông tin cá nhân
                </h1>
                <p className="text-base-content/60 mt-1">
                  Quản lý thông tin cá nhân của bạn
                </p>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                  <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center overflow-hidden">
                    {user?.user?.avatar ? (
                      <img
                        src={user.user.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-primary" />
                    )}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-6">Thông tin liên hệ</h3>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Email</p>
                        <p className="font-semibold">{user?.user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">
                          Số điện thoại
                        </p>
                        <p className="font-semibold">
                          {user?.user?.phone || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Địa chỉ</p>
                        <p className="font-semibold">
                          {user?.user?.address || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-6">Thông tin cá nhân</h3>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-info" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">
                          Họ và tên
                        </p>
                        <p className="font-semibold">
                          {user?.user?.fullName || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">
                          Ngày sinh
                        </p>
                        <p className="font-semibold">
                          {user?.user?.birthDate
                            ? new Date(user.user.birthDate).toLocaleDateString(
                                "vi-VN",
                                { dateStyle: "long" }
                              )
                            : "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/profile/edit"
                      className="btn btn-primary w-full gap-2 mt-4"
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa thông tin
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

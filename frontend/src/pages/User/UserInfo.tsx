import React, { useEffect, useState } from "react";
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
  AtSign,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface UserData {
  id: number;
  username: string;
  email: string;
  fullName: string;
  address?: string;
  phone?: string;
  avatar?: string;
  birthDate?: string;
}

const UserInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/${user?.user?.id}`
        );
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user?.user?.id) {
      fetchUser();
    }
  }, [user]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn btn-circle btn-ghost"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Thông tin cá nhân
            </h1>
            <p className="text-base-content/60 mt-1">
              Quản lý thông tin cá nhân của bạn
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Avatar & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/3"
          >
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body items-center text-center">
                {/* Avatar */}
                <div className="relative group mb-6">
                  <div
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-secondary p-1 cursor-pointer"
                    onClick={() => userData.avatar && setShowAvatarModal(true)}
                  >
                    <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center overflow-hidden">
                      {userData.avatar ? (
                        <img
                          src={userData.avatar}
                          alt="avatar"
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <User className="w-20 h-20 text-primary" />
                      )}
                    </div>
                  </div>
                  <button className="absolute bottom-2 right-2 btn btn-circle btn-primary btn-sm">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* User Basic Info */}
                <h2 className="text-2xl font-bold mb-1">{userData.fullName}</h2>
                <p className="text-base-content/60 mb-6">
                  @{userData.username}
                </p>

                {/* Quick Actions */}
                <Link
                  to={`/user/edit/${userData.id}`}
                  className="btn btn-primary w-full gap-2 hover:scale-105 transition-transform"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa thông tin
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Detailed Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:flex-1"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-6 text-primary">
                    Thông tin liên hệ
                  </h3>

                  <div className="space-y-6">
                    <InfoItem
                      icon={<Mail className="w-6 h-6 text-primary" />}
                      label="Email"
                      value={userData.email}
                      bgColor="bg-primary/10"
                    />

                    <InfoItem
                      icon={<Phone className="w-6 h-6 text-secondary" />}
                      label="Số điện thoại"
                      value={userData.phone}
                      bgColor="bg-secondary/10"
                    />

                    <InfoItem
                      icon={<MapPin className="w-6 h-6 text-accent" />}
                      label="Địa chỉ"
                      value={userData.address}
                      bgColor="bg-accent/10"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-6 text-secondary">
                    Thông tin cá nhân
                  </h3>

                  <div className="space-y-6">
                    <InfoItem
                      icon={<User className="w-6 h-6 text-info" />}
                      label="Họ và tên"
                      value={userData.fullName}
                      bgColor="bg-info/10"
                    />

                    <InfoItem
                      icon={<AtSign className="w-6 h-6 text-warning" />}
                      label="Tên đăng nhập"
                      value={userData.username}
                      bgColor="bg-warning/10"
                    />

                    <InfoItem
                      icon={<Calendar className="w-6 h-6 text-success" />}
                      label="Ngày sinh"
                      value={
                        userData.birthDate
                          ? new Date(userData.birthDate).toLocaleDateString(
                              "vi-VN",
                              { dateStyle: "long" }
                            )
                          : undefined
                      }
                      bgColor="bg-success/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && userData.avatar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-base-100 p-6 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl"
          >
            <button
              onClick={() => setShowAvatarModal(false)}
              className="absolute -top-2 -right-2 z-10 btn btn-circle btn-sm bg-base-100 hover:bg-base-200 shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="overflow-hidden rounded-xl border-4 border-base-200">
              <motion.img
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                src={userData.avatar}
                alt="avatar"
                className="w-full h-auto object-contain max-h-[80vh]"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  bgColor: string;
}) => (
  <div className="flex items-center gap-4 group hover:scale-105 transition-transform">
    <div
      className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}
    >
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-base-content/60">{label}</p>
      <p className="font-semibold">{value || "Chưa cập nhật"}</p>
    </div>
  </div>
);

export default UserInfo;

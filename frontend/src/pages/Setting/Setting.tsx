import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Shield,
  User,
  Languages,
  HelpCircle,
  LogOut,
  ChevronRight,
  CreditCard,
  Lock,
  Smartphone,
  Mail,
  Gift,
  Heart,
  Share2,
  MessageCircle,
  Camera,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../state/appSetting";

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

const Setting = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const { settings, setTheme } = useAppStore();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as "light" | "dark");
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

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

  const settingGroups = [
    {
      title: "Cá nhân",
      items: [
        {
          icon: <User className="w-5 h-5" />,
          title: "Thông tin tài khoản",
          description: "Cập nhật thông tin cá nhân của bạn",
          badge: "Mới",
          badgeColor: "badge-primary",
          link: "/user",
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: "Bảo mật",
          description: "Thay đổi mật khẩu và cài đặt bảo mật",
          badge: "Quan trọng",
          badgeColor: "badge-error",
          link: "/user/change-password",
        },
        {
          icon: <CreditCard className="w-5 h-5" />,
          title: "Phương thức thanh toán",
          description: "Quản lý thẻ và phương thức thanh toán",
        },
        {
          icon: <Lock className="w-5 h-5" />,
          title: "Quyền riêng tư",
          description: "Kiểm soát dữ liệu và quyền riêng tư của bạn",
        },
      ],
    },
    {
      title: "Tùy chỉnh",
      items: [
        {
          icon: <Bell className="w-5 h-5" />,
          title: "Thông báo",
          description: "Quản lý thông báo và nhắc nhở",
          badge: "4 mới",
          badgeColor: "badge-accent",
        },
        {
          icon: <Languages className="w-5 h-5" />,
          title: "Ngôn ngữ",
          description: "Thay đổi ngôn ngữ hiển thị",
          badge: "Tiếng Việt",
          badgeColor: "badge-ghost",
        },
        {
          icon: <Smartphone className="w-5 h-5" />,
          title: "Thiết bị",
          description: "Quản lý thiết bị đã đăng nhập",
        },
        {
          icon: <Mail className="w-5 h-5" />,
          title: "Email",
          description: "Tùy chỉnh cài đặt email",
        },
      ],
    },
    {
      title: "Nâng cao",
      items: [
        {
          icon: <Gift className="w-5 h-5" />,
          title: "Gói Premium",
          description: "Nâng cấp tài khoản của bạn",
          badge: "HOT",
          badgeColor: "badge-secondary",
        },
        {
          icon: <Heart className="w-5 h-5" />,
          title: "Giới thiệu bạn bè",
          description: "Nhận thưởng khi giới thiệu bạn bè",
        },
        {
          icon: <Share2 className="w-5 h-5" />,
          title: "Kết nối mạng xã hội",
          description: "Liên kết với các tài khoản mạng xã hội",
        },
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        {
          icon: <HelpCircle className="w-5 h-5" />,
          title: "Trợ giúp",
          description: "Xem hướng dẫn sử dụng",
          badge: "24/7",
          badgeColor: "badge-info",
        },
        {
          icon: <MessageCircle className="w-5 h-5" />,
          title: "Liên hệ hỗ trợ",
          description: "Gửi phản hồi hoặc báo lỗi",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-[320px] fixed "
          >
            <div className="card bg-base-100 shadow-xl backdrop-blur-lg bg-opacity-90 border border-base-200 sticky top-8">
              <div className="card-body p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative group mb-4">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                      <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center overflow-hidden">
                        {userData?.avatar ? (
                          <img
                            src={userData.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-14 h-14 text-primary" />
                        )}
                      </div>
                    </div>
                    <button className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-base-content">
                    {userData?.fullName || "Người dùng"}
                  </h2>
                  <p className="text-base-content/60 text-sm mt-1">
                    {userData?.email}
                  </p>

                  <div className="divider my-4"></div>

                  <div className="w-full">
                    <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        {settings.theme === "light" ? (
                          <Sun className="w-5 h-5 text-warning" />
                        ) : (
                          <Moon className="w-5 h-5 text-primary" />
                        )}
                        <span className="font-medium text-sm">Giao diện</span>
                      </div>
                      <select
                        className="select select-sm select-ghost"
                        value={settings.theme}
                        onChange={(e) => handleThemeChange(e.target.value)}
                      >
                        <option value="garden">Sáng</option>
                        <option value="dark">Tối</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="btn btn-error btn-outline w-full mt-4 gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 ml-[350px]">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Settings className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-4xl font-bold ">Cài đặt hệ thống</h1>
            </motion.div>

            <div className="space-y-6">
              {settingGroups.map((group, groupIndex) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  <h2 className="text-xl font-bold mb-4 text-base-content/80 flex items-center gap-2">
                    {group.title}
                    <div className="h-px flex-1 bg-gradient-to-r from-base-300 to-transparent ml-2"></div>
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {group.items.map((item) => (
                      <motion.div
                        onClick={() => navigate(item.link || "")}
                        key={item.title}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="card bg-base-100 shadow-lg hover:shadow-xl transition-all cursor-pointer backdrop-blur-lg bg-opacity-90 border border-base-200 hover:border-primary/20"
                      >
                        <div className="card-body flex flex-row items-center p-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mr-4">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base-content/90">
                                {item.title}
                              </h3>
                              {item.badge && (
                                <div
                                  className={`badge ${item.badgeColor} badge-sm`}
                                >
                                  {item.badge}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-base-content/60">
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-base-content/40" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Xác nhận đăng xuất</h3>
            <p className="py-4">
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowLogoutModal(false)}
              >
                Hủy
              </button>
              <button className="btn btn-error" onClick={confirmLogout}>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;

import React from "react";
import {
  ChartColumnBig,
  House,
  WalletMinimal,
  History,
  Settings,
  CircleDollarSign,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import NavBar from "../ui/NavBar";
import { Toaster } from "react-hot-toast";
const HomeLayout = () => {
  const pathName = useLocation().pathname;

  return (
    <div>
      <div className="bg-base-100 ">
        <div className="drawer drawer-open">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content w-full">
            <NavBar />
            <Outlet />
            <Toaster />
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-100 text-base-content menu-lg min-h-full space-y-1 pt-[10px]">
              <li
                className="tooltip tooltip-primary tooltip-bottom"
                data-tip="Trang chủ"
              >
                <Link
                  to={"/"}
                  className={`text-sm ${pathName === "/" ? "active" : ""}`}
                >
                  <House />
                </Link>
              </li>
              <li
                className="tooltip tooltip-primary tooltip-bottom"
                data-tip="Ví"
              >
                <Link
                  to="/wallet"
                  className={`text-sm ${
                    pathName.includes("/wallet") ? "active" : ""
                  }`}
                >
                  <WalletMinimal />
                </Link>
              </li>

              <li
                className="tooltip tooltip-primary tooltip-bottom"
                data-tip="Ngân sách"
              >
                <Link
                  to={"/budgets"}
                  className={`text-sm ${
                    pathName.includes("/budgets") ? "active" : ""
                  }`}
                >
                  <CircleDollarSign />
                </Link>
              </li>
              <li
                className="tooltip tooltip-primary tooltip-bottom"
                data-tip="Lịch sử"
              >
                <Link
                  to={"/history"}
                  className={`text-sm ${
                    pathName.includes("/history") ? "active" : ""
                  }`}
                >
                  <History />
                </Link>
              </li>
              <li
                className="tooltip tooltip-primary tooltip-bottom"
                data-tip="Báo cáo"
              >
                <Link
                  to={"/report"}
                  className={`text-sm ${
                    pathName.includes("/report") ? "active" : ""
                  }`}
                >
                  <ChartColumnBig />
                </Link>
              </li>
              <li
                className="tooltip tooltip-primary tooltip-bottom"
                data-tip="Cài đặt"
              >
                <Link
                  to={"/setting"}
                  className={`text-sm ${
                    pathName.includes("/setting") ? "active" : ""
                  }`}
                >
                  <Settings />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;

import React from "react";
import HomePage from "../../pages/HomePage";
import {
  ChartColumnBig,
  House,
  WalletMinimal,
  History,
  Settings,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import NavBar from "../ui/NavBar";

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
                data-tip="Trang chủ"
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
                data-tip="Tài khoản"
              >
                <Link
                  to="/wallet"
                  className={`text-sm ${
                    pathName === "/wallet" ? "active" : ""
                  }`}
                >
                  <WalletMinimal />
                </Link>
              </li>
              <li
                className="tooltip tooltip-primary tooltip-bottom"
                data-tip="Báo cáo"
              >
                <Link
                  to={"/report"}
                  className={`text-sm ${
                    pathName === "/report" ? "active" : ""
                  }`}
                >
                  <ChartColumnBig />
                </Link>
              </li>
              <li
                className="tooltip tooltip-primary tooltip-bottom"
                data-tip="Lịch sử"
              >
                <Link
                  to={"/history"}
                  className={`text-sm ${
                    pathName === "/history" ? "active" : ""
                  }`}
                >
                  <History />
                </Link>
              </li>
              <li
                className="tooltip tooltip-primary tooltip-bottom"
                data-tip="Cài đặt"
              >
                <a className="text-sm">
                  <Settings />
                </a>
              </li>
            </ul>
            <div className="bg-base-content/10 absolute h-full w-[2px] top-0 right-0"></div>
            <div className="absolute bottom-0 p-4  flex ">
              <label className="flex cursor-pointer gap-2 flex-col justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <input
                  type="checkbox"
                  value="business"
                  className="toggle theme-controller -rotate-90 my-2 "
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;

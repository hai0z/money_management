import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Minus, Square, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
dayjs.locale("vi");
const currentDate = dayjs().format("dddd, DD/MM/YYYY");

const AppLogo = new URL("../../assets/image/wallet.png", import.meta.url).href;

interface UserData {
  id: number;
  username: string;
  email: string;
  fullName: string;
  address?: string;
  phone?: string;
  avatar?: string;
}

const NavBar = () => {
  const { logout } = useAuth();

  return (
    <div className="sticky top-0 z-[50]">
      <div
        className="w-full flex flex-row items-center justify-end backdrop-blur-3xl"
        style={{
          zIndex: "9999",
          position: "sticky",
          top: 0,
          height: 25,
          backgroundColor: "oklch(var(--b1)/0.9)",
        }}
      >
        <div className="drag px-4 flex flex-row items-center justify-start backdrop:blur-md w-full flex-1 h-full "></div>
        <div className="cursor-pointer h-10 w-10 justify-center items-center flex  hover:bg-primary/10 ">
          <Minus className="mt-2" onClick={() => {}} />
        </div>
        <div className="cursor-pointer h-10 w-10 justify-center items-center flex hover:bg-primary/10">
          <Square size={18} className="mt-2" />
        </div>
        <div
          onClick={close}
          className="cursor-pointer h-10 w-10  justify-center items-center flex hover:bg-primary/10"
        >
          <X className="mt-2" size={22} />
        </div>
      </div>
      <div className="navbar bg-base-100 bg-opacity-90 backdrop-blur-sm">
        <div className="flex-1">
          <span className="btn btn-ghost">
            <img alt="app-logo" src={AppLogo} width={40} />

            <span className="text-2xl font-bold capitalize [&::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
              Quản lý chi tiêu
            </span>
          </span>
        </div>
        <div className="flex-none gap-2">
          <div className="mx-4">
            <span className="capitalize font-semibold text-lg">
              {currentDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

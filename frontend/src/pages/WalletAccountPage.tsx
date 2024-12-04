import React from "react";
import WalletLogo from "../assets/image/wallet.png";
import BankLogo from "../assets/image/bank.png";
import DollarLogo from "../assets/image/dollars.png";
import { CirclePlus, Eye, Pencil, Trash2 } from "lucide-react";
const WalletAccountPage = () => {
  return (
    <div className="w-full px-4 my-4">
      <div>
        <div className="flex flex-row items-center justify-between">
          <p className="text-3xl font-mono font-bold">Tài khoản</p>
          <div className="flex flex-row space-x-4 cursor-pointer">
            <CirclePlus className="text-primary" />
            <Pencil className="text-warning" />
            <Trash2 className="text-error" />
          </div>
        </div>
        <div>
          <p className="font-mono font-bold text-lg mt-2 ">
            Tổng số dư: <span className="text-secondary">80.000.000 đ</span>
          </p>
        </div>
        <div className="my-4 flex flex-row space-x-4 ">
          <div className="card card-side bg-primary/10 shadow-md w-full">
            <figure>
              <img src={WalletLogo} alt="Movie" className="w-48 p-4" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Ví tiền mặt</h2>
              <p className="font-semibold">30.000.000 đ</p>
              <div className="card-actions justify-end">
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-sm">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-side bg-primary/10 shadow-md w-full">
            <figure>
              <img src={BankLogo} alt="Movie" className="w-48 p-4" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Tài khoản ngân hàng</h2>
              <p className="font-semibold">40.000.000 đ</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">Xem chi tiết</button>
              </div>
            </div>
          </div>
          <div className="card card-side bg-primary/10 shadow-md w-full ">
            <figure>
              <img src={DollarLogo} alt="Movie" className="w-48 p-4" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Khác</h2>
              <p className="font-semibold">10.000.000 đ</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">Xem chi tiết</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletAccountPage;

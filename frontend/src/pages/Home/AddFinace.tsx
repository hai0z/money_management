import React from "react";
import AnUongLogo from "../../assets/app_icon/an-uong/an-uong.png";
const AddFinace = () => {
  return (
    <div className="px-4 my-4">
      <select className="select select-bordered w-full max-w-xs">
        <option disabled selected>
          Chọn hạng mục
        </option>
        <option>Chi tiền</option>
        <option>Thu tiền</option>
      </select>
      <div className="mt-4">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Số tiền</span>
          </div>
          <input
            type="text"
            placeholder="Nhập số tiền"
            className="input input-bordered w-full max-w-xs"
          />
          <div className="label"></div>
        </label>
      </div>
      <div className="mt-4 w-1/2">
        <div className="flex justify-between items-center">
          <p>Hạng mục</p>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => document.getElementById("category-drawer")?.click()}
          >
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div className="card compact card-bordered bg-primary/5 cursor-pointer hover:ring-[3px] hover:ring-primary hover:shadow-lg">
              <figure>
                <img src={AnUongLogo} className="h-12 p-1" />
              </figure>
              <div className="card-body">
                <h2 className="text-center font-semibold text-lg">Ăn uống</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer */}
      <div className="drawer drawer-end">
        <input id="category-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side z-[999]">
          <label htmlFor="category-drawer" className="drawer-overlay"></label>
          <div className="menu p-4 w-96 min-h-full bg-base-200 z-[999]">
            <h3 className="font-bold text-lg mb-4">Tất cả hạng mục</h3>
            {/* Add your categories list here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFinace;

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
        <p>Hạng mục</p>
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
    </div>
  );
};

export default AddFinace;

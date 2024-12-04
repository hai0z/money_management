import Logo1 from "../assets/image/financial-profit.png";
import Logo2 from "../assets/image/investment.png";
import Logo3 from "../assets/image/money.png";
import Logo4 from "../assets/image/piggy-bank.png";
import React from "react";
const ReportPage = () => {
  return (
    <div className="px-4 my-4">
      <div className="text-3xl font-mono font-bold">Báo cáo</div>
      <div className="my-4 flex flex-row space-x-4">
        <div className="card bg-primary/10 w-full shadow-md">
          <figure>
            <img src={Logo1} alt="Shoes" className="h-48 p-4" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Tài chính hiện tại</h2>

            <div className="card-actions justify-end">
              <button className="btn btn-primary">Xem</button>
            </div>
          </div>
        </div>
        <div className="card bg-primary/10 w-full shadow-md">
          <figure>
            <img src={Logo2} alt="Shoes" className="h-48 p-4" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Tình hình thu chi</h2>

            <div className="card-actions justify-end">
              <button className="btn btn-primary">Xem</button>
            </div>
          </div>
        </div>
        <div className="card bg-primary/10 w-full shadow-md">
          <figure>
            <img src={Logo3} alt="Shoes" className="h-48 p-4" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Phân tích chi tiêu</h2>

            <div className="card-actions justify-end">
              <button className="btn btn-primary">Xem</button>
            </div>
          </div>
        </div>
        <div className="card bg-primary/10 w-full shadow-md">
          <figure>
            <img src={Logo4} alt="Shoes" className="h-48 p-4" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Phân tích thu</h2>

            <div className="card-actions justify-end">
              <button className="btn btn-primary">Xem</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;

import React from "react";
import { ChevronDown, CirclePlus, Eye, EyeOff } from "lucide-react";
import BarChart from "../../components/ui/BarChart";
import DonutChart from "../../components/ui/DonutChart";
import { motion } from "framer-motion";
import AddFinace from "./AddFinace";
const HomePage = () => {
  const [showBalance, setShowBalance] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(!showModal);
  return (
    <div className="w-full relative overflow-hidden min-h-[calc(100vh-6rem)]">
      <div
        className={`absolute ${
          showModal
            ? "h-screen w-full z-20 -top-6"
            : "h-full w-full z-20 translate-y-[100vh]"
        } bg-base-100 transition-transform duration-1000`}
      >
        <div className="divider"></div>
        <div className="flex flex-row justify-center">
          <div
            className="-mt-6 w-20 h-4 rounded-b-full bg-primary flex justify-center items-center cursor-pointer mr-28"
            onClick={handleShowModal}
          >
            <ChevronDown className="text-primary-content" />
          </div>
        </div>
        <div>
          <AddFinace />
        </div>
      </div>
      <div className="px-4 bg-base-100 h-full w-full my-4">
        <h1 className="text-xl font-mono font-semibold">
          Xin chào Nguyễn Ngọc Hải!
        </h1>
        <div className="main-top my-4 flex flex-row gap-x-4">
          <div className="card bg-info/10 shadow-md text-base-content w-96 card-compact">
            <div className="card-body flex flex-row justify-between items-center">
              <div>
                <h2 className="card-title text-base-content">Tổng số dư</h2>
                <p className="font-bold text-xl text-base-content">
                  {showBalance ? "80.175.000 đ" : "***000 đ"}
                </p>
              </div>
              <div>
                {showBalance ? (
                  <Eye
                    onClick={() => setShowBalance(false)}
                    className="cursor-pointer"
                  />
                ) : (
                  <EyeOff
                    onClick={() => setShowBalance(true)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="card bg-accent/10 shadow-md text-base-content w-96 h-fit card-compact ">
            <div className="card-body flex flex-row justify-between flex-1 w-full">
              <div className="w-full">
                <h2 className="card-title mb-2 font-semibold">Hạn mức chi</h2>
                <div className="flex flex-row w-full gap-x-4">
                  <div>
                    <span className="font-semibold">Tháng 10</span>
                    <p>01/10 - 31/10</p>
                  </div>
                  <div className="ml-auto">
                    <span className="font-semibold font-mono text-lg text-base-content">
                      5.000.000 đ
                    </span>
                  </div>
                </div>
                <progress
                  className="progress progress-success w-full mt-2"
                  value={56}
                  max="100"
                ></progress>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="mx-4">
        <h1 className="text-xl font-mono font-semibold">Tình hình thu chi</h1>
        <div>
          <select
            defaultValue={"1"}
            className="select select-bordered w-full max-w-40 select-xs"
          >
            <option value={"1"}>Tháng này</option>
            <option value={"2"}> Tuần này</option>
          </select>

          <div className="flex flex-row gap-x-4 w-full">
            <BarChart />
            <div className="divider divider-horizontal"></div>
            <div className="card bg-base-100 text-base-content w-full h-fit">
              <div className="card-body flex flex-row justify-between flex-1 w-full">
                <div className="w-full">
                  <h2 className="card-title mb-2 font-semibold">Gần đây</h2>
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="flex flex-row">
                        <img
                          src="https://picsum.photos/200"
                          alt=""
                          className="w-10 h-10 rounded-full self-center"
                        />
                        <div className="ml-4">
                          <p>Đi lại</p>
                          <p className="text-sm text-base-content/80">
                            Đổ xăng
                          </p>
                          <p className="text-sm text-base-content/80">
                            Hôm nay
                          </p>
                        </div>
                        <div className="ml-auto">
                          <p className="text-error">50.000 đ</p>
                          <p className="text-sm">Ví tiền mặt</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="divider divider-horizontal"></div>
            <DonutChart />
          </div>
        </div>
      </div>
      <div className="btm-nav">
        <button
          className="text-base-content/10 active flex flex-row gap-x-2"
          onClick={handleShowModal}
        >
          <div className="flex flex-row gap-x-2 text-primary">
            <CirclePlus />
            Thêm
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomePage;

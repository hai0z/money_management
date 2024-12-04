import React from "react";

const HistoryPage = () => {
  return (
    <div className="my-4 px-4">
      <p className="text-3xl font-mono font-bold">Lịch sử ghi chép</p>
      <div>
        <div className="my-4">
          <select className="select select-bordered w-full max-w-xs">
            <option>Hôm nay</option>
            <option>Tháng này</option>
            <option>Tuần này</option>
            <option>Tuỳ chọn</option>
          </select>
          <div className="my-4">
            <div className="stats shadow bg-base-200 w-full max-w-xs ">
              <div className="stat">
                <div className="stat-title font-bold">Tổng thu</div>
                <div className="stat-value text-success">2.6M</div>
              </div>
              <div className="stat">
                <div className="stat-title font-bold">Tổng chi</div>
                <div className="stat-value text-error">3.6M</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="divider" />

      <div className="my-4">
        <div className="w-1/2">
          <div className="absolute bg-primary w-3 h-16" />
          <div className="flex flex-row ml-6 items-center w-full">
            <div>
              <p className=" stat-value">12</p>
            </div>
            <div className="flex flex-col ml-4 justify-center">
              <p className="text-sm">Hôm qua</p>
              <p className="text-sm">10/2024</p>
            </div>
            <div className="ml-auto flex flex-col justify-center items-end">
              <p className="font-bold text-success">1.200.000 đ</p>
              <p className="font-bold text-error">80.000 đ</p>
            </div>
          </div>
          <div className="w-full border border-dashed border-base-content/20 h-[1.75px] ml-6 mt-4"></div>
          <div className="relative  w-full ">
            <div className="h-full">
              <div className="border border-dashed border-base-content/20 w-[2px] h-[calc(100%-40px)] ml-6 absolute top-0"></div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p>8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p>8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p>8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p>8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p>8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider" />
        <div className="w-1/2">
          <div className="absolute bg-primary w-3 h-16" />
          <div className="flex flex-row ml-6 items-center w-full">
            <div>
              <p className=" stat-value">12</p>
            </div>
            <div className="flex flex-col ml-4 justify-center">
              <p className="text-sm">Hôm qua</p>
              <p className="text-sm">10/2024</p>
            </div>
            <div className="ml-auto flex flex-col justify-center items-end">
              <p className="font-bold text-success">1.200.000 đ</p>
              <p className="font-bold text-error">80.000 đ</p>
            </div>
          </div>
          <div className="w-full border border-dashed border-base-content/20 h-[1.75px] ml-6 mt-4"></div>
          <div className="relative  w-full ">
            <div className="h-full">
              <div className="border border-dashed border-base-content/20 w-[2px] h-[calc(100%-40px)] ml-6 absolute top-0"></div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p>8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p>8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p>8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p>8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider" />

        <div className="w-1/2">
          <div className="absolute bg-primary w-3 h-16" />
          <div className="flex flex-row ml-6 items-center w-full">
            <div>
              <p className="stat-value">12</p>
            </div>
            <div className="flex flex-col ml-4 justify-center">
              <p className="text-sm">Hôm qua</p>
              <p className="text-sm">10/2024</p>
            </div>
            <div className="ml-auto flex flex-col justify-center items-end">
              <p className="font-bold text-success">1.200.000 đ</p>

              <p className="font-bold text-error">80.000 đ</p>
            </div>
          </div>
          <div className="w-full border border-dashed border-base-content/20 h-[1.75px] ml-6 mt-4"></div>
          <div className="relative  w-full ">
            <div className="h-full">
              <div className="border border-dashed border-base-content/20 w-[2px] h-[calc(100%-40px)] ml-6 absolute top-0"></div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p className="text-error">8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-20 relative ml-12 mb-4 w-full ">
                <div className="border border-dashed border-base-content/20 w-[2px] h-10 absolute top-5 rotate-90"></div>
                <div className="top-3 absolute left-8 w-full">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://picsum.photos/200"
                      className="w-14 rounded-full"
                      alt=""
                    />
                    <div className="ml-4">
                      <p>Ăn uống</p>
                      <p className="text-sm text-base-content/70 italic">
                        Ăn cả ngày
                      </p>
                    </div>
                    <div className="ml-auto mr-14 flex justify-end flex-col items-end">
                      <p className="text-error">8.000.000 đ</p>
                      <p className="text-sm text-base-content/70">Tiền mặt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

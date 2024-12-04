import React from "react";
import ReactApexChart from "react-apexcharts";
const DonutChart = () => {
  const [series, setSeries] = React.useState([
    800_000, 1000_000, 2000_000, 700_000, 800_000, 1000_000, 2000_000, 700_000,
  ]);
  return (
    <div className="w-full flex flex-row gapx-4 ">
      <div className=" w-full flex items-center">
        <div className="w-full ">
          <ReactApexChart
            options={{
              chart: {
                height: 400,
                type: "donut",
                foreColor: "oklch(var(--bc)",
              },
              colors: [
                "oklch(var(--p)",
                "oklch(var(--s)",
                "oklch(var(--a)",
                "oklch(var(--n)",
                "oklch(var(--in)",
                "oklch(var(--su)",
                "oklch(var(--wa)",
                "oklch(var(--er)",
              ],
              dataLabels: {
                enabled: true,
              },
              legend: {
                position: "right",
              },
              labels: [
                "Ăn uống",
                "Sinh hoạt",
                "Mua sắm",
                "Đi lại",
                "ngân hàng",
                "hiếu hỉ",
                "sức khoẻ",
                "con cái",
              ],
            }}
            series={series}
            type="donut"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default DonutChart;

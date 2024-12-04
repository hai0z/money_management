import React from "react";
import ReactApexChart from "react-apexcharts";
const BarChart = () => {
  const [series, setSeries] = React.useState([
    {
      data: [3000_000, 2000_000],
      name: "Thu chi",
    },
  ]);
  return (
    <div className="w-full flex flex-row gapx-4 ">
      <div className="w-full">
        <ReactApexChart
          options={{
            chart: {
              height: 350,
              type: "bar",
              foreColor: "oklch(var(--bc)",
            },
            colors: ["oklch(var(--p)", "oklch(var(--s)"],
            plotOptions: {
              bar: {
                distributed: true,
              },
            },
            dataLabels: {
              enabled: false,
            },
            legend: {
              show: false,
            },
            xaxis: {
              categories: [""],
            },
          }}
          series={series}
          type="bar"
          height={350}
        />
      </div>
      <div className="w-full flex justify-center flex-col gap-y-3">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full"></div>
            <p>Thu</p>
          </div>
          <div>
            <p className="text-primary font-semibold">3.000.000 đ</p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 bg-secondary rounded-full"></div>
            <p>Chi</p>
          </div>
          <div>
            <p className="text-secondary font-semibold">2.000.000 đ</p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="flex justify-end">
          <p className="font-semibold">-1.000.000 đ</p>
        </div>
      </div>
    </div>
  );
};

export default BarChart;

import React from "react";
import ReactApexChart from "react-apexcharts";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/formatters";
const BarChart = ({ period }: { period: string }) => {
  const { user } = useAuth();

  const [series, setSeries] = React.useState([
    {
      data: [0, 0, 0],
      name: "",
    },
  ]);

  const getTransactionsByPeriod = async (period: string) => {
    const response = await fetch(
      `http://localhost:3000/api/transactions/user/${user?.user?.id}/period?period=${period}`
    );
    const data = await response.json();
    console.log(data);
    setSeries([
      {
        data: [data.periodSummary.totalIncome, data.periodSummary.totalExpense],
        name: "",
      },
    ]);
  };
  React.useEffect(() => {
    getTransactionsByPeriod(period);
  }, [period]);
  return (
    <div className="w-full flex flex-row gapx-4 ">
      <div className="w-full">
        <ReactApexChart
          options={{
            chart: {
              type: "bar",
              foreColor: "oklch(var(--bc)",
            },
            tooltip: {
              y: {
                formatter: (value: number) => formatCurrency(value),
              },
              theme: "dark",
              x: {
                show: true,
                format: "dd/MM/yyyy",
              },
              marker: {
                show: true,
              },
              fixed: {
                enabled: true,
                position: "topRight",
                offsetX: 0,
                offsetY: 0,
              },
            },
            colors: ["oklch(var(--su)", "oklch(var(--er)"],
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
              categories: ["", ""],
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
            <div className="w-4 h-4 bg-success rounded-full"></div>
            <p>Thu</p>
          </div>
          <div>
            <p className="text-success font-semibold">
              {formatCurrency(series[0].data[0])}
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 bg-error rounded-full"></div>
            <p>Chi</p>
          </div>
          <div>
            <p className="text-error font-semibold">
              {formatCurrency(series[0].data[1])}
            </p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="flex justify-end">
          <p className="font-semibold">
            {formatCurrency(series[0].data[0] - series[0].data[1])}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarChart;

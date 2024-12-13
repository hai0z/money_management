import React from "react";
import ReactApexChart from "react-apexcharts";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/formatters";
const DonutChart = ({ period }: { period: string }) => {
  const { user } = useAuth();
  const [series, setSeries] = React.useState([]);
  const [labels, setLabels] = React.useState([]);
  const getTransactionsByPeriod = async (period: string) => {
    const response = await fetch(
      `http://localhost:3000/api/transactions/user/${user?.user?.id}/period?period=${period}`
    );
    const data = await response.json();
    setSeries(data.periodSummary.categoryTotals.map((cat: any) => cat.total));
    setLabels(data.periodSummary.categoryTotals.map((cat: any) => cat.name));
  };
  React.useEffect(() => {
    getTransactionsByPeriod(period);
  }, [period]);
  return (
    <div className="w-full flex flex-row gapx-4 ">
      {series.length === 0 ? (
        <div className="w-full h-[350px] flex flex-col items-center justify-center text-base-content/60">
          <p className="text-lg font-medium">Chưa có dữ liệu</p>
          <p className="text-sm">
            Không có giao dịch nào trong khoảng thời gian này
          </p>
        </div>
      ) : (
        <div className="w-full flex items-center">
          <div className="w-full">
            <ReactApexChart
              options={{
                chart: {
                  type: "donut",
                  foreColor: "oklch(var(--bc)",
                },
                tooltip: {
                  y: {
                    formatter: (value: number) => formatCurrency(value),
                  },
                },
                dataLabels: {
                  enabled: true,
                },
                legend: {
                  position: "right",
                },
                labels: labels,
              }}
              series={series}
              type="donut"
              height={350}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DonutChart;

import { useEffect, useState } from "react";
import useApi from "../customHooks/useApi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FaUsers, FaMoneyBillWave, FaWallet, FaCoins } from "react-icons/fa";
const COLORS = ["#14B8A6", "#94a3b8", "#cbd5e1", "#ffffff", "#0e7490"];
const CARD_COLORS = ["#14b8a6", "#0e7490", "#94a3b8", "#14b8a6"];

function DashboardShimmer() {
  const shimmer =
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

  const CardSkeleton = () => (
    <div className={`${shimmer} bg-slate-800 rounded-lg p-4`}>
      <div className="h-6 w-24 bg-gray-600 rounded mb-2"></div>
      <div className="h-8 w-16 bg-gray-600 rounded"></div>
    </div>
  );

  const ChartSkeleton = () => (
    <div className={`${shimmer} bg-slate-800 rounded-lg p-4 h-72`}></div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { data, get } = useApi("http://localhost:8081/api/staff");
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalSalaries: 0,
    totalDeductions: 0,
    netGross: 0,
    componentTotals: {},
  });
  const [loading, setLoading] = useState(true);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  useEffect(() => {
    get();
  }, [get]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && Array.isArray(data)) {
        let totalStaff = data.length;
        let totalSalaries = 0;
        let totalDeductions = 0;
        let componentTotals = {};

        data.forEach((staff) => {
          let basic = parseFloat(staff.salaryDetails?.basicPay || 0);
          let comps = staff.salaryDetails?.salaryComponents || [];

          comps.forEach((comp) => {
            componentTotals[comp] = (componentTotals[comp] || 0) + 1;
          });

          let deductionComponents = [
            "PF",
            "ESI",
            "PT",
            "TDS",
            "OTHER_DEDUCTIONS",
          ];
          let deductions =
            comps.filter((c) => deductionComponents.includes(c)).length * 1000;
          let salary = basic + comps.length * 1000;

          totalSalaries += salary;
          totalDeductions += deductions;
        });

        let netGross = totalSalaries - totalDeductions;

        setStats({
          totalStaff,
          totalSalaries,
          totalDeductions,
          netGross,
          componentTotals,
        });
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  if (loading) return <DashboardShimmer />;

  const pieData = [
    { name: "Salaries", value: stats.totalSalaries },
    { name: "Deductions", value: stats.totalDeductions },
  ];

  const barData = Object.entries(stats.componentTotals).map(
    ([key, value], idx) => {
      let shortName = key;

      if (key.replace(/[_\s]/g, "").toLowerCase() === "medicalallowance") {
        shortName = "MEDICAL";
      } else if (key.length > 10) {
        shortName = key.slice(0, 10) + "…";
      }

      return {
        name: shortName,
        count: value,
        color: COLORS[idx % COLORS.length],
      };
    }
  );

  return (
    <div className="space-y-4 bg-slate-900  text-white lg:-mb-5">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          {
            title: "Total Staff",
            value: stats.totalStaff,
            icon: <FaUsers size={24} className="" />,
          },
          {
            title: "Total Salaries",
            value: `₹${stats.totalSalaries.toLocaleString()}`,
            icon: <FaMoneyBillWave size={24} />,
          },
          {
            title: "Total Deductions",
            value: `₹${stats.totalDeductions.toLocaleString()}`,
            icon: <FaWallet size={24} />,
          },
          {
            title: "Net Gross",
            value: `₹${stats.netGross.toLocaleString()}`,
            icon: <FaCoins size={24} className="text-slate-300" />,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-slate-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <div className="mb-2">{card.icon}</div>
            <h3
              style={{ color: CARD_COLORS[idx] }}
              className="text-lg font-semibold"
            >
              {card.title}
            </h3>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
  
  <div className="bg-slate-800 p-4 rounded-lg shadow">
    <h3
      style={{ color: "#0e7490" }}
      className="mb-4 font-semibold text-sm sm:text-xl"
    >
      Salaries vs Deductions
    </h3>
    <ResponsiveContainer width="100%" height={isMobile ? 180 : 200}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={isMobile ? 55 : 90}
          label={{
            fill: "white",
            fontWeight: "bold",
            fontSize: isMobile ? 12 : 16,
          }}
        >
          {pieData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
          itemStyle={{ color: "white", fontSize: isMobile ? 10 : 12 }}
          labelStyle={{ color: "white" }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>

  
  <div className="bg-slate-800 p-4 rounded-lg shadow">
    <h3
      style={{ color: "#14b8a6" }}
      className="mb-4 font-semibold text-sm sm:text-xl"
    >
      Salary Components Distribution
    </h3>

    <ResponsiveContainer width="100%" height={isMobile ? 240 : 220}>
      <BarChart
        data={barData}
        layout={isMobile ? "vertical" : "horizontal"}
        margin={{
          top: 10,
          right: isMobile ? 10 : 20,
          left: isMobile ? 15 : 10,
          bottom: isMobile ? 10 : 40,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

        {isMobile ? (
          <>
            <XAxis
              type="number"
              stroke="#94a3b8"
              tick={{ fontSize: 8 }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              tick={{ fontSize: 8 }}
              width={60}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              padding={{ left: 0, right: 5 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              tickMargin={8}
              allowDecimals={false}
            />
          </>
        )}

        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
          itemStyle={{ color: "white", fontSize: isMobile ? 10 : 12 }}
          labelStyle={{ color: "white" }}
        />
        <Bar
          dataKey="count"
          radius={[3, 3, 0, 0]}
          maxBarSize={isMobile ? 14 : 35}
        >
          {barData.map((entry, index) => (
            <Cell key={`cell-bar-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

    </div>
  );
};

export default Dashboard;

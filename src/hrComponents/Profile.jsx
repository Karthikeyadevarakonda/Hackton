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
import { FaMoneyBillWave, FaPlusCircle, FaWallet, FaCoins } from "react-icons/fa";

const COLORS = ["#14B8A6", "#0e7490", "#94a3b8", "#f59e0b"];
const CARD_COLORS = ["#14B8A6", "#0e7490", "#94a3b8", "#f59e0b"];

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

const Profile = () => {
  const staffId = 1; // later use localStorage.getItem("id")
  const { data: staffData, get: getStaff } = useApi(
    `http://localhost:8081/api/salary-transactions/staff/${staffId}`
  );

  const [stats, setStats] = useState({
    grossSalary: 0,
    allowances: 0,
    deductions: 0,
    netSalary: 0,
    componentTotals: {},
  });


  const [loading, setLoading] = useState(true);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  useEffect(() => {
    getStaff();
  }, [getStaff]);

  useEffect(() => {
    if (staffData && staffData.length > 0) {
     
      const r = staffData[staffData.length - 1];

      const grossSalary = r.grossSalary ?? 0;
      const basicSalary = r.basicPay ?? 0;
      const allowances = grossSalary - basicSalary;
      const deductions = r.totalDeductions ?? 0;
      const netSalary = r.netSalary ?? grossSalary - deductions;

      const componentTotals = r.componentBreakdown || {};

      setStats({
        grossSalary,
        allowances,
        deductions,
        netSalary,
        componentTotals,
      });

      setLoading(false);
    }
  }, [staffData]);

  if (loading) return <DashboardShimmer />;

  const pieData = [
    { name: "Gross Salary", value: stats.grossSalary },
    { name: "Allowances", value: stats.allowances },
    { name: "Deductions", value: stats.deductions },
    { name: "Net Salary", value: stats.netSalary },
  ];

  const barData = Object.entries(stats.componentTotals).map(
    ([key, value], idx) => ({
      name: key.length > 12 ? key.slice(0, 7) + "…" : key,
      amount: value,
      color: COLORS[idx % COLORS.length],
    })
  );

  return (
    <div className="space-y-4 bg-slate-900 text-white lg:-mb-5 px-2">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          {
            title: "Gross Salary",
            value: `₹${stats.grossSalary.toLocaleString()}`,
            icon: <FaMoneyBillWave size={24} />,
          },
          {
            title: "Allowances",
            value: `₹${stats.allowances.toLocaleString()}`,
            icon: <FaPlusCircle size={24} />,
          },
          {
            title: "Deductions",
            value: `₹${stats.deductions.toLocaleString()}`,
            icon: <FaWallet size={24} />,
          },
          {
            title: "Net Salary",
            value: `₹${stats.netSalary.toLocaleString()}`,
            icon: <FaCoins size={24} />,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-slate-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <div className="mb-2">{card.icon}</div>
            <h3
              style={{ color: CARD_COLORS[idx % CARD_COLORS.length] }}
              className="text-lg font-semibold"
            >
              {card.title}
            </h3>
            <p className="text-xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
       
        <div className="bg-slate-800 p-4 rounded-lg shadow">
          <h3
            style={{ color: "#0e7490" }}
            className="mb-4 font-semibold text-sm sm:text-xl"
          >
            Salary Breakdown
          </h3>
      <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
  <PieChart>
    <Pie
      data={pieData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={isMobile ? 55 : 75}
      innerRadius={isMobile ? 30 : 25}
      labelLine={false}
      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    >
      {pieData.map((_, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip
      contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
      itemStyle={{ color: "white", fontSize: isMobile ? 10 : 12 }}
      labelStyle={{ color: "white" }}
      position={{ x: 10, y: 150 }} 
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
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 8 }} />
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
                dataKey="amount"
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

export default Profile;

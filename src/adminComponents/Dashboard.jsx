import React, { useEffect, useState } from "react";
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
  Legend,
} from "recharts";

// Only slate, teal, gray, white shades
const COLORS = ["#14b8a6", "#94a3b8", "#cbd5e1", "#ffffff", "#0e7490"]; 
const CARD_COLORS = ["#14b8a6", "#0e7490", "#94a3b8", "#cbd5e1"];

const Dashboard = () => {
  const { data, loading, error, get } = useApi("http://localhost:8081/api/staff");
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalSalaries: 0,
    totalDeductions: 0,
    netGross: 0,
    componentTotals: {},
  });

  useEffect(() => {
    get();
  }, [get]);

  useEffect(() => {
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

        let deductionComponents = ["PF", "ESI", "PT", "TDS", "OTHER_DEDUCTIONS"];
        let deductions = comps.filter((c) => deductionComponents.includes(c)).length * 1000;
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
  }, [data]);

  const pieData = [
    { name: "Salaries", value: stats.totalSalaries },
    { name: "Deductions", value: stats.totalDeductions },
  ];

  const barData = Object.entries(stats.componentTotals).map(([key, value], idx) => ({
    name: key.length > 10 ? key.slice(0, 10) + "…" : key,
    count: value,
    color: COLORS[idx % COLORS.length],
  }));

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-white">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { title: "Total Staff", value: stats.totalStaff },
          { title: "Total Salaries", value: `₹${stats.totalSalaries.toLocaleString()}` },
          { title: "Total Deductions", value: `₹${stats.totalDeductions.toLocaleString()}` },
          { title: "Net Gross", value: `₹${stats.netGross.toLocaleString()}` },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-slate-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
          >
            <h3 style={{ color: CARD_COLORS[idx] }} className="text-lg font-semibold">
              {card.title}
            </h3>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-slate-800 p-4 rounded-lg shadow">
          <h3 style={{ color: "#0e7490" }} className="mb-4 font-semibold">
            Salaries vs Deductions
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={{ fill: "white", fontWeight: "bold" }}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
                itemStyle={{ color: "white" }}
                labelStyle={{ color: "white" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800 p-4 rounded-lg shadow">
          <h3 style={{ color: "#14b8a6" }} className="mb-4 font-semibold">
            Salary Components Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-35}
                textAnchor="end"
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip
  contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
  itemStyle={{ color: "white" }}
  labelStyle={{ color: "white" }}
/>

              <Legend wrapperStyle={{ display: "none" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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

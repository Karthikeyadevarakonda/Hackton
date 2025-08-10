import React from "react";
import { FaUsers, FaCheckCircle, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";

const Dashboard = () => {
  const stats = [
    { label: "Total Staff", value: 124, color: "text-teal-400", icon: <FaUsers /> },
    { label: "Active Staff", value: 118, color: "text-green-400", icon: <FaCheckCircle /> },
    { label: "Total Payroll", value: "₹12.3L", color: "text-yellow-400", icon: <FaMoneyBillWave /> },
    { label: "Pending Approvals", value: 3, color: "text-pink-400", icon: <FaClipboardList /> },
  ];

  const recentActivities = [
    { user: "Alice", action: "Updated Salary Formula", date: "2025-08-06" },
    { user: "Bob", action: "Approved Payslip", date: "2025-08-05" },
    { user: "Karthik", action: "Generated Acquittance Report", date: "2025-08-04" },
  ];

  return (
    <div className="bg-slate-900 min-h-screen p-6 text-white">
      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <h2 className="text-sm text-gray-400 mb-1">{stat.label}</h2>
            <p
              className={`text-lg lg:text-3xl font-bold ${stat.color}`}
              style={{
                textShadow: `0 0 8px ${stat.color.replace("text-", "").replace("-400", "")}`,
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Recent Activities */}
      <section className="bg-slate-800 p-4 rounded-xl border border-slate-700 overflow-x-auto">
        <h2 className="font-semibold text-white mb-4">Recent Activities</h2>
        <table className="min-w-full text-sm border border-slate-700">
          <thead className="bg-slate-700 text-gray-300">
            <tr>
              <th className="px-4 py-2 border border-slate-600">User</th>
              <th className="px-4 py-2 border border-slate-600">Action</th>
              <th className="px-4 py-2 border border-slate-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentActivities.map((log, i) => (
              <tr key={i} className="hover:bg-slate-700">
                <td className="px-4 py-2 border border-slate-700">{log.user}</td>
                <td className="px-4 py-2 border border-slate-700">{log.action}</td>
                <td className="px-4 py-2 border border-slate-700">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;

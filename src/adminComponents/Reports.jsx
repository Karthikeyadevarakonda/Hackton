import React, { useState } from "react";
import { FiCalendar, FiDownload } from "react-icons/fi";

const Reports = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Sample summary data (replace with API call)
  const summaryData = {
    totalStaff: 50,
    activeStaff: 45,
    relievedStaff: 5,
    totalGross: 2500000,
    totalDeductions: 350000,
    totalNet: 2150000,
  };

  const monthlyBreakdown = [
    { month: "January 2025", gross: 2400000, deductions: 340000, net: 2060000 },
    { month: "February 2025", gross: 2500000, deductions: 350000, net: 2150000 },
  ];

  return (
    <div className="bg-slate-900 min-h-screen text-white p-6 rounded-lg shadow">
      <h1 className="text-lg lg:text-2xl font-semibold text-yellow-400 mb-6 flex items-center gap-2">
        <FiCalendar /> Salary Summary Reports
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full md:w-40"
        >
          <option value="">Select Month</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full md:w-32"
        />

        <button className="flex items-center gap-2 bg-teal-500 text-slate-900 px-4 py-2 rounded hover:bg-teal-400 transition">
          <FiDownload /> Export PDF
        </button>
        <button className="flex items-center gap-2 bg-blue-500 text-slate-900 px-4 py-2 rounded hover:bg-blue-400 transition">
          <FiDownload /> Export Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded shadow">
          <h2 className="text-lg text-slate-300">Total Staff</h2>
          <p className="text-2xl font-bold">{summaryData.totalStaff}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded shadow">
          <h2 className="text-lg text-green-300">Active Staff</h2>
          <p className="text-2xl font-bold">{summaryData.activeStaff}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded shadow">
          <h2 className="text-lg text-red-300">Relieved Staff</h2>
          <p className="text-2xl font-bold">{summaryData.relievedStaff}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded shadow">
          <h2 className="text-lg text-yellow-300">Total Gross Salary</h2>
          <p className="text-2xl font-bold">₹ {summaryData.totalGross.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded shadow">
          <h2 className="text-lg text-pink-300">Total Deductions</h2>
          <p className="text-2xl font-bold">₹ {summaryData.totalDeductions.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded shadow">
          <h2 className="text-lg text-teal-300">Total Net Salary</h2>
          <p className="text-2xl font-bold">₹ {summaryData.totalNet.toLocaleString()}</p>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-700">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-2 border border-slate-700">Month</th>
              <th className="p-2 border border-slate-700">Gross Salary (₹)</th>
              <th className="p-2 border border-slate-700">Total Deductions (₹)</th>
              <th className="p-2 border border-slate-700">Net Salary (₹)</th>
            </tr>
          </thead>
          <tbody>
            {monthlyBreakdown.length > 0 ? (
              monthlyBreakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800">
                  <td className="p-2 border border-slate-700">{row.month}</td>
                  <td className="p-2 border border-slate-700">
                    ₹ {row.gross.toLocaleString()}
                  </td>
                  <td className="p-2 border border-slate-700">
                    ₹ {row.deductions.toLocaleString()}
                  </td>
                  <td className="p-2 border border-slate-700">
                    ₹ {row.net.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-slate-400">
                  No report data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;

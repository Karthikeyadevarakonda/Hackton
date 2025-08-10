import React, { useState } from "react";
import { FiDownload, FiSearch } from "react-icons/fi";

const SalaryLogs = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");

  // Sample static data (replace with API later)
  const salaryData = [
    {
      empId: "F001",
      name: "John Doe",
      designation: "Professor",
      basic: 50000,
      da: 7500,
      hra: 9000,
      allowances: 4000,
      pf: 6000,
      esi: 0,
      pt: 200,
      other: 500,
    },
    {
      empId: "F002",
      name: "Jane Smith",
      designation: "Assistant Professor",
      basic: 40000,
      da: 6000,
      hra: 7200,
      allowances: 3000,
      pf: 4800,
      esi: 0,
      pt: 200,
      other: 0,
    },
  ];

  const filteredData = salaryData.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.empId.toLowerCase().includes(search.toLowerCase())
  );

  const calculateGross = (emp) => emp.basic + emp.da + emp.hra + emp.allowances;
  const calculateDeductions = (emp) => emp.pf + emp.esi + emp.pt + emp.other;
  const calculateNet = (emp) => calculateGross(emp) - calculateDeductions(emp);

  return (
    <div className="bg-slate-900 min-h-screen text-white p-6 rounded-lg shadow">
      <h1 className="text-lg lg:text-2xl font-semibold text-teal-400 mb-6">
        Salary Acquittance Register
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

        <div className="flex items-center bg-slate-800 border border-slate-700 px-3 py-2 rounded w-full md:w-64">
          <FiSearch className="text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>

        <button className="flex items-center gap-2 bg-teal-500 text-slate-900 px-4 py-2 rounded hover:bg-teal-400 transition">
          <FiDownload /> Export PDF
        </button>
        <button className="flex items-center gap-2 bg-blue-500 text-slate-900 px-4 py-2 rounded hover:bg-blue-400 transition">
          <FiDownload /> Export Excel
        </button>
      </div>

      {/* Salary Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-700">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-2 border border-slate-700">S.No</th>
              <th className="p-2 border border-slate-700">Emp ID</th>
              <th className="p-2 border border-slate-700">Name</th>
              <th className="p-2 border border-slate-700">Designation</th>
              <th className="p-2 border border-slate-700">Basic Pay (₹)</th>
              <th className="p-2 border border-slate-700">DA (₹)</th>
              <th className="p-2 border border-slate-700">HRA (₹)</th>
              <th className="p-2 border border-slate-700">Allowances (₹)</th>
              <th className="p-2 border border-slate-700">Gross Salary (₹)</th>
              <th className="p-2 border border-slate-700">PF (₹)</th>
              <th className="p-2 border border-slate-700">ESI (₹)</th>
              <th className="p-2 border border-slate-700">PT/IT (₹)</th>
              <th className="p-2 border border-slate-700">Other Deductions (₹)</th>
              <th className="p-2 border border-slate-700">Net Salary (₹)</th>
              <th className="p-2 border border-slate-700">Signature</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((emp, idx) => (
                <tr key={emp.empId} className="hover:bg-slate-800">
                  <td className="p-2 border border-slate-700">{idx + 1}</td>
                  <td className="p-2 border border-slate-700">{emp.empId}</td>
                  <td className="p-2 border border-slate-700">{emp.name}</td>
                  <td className="p-2 border border-slate-700">{emp.designation}</td>
                  <td className="p-2 border border-slate-700">{emp.basic}</td>
                  <td className="p-2 border border-slate-700">{emp.da}</td>
                  <td className="p-2 border border-slate-700">{emp.hra}</td>
                  <td className="p-2 border border-slate-700">{emp.allowances}</td>
                  <td className="p-2 border border-slate-700">
                    {calculateGross(emp)}
                  </td>
                  <td className="p-2 border border-slate-700">{emp.pf}</td>
                  <td className="p-2 border border-slate-700">{emp.esi}</td>
                  <td className="p-2 border border-slate-700">{emp.pt}</td>
                  <td className="p-2 border border-slate-700">{emp.other}</td>
                  <td className="p-2 border border-slate-700">
                    {calculateNet(emp)}
                  </td>
                  <td className="p-2 border border-slate-700"></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="text-center p-4 text-slate-400">
                  No salary records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryLogs;

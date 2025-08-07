import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCog, FaUsers, FaFileInvoice, FaFileAlt, FaBars, FaSignOutAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
 const storedName = localStorage.getItem("name");
 const username = storedName ? storedName.charAt(0).toUpperCase() + storedName.slice(1) : '';

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", icon: <FaUserCog /> },
    { label: "Manage Users", icon: <FaUsers /> },
    { label: "Salary Logs", icon: <FaFileInvoice /> },
    { label: "Reports", icon: <FaFileAlt /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
    
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-teal-400 text-xl md:text-2xl"
        >
          {sidebarOpen ? <IoClose /> : <FaBars />}
        </button>
      </div>

      
      <aside
        className={`bg-slate-800 w-64 fixed h-full z-40 border-r border-slate-700 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 text-teal-400 text-lg mt-4 md:mt-0 md:text-2xl font-bold border-b border-slate-700 flex items-center gap-2">
          <FaUserCog className="text-slate-300" />
          Admin Panel
        </div>
        <nav className="mt-4">
          <ul className="space-y-1 text-sm text-gray-300">
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 px-6 py-3 hover:bg-slate-700 cursor-pointer"
              >
                {item.icon}
                {item.label}
              </li>
            ))}
            <li
              onClick={logout}
              className="flex items-center gap-3 px-6 py-3 hover:bg-slate-700 text-red-400 cursor-pointer"
            >
              <FaSignOutAlt />
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      
      <main className="flex-1 ml-0 md:ml-64 p-6">
      
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl text-center lg:text-start w-full lg:w-auto font-semibold text-teal-400 pb-4 lg:pb-0">Welcome, {username ? username : "Admin"}</h1>
          <button
            onClick={logout}
            className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-3 py-1 rounded font-semibold transition"
          >
            Log Out
          </button>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-3 gap-2 lg:gap-6 mb-6">
          <div className="bg-slate-800 p-3 lg:p-4 rounded-xl border border-slate-700 text-center shadow">
            <h2 className="text-sm text-gray-400 mb-1">Total Users</h2>
            <p className="text-lg lg:text-3xl font-bold text-teal-400">124</p>
          </div>
          <div className="bg-slate-800 p-3 lg:p-4 rounded-xl border border-slate-700 text-center shadow">
            <h2 className="text-sm text-gray-400 mb-1">Payroll Generated</h2>
            <p className=" text-lg lg:text-3xl font-bold text-green-400">₹12.3L</p>
          </div>
          <div className="bg-slate-800 p-3 lg:p-4 rounded-xl border border-slate-700 text-center shadow">
            <h2 className="text-sm text-gray-400 mb-1">Pending Requests</h2>
            <p className="text-lg lg:text-3xl font-bold text-yellow-400">3</p>
          </div>
        </section>

        {/* Activity Table */}
        <section className="bg-slate-800 p-4 rounded-xl border border-slate-700 overflow-x-auto">
          <h2 className="font-semibold text-white mb-4">Recent Activities</h2>
          <table className="min-w-full text-sm border border-slate-700">
            <thead className="bg-slate-700 text-gray-400 text-left">
              <tr>
                <th className="px-4 py-2 border border-slate-600">User</th>
                <th className="px-4 py-2 border border-slate-600">Action</th>
                <th className="px-4 py-2 border border-slate-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { user: "Alice", action: "Updated Salary Formula", date: "2025-08-06" },
                { user: "Bob", action: "Approved Payslip", date: "2025-08-05" },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-slate-700">
                  <td className="px-4 py-2 border border-slate-700">{log.user}</td>
                  <td className="px-4 py-2 border border-slate-700">{log.action}</td>
                  <td className="px-4 py-2 border border-slate-700">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

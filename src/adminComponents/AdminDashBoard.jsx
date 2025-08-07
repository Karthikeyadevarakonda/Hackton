import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCog, FaUsers, FaFileInvoice, FaFileAlt, FaBars, FaSignOutAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Dashboard from "./Dashboard";
import ManageUsers from "./ManageUsers";
import Reports from "./Reports";
import SalaryLogs from "./SalaryLogs";



const AdminDashboard = () => {

  const [activeTab,setActiveTab] = useState("dashboard");

        
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
    {key:"dashboard" ,path:"/adminDashboard",label: "Dashboard", icon: <FaUserCog /> },
    {key:"manageusers",path:"/manageUsers",label: "Manage Users", icon: <FaUsers /> },
    {key:"salarylogs",path:"/salaryLogs",label: "Salary Logs", icon: <FaFileInvoice /> },
    {key:"reports", path:"/reports",label: "Reports", icon: <FaFileAlt /> },
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
              <li key={idx}
                onClick={()=>setActiveTab(item.key)}
                className="flex items-center gap-3 px-6 py-3 hover:bg-slate-700 cursor-pointer">
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
      
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 bg-slate-800 border border-slate-700 rounded-lg px-6 py-4 shadow">
  <h1 className="text-2xl text-center lg:text-start w-full lg:w-auto font-semibold text-teal-400 pb-2 lg:pb-0">
    Welcome, {username ? username : "Admin"}
  </h1>
  <button
    onClick={logout}
    className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded font-semibold transition"
  >
    Log Out
  </button>
</header>


        {activeTab === "dashboard" && <Dashboard/>}
        {activeTab === "manageusers" && <ManageUsers/>}
        {activeTab === "reports" && <Reports/>}
        {activeTab === "salarylogs" && <SalaryLogs/>}

        

      </main>
    </div>
  );
};

export default AdminDashboard;

import React from 'react'

const Dashboard = () => {
  return (
    <div className=''>
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
    </div>
  )
}

export default Dashboard

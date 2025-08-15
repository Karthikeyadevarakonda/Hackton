import { useState } from "react";
import useApi from "../customHooks/useApi";

export default function Reports() {
  const [showForm, setShowForm] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const { data: results, loading, error, post } = useApi(
    "http://localhost:8081/api/salary-transactions"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post(`/generate?year=${year}&month=${month}`);
    } catch(err) {
       console.error("ERROR IN GENERATING SALARY ",err)
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
     <div className="flex items-center justify-between mb-8">
  <h1 className="text-xl bg-gradient-to-r from-cyan-300 to-slate-300 bg-clip-text text-transparent">
    SALARY REPORTS
  </h1>

  <button
    onClick={() => setShowForm(!showForm)}
   className="px-4 py-1.5 rounded bg-gradient-to-r from-teal-500 to-slate-400
                 hover:from-teal-400 hover:to-green-300 text-slate-900 font-semibold 
                 shadow transition-transform hover:scale-105"
  >
    {showForm ? "Close Form" : "Generate Salary"}
  </button>
</div>

      {showForm && (
       <form
  onSubmit={handleSubmit}
  className="bg-slate-900 p-6 rounded-2xl shadow-inner mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
>

  <div>
    <label className="block text-slate-300 mb-1 font-medium">Year</label>
    <input
      type="text"
      value={year}
      onChange={(e) => setYear(e.target.value.replace(/\D/, ""))}
      required
      placeholder="e.g. 2025"
      className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-600 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none text-white transition h-12"
    />
  </div>


  <div>
    <label className="block text-slate-300 mb-1 font-medium">Month</label>
    <input
      type="text"
      value={month}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/, "");
        setMonth(val ? val.padStart(2, "0") : "");
      }}
      required
      placeholder="01 - 12"
      className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-600 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none text-white transition h-12"
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full px-3 py-2 rounded-md bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold shadow transition-transform hover:scale-105 h-12"
  >
    {loading ? "Generating..." : "Submit"}
  </button>
</form>

      )}

   
      {error && (
        <p className="text-red-400 text-center mb-6 font-medium">{error}</p>
      )}

    
      {results && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg hover:shadow-2xl transition"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-teal-400">
                  Staff ID: {item.staffId}
                </h2>
                <span className="text-sm text-slate-400">
                  {new Date(item.generatedDate).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-1 text-slate-300">
                <p>
                  <span className="font-semibold text-slate-400">
                    Salary Month:
                  </span>{" "}
                  {item.salaryMonth}
                </p>
                <p>
                  <span className="font-semibold text-slate-400">Basic Pay:</span>{" "}
                  ₹{item.basicPay.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold text-slate-400">Gross Salary:</span>{" "}
                  ₹{item.grossSalary.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold text-slate-400">
                    Total Deductions:
                  </span>{" "}
                  ₹{item.totalDeductions.toLocaleString()}
                </p>
                <p className="text-lg font-bold text-white">
                  <span className="font-semibold text-slate-400">Net Salary:</span>{" "}
                  ₹{item.netSalary.toLocaleString()}
                </p>
              </div>

              {item.componentBreakdown &&
                Object.keys(item.componentBreakdown).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-slate-300 font-semibold mb-2">
                      Component Breakdown:
                    </h3>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
                      {Object.entries(item.componentBreakdown).map(
                        ([comp, value]) => (
                          <li key={comp} className="text-sm">
                            {comp}: ₹{value.toLocaleString()}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

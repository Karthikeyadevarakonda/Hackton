import { useState, useEffect } from "react";
import useApi from "../customHooks/useApi";
import AuditLogsShimmer from "../shimmers/AuditLogsShimmer";

export default function AuditLogs() {
  const { get, loading } = useApi("http://localhost:8081/api/audit-logs");

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [day, setDay] = useState("");
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showShimmer, setShowShimmer] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowShimmer(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);


  useEffect(() => {
    (async () => {
      try {
        const res = await get("");
        const sortedLogs = (res || []).sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setLogs(sortedLogs);
        setFilteredLogs(sortedLogs.slice(0, 5));
      } catch (err) {
        console.error("Error fetching audit logs:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!month && !year && !day) {
      setFilteredLogs(logs.slice(0, 5));
      setIsFiltered(false);
    }
  }, [month, year, day, logs]);

  const handleFilter = (e) => {
    e.preventDefault();

    if (!month && !year && !day) {
      setFilteredLogs(logs.slice(0, 5));
      setIsFiltered(false);
      return;
    }

    if (!month || !year) {
      alert("Please enter month and year.");
      return;
    }

    const filtered = logs.filter((log) => {
      if (!log.timestamp) return false;
      const logDate = new Date(log.timestamp);
      const m = logDate.getMonth() + 1;
      const y = logDate.getFullYear();
      const d = logDate.getDate();
      return (
        m === parseInt(month, 10) &&
        y === parseInt(year, 10) &&
        (day ? d === parseInt(day, 10) : true)
      );
    });

    setFilteredLogs(filtered);
    setIsFiltered(true);
  };

  const handleClear = () => {
    setMonth("");
    setYear("");
    setDay("");
    setFilteredLogs(logs.slice(0, 5));
    setIsFiltered(false);
  };

  const headingText = isFiltered
    ? `LOGS ON : ${day ? `${day}/${month}/${year}` : `${month}/${year}`}`
    : "RECENT LOGS";

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    if (isNaN(dateObj)) return { date: "NA", time: "NA" };
    return {
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString(),
    };
  };

  return (
    <div className="px-1 sm:px-6 sm:py-2 space-y-6">
      <h2 className="text-xl bg-gradient-to-r from-cyan-300 to-slate-300 bg-clip-text text-transparent">
        GENERATE LOGS
      </h2>

      <form
        onSubmit={handleFilter}
        className="flex flex-wrap gap-4 bg-slate-900 p-4 rounded-lg border border-slate-700 shadow-lg"
      >
        <div className="flex flex-col flex-1 min-w-[100px]">
          <label className="text-slate-300 text-sm mb-1 text-center">Month</label>
          <input
            type="text"
            placeholder="MM"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 
                       text-slate-200 focus:border-teal-400 focus:outline-none text-center"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-[100px]">
          <label className="text-slate-300 text-sm mb-1 text-center">Year</label>
          <input
            type="text"
            placeholder="YYYY"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 
                       text-slate-200 focus:border-teal-400 focus:outline-none text-center"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-[100px]">
          <label className="text-slate-300 text-sm mb-1 text-center">Day</label>
          <input
            type="text"
            placeholder="DD"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 
                       text-slate-200 focus:border-teal-400 focus:outline-none text-center"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-[100px]">
          <label className="text-transparent text-sm mb-1 select-none">Filter</label>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded bg-gradient-to-r from-teal-500 to-slate-400
                       hover:from-teal-400 hover:to-green-300 text-slate-900 font-semibold 
                       shadow transition-transform hover:scale-105"
          >
            Filter
          </button>
        </div>

        <div className="flex flex-col flex-1 min-w-[100px]">
          <label className="text-transparent text-sm mb-1 select-none">Clear</label>
          <button
            type="button"
            onClick={handleClear}
            className="w-full px-4 py-2 rounded bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold shadow transition-transform hover:scale-105"
          >
            Clear
          </button>
        </div>
      </form>

      <h1 className="text-xl bg-gradient-to-r from-cyan-300 to-slate-300 bg-clip-text text-transparent">
        {headingText}
      </h1>

      {loading || showShimmer ? (
        <AuditLogsShimmer />
      ) : filteredLogs.length === 0 ? (
        <p className="text-slate-400">No logs found for the selected date.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow-lg border border-slate-700 bg-slate-800 backdrop-blur-lg">
          <table className="w-full text-sm text-left text-slate-300 whitespace-nowrap">
            <thead className="text-teal-300 uppercase bg-slate-900 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Entity</th>
                <th className="px-6 py-3">Entity ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                const { date, time } = formatDate(log.timestamp);
                return (
                  <tr
                    key={index}
                    className={`border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${
                      index % 2 === 0 ? "bg-slate-800" : "bg-slate-900"
                    }`}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{log.username || "NA"}</td>
                    <td className="px-6 py-4">{log.action || "NA"}</td>
                    <td className="px-6 py-4">{log.entityName || "NA"}</td>
                    <td className="px-6 py-4">{log.entityId || "NA"}</td>
                    <td className="px-6 py-4">{date}</td>
                    <td className="px-6 py-4">{time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

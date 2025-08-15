import React from "react";

export default function AuditLogsShimmer() {
  const shimmer =
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";
    
  const TableSkeleton = () => (
    <div className="overflow-x-auto rounded shadow-lg border border-slate-700 bg-slate-800">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-teal-300 uppercase bg-slate-900/60">
          <tr>
            {["#", "User", "Action", "Entity", "Entity ID", "Date", "Time"].map(
              (_, idx) => (
                <th key={idx} className="px-6 py-3">
                  <div className={`h-6 rounded bg-slate-700 ${shimmer}`}></div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {Array(5)
            .fill("")
            .map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
              >
                {Array(7)
                  .fill("")
                  .map((__, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <div
                        className={`h-6 rounded bg-slate-700 ${shimmer}`}
                      ></div>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <TableSkeleton />
    </div>
  );
}

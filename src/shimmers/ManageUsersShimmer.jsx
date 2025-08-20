export default function ManageUsersShimmer() {
  const shimmer =
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

  const SearchBarSkeleton = () => (
    <div className="flex justify-between items-center gap-4 mb-6 flex-nowrap">
      
      <div className="flex-1 min-w-0 h-8 rounded bg-slate-700 overflow-hidden relative">
        <div className={`absolute inset-0 ${shimmer}`}></div>
      </div>

      
      <div className="w-28 h-8 rounded bg-slate-700 overflow-hidden relative flex-shrink-0">
        <div className={`absolute inset-0 ${shimmer}`}></div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="overflow-x-auto rounded shadow-lg border border-slate-700 bg-slate-800">
      <table className="w-full min-w-[600px] text-sm text-left text-slate-300">
        <thead className="text-teal-300 uppercase bg-slate-900/60">
          <tr>
            {["ID", "Name", "Department", "Joining Date", "Actions"].map((_, idx) => (
              <th key={idx} className="px-4 sm:px-6 py-3">
                <div className={`h-6 rounded bg-slate-700 ${shimmer}`}></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(5).fill("").map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
              {Array(5).fill("").map((__, colIdx) => (
                <td key={colIdx} className="px-4 sm:px-6 py-4">
                  <div className={`h-6 rounded bg-slate-700 ${shimmer}`}></div>
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
      <SearchBarSkeleton />
      <TableSkeleton />
    </div>
  );
}

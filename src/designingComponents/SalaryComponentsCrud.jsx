import { useState, useEffect } from "react";
import useApi from "../customHooks/useApi";
import Loading from "../shimmers/AuditLogsShimmer";
import CustomDropdown from "../designingComponents/CustomDropdown";
import { PencilIcon, PlusIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const SALARY_COMPONENT_NAMES = [
  "DA",
  "HRA",
  "SPECIAL_ALLOWANCE",
  "TRANSPORT_ALLOWANCE",
  "MEDICAL_ALLOWANCE",
  "PF",
  "ESI",
  "PT",
  "TDS",
  "OTHER_DEDUCTIONS",
];
const COMPONENT_TYPES = ["ALLOWANCE", "DEDUCTION"];

const fmt = (v) => (v === null || v === undefined || v === "" ? "NA" : String(v));
const fmtNum = (v) =>
  v === null || v === undefined || v === "" || isNaN(Number(v))
    ? "NA"
    : Number(v);

export default function SalaryComponentCrud({ baseUrl }) {
  const { get, post, put, del, loading } = useApi(baseUrl);

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    fixedAmount: "",
    percentage: "",
    componentType: "",
    effectiveDate: "",
  });

  const fetchData = async () => {
    try {
      const res = await get();
      if (!Array.isArray(res)) return;
      const sorted = res.sort(
        (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate)
      );
      setItems(sorted);
      setFilteredItems(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, [baseUrl]);

  useEffect(() => {
    let data = [...items];
    if (searchName) data = data.filter(c => c.name?.toLowerCase().includes(searchName.toLowerCase()));
    if (filterType) data = data.filter(c => c.componentType === filterType);
    setFilteredItems(data);
  }, [searchName, filterType, items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      fixedAmount: formData.fixedAmount === "" ? null : Number(formData.fixedAmount),
      percentage: formData.percentage === "" ? null : Number(formData.percentage),
      componentType: formData.componentType,
      effectiveDate: formData.effectiveDate,
    };
    try {
      if (isEditMode && editId) await put(`/${editId}`, payload);
      else await post("", payload);
      setIsFormOpen(false);
      fetchData();
    } catch (err) { console.error(err) }
  };

  return (
    <div className="px-2 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 h-full">
   <h1 className="text-lg sm:text-xl bg-gradient-to-r from-cyan-300 to-slate-300 bg-clip-text text-transparent font-semibolds mb-2">
  Salary Components
</h1>

<div className="flex flex-col md:flex-row py-2 gap-3">
  <div className="flex w-full gap-3">
  {/* Search Input - 60% */}
  <input
    type="text"
    placeholder="Search by Name"
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    className="flex-[3] px-4 py-1.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-400 backdrop-blur-sm focus:border-teal-400 focus:ring focus:ring-teal-500 focus:ring-opacity-40 shadow-lg transition-all"
  />

  <div className="flex-[1]">
    <CustomDropdown
      value={filterType}
      onChange={(val) => setFilterType(val)}
      options={["", ...COMPONENT_TYPES]}
      placeholder="All Types"
      className="w-full"
    />
  </div>


  <button
    onClick={() => {
      setIsEditMode(false);
      setEditId(null);
      setFormData({ name: "", fixedAmount: "", percentage: "", componentType: "", effectiveDate: "" });
      setIsFormOpen(true);
    }}
    className="flex-[1] flex items-center justify-center gap-2 px-0 py-1.5 rounded bg-gradient-to-r from-teal-500 to-slate-400
               hover:from-teal-400 hover:to-slate-300 text-slate-900 font-bold shadow-lg hover:scale-101 transform transition-transform"
  >
    <PlusIcon className="w-5 h-5" />
    Add
  </button>
</div>

</div>


      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto h-86 rounded shadow-2xl border border-slate-700 bg-slate-900/70 backdrop-blur-lg">
        <table className="w-full text-sm text-left text-slate-200">
          <thead className="text-teal-300 uppercase bg-slate-800/50 backdrop-blur-md sticky top-0 z-10">
            <tr>
              {["ID","Name","Component Type","Percentage","Fixed Amount","Effective Date","Actions"].map((col) => (
                <th key={col} className="px-6 py-3 whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10"><Loading /></td>
              </tr>
            ) : filteredItems.length ? (
              filteredItems.map((c, idx) => (
                <tr key={c.id ?? `${c.name}-${idx}`} className="border-b border-slate-700 hover:bg-slate-800/60 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fmt(c.name)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fmt(c.componentType)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fmtNum(c.percentage)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fmtNum(c.fixedAmount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fmt(c.effectiveDate?.slice?.(0, 10))}</td>
                  <td className="px-6 py-4 flex justify-center gap-3 text-xl whitespace-nowrap">
                    <EyeIcon
                      className="w-5 h-5 text-blue-400 hover:scale-125 cursor-pointer transition-transform"
                      title="View"
                      onClick={() => setViewItem(c)}
                    />
                    <PencilIcon
                      onClick={() => {
                        setIsEditMode(true);
                        setEditId(c.id);
                        setFormData({ name: c.name ?? "", fixedAmount: c.fixedAmount ?? "", percentage: c.percentage ?? "", componentType: c.componentType ?? "", effectiveDate: c.effectiveDate?.slice?.(0, 10) ?? "" });
                        setIsFormOpen(true);
                      }}
                      className="w-5 h-5 text-yellow-400 hover:scale-125 cursor-pointer transition-transform"
                      title="Update"
                    />
                    <TrashIcon
                      onClick={async () => {
                        if (!window.confirm("Delete this salary component?")) return;
                        await del(`/${c.id}`);
                        fetchData();
                      }}
                      className="w-5 h-5 text-red-500 hover:scale-125 cursor-pointer transition-transform"
                      title="Delete"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-10 text-slate-400">No salary components found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-slate-900/95 shadow-2xl border-l border-slate-700 z-50 transform transition-transform duration-500 ease-in-out ${isFormOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-8 flex flex-col h-full overflow-y-auto">
          <h2 className="text-2xl font-bold text-teal-400 mb-6">{isEditMode ? "Update Salary Component" : "Add Salary Component"}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <CustomDropdown
              label="Name"
              value={formData.name}
              onChange={(val) => setFormData((p) => ({ ...p, name: val }))}
              options={SALARY_COMPONENT_NAMES}
              placeholder="Select component"
            />
            <CustomDropdown
              label="Component Type"
              value={formData.componentType}
              onChange={(val) => setFormData((p) => ({ ...p, componentType: val }))}
              options={COMPONENT_TYPES}
              placeholder="Select type"
            />
            <div>
              <label className="block text-sm mb-1 text-slate-300">Percentage</label>
              <input type="number" step="0.01" value={formData.percentage} onChange={(e) => setFormData((p) => ({ ...p, percentage: e.target.value }))} className="w-full p-3 rounded-xl bg-slate-800/70 border border-slate-700 backdrop-blur-sm focus:border-teal-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Fixed Amount</label>
              <input type="number" step="0.01" value={formData.fixedAmount} onChange={(e) => setFormData((p) => ({ ...p, fixedAmount: e.target.value }))} className="w-full p-3 rounded-xl bg-slate-800/70 border border-slate-700 backdrop-blur-sm focus:border-teal-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Effective Date</label>
              <input type="date" value={formData.effectiveDate} onChange={(e) => setFormData((p) => ({ ...p, effectiveDate: e.target.value }))} className="w-full p-3 rounded-xl bg-slate-800/70 border border-slate-700 backdrop-blur-sm focus:border-teal-400 transition-all" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-2xl transition-all">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-gradient-to-r from-teal-500 to-green-400 text-slate-900 rounded-2xl font-bold shadow-lg hover:scale-105 transform transition-transform">{isEditMode ? "Update" : "Add"}</button>
            </div>
          </form>
        </div>
      </div>

      {/* View Sidebar */}
      {viewItem && <div onClick={() => setViewItem(null)} className="fixed inset-0 bg-black/50 z-40 transition-opacity" />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900/95 shadow-2xl border-l border-slate-700 z-50 transform transition-transform duration-500 ease-in-out ${viewItem ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-8 flex flex-col h-full overflow-y-auto">
          <h2 className="text-2xl font-bold text-teal-400 mb-6">Salary Component Details</h2>
          <div className="flex flex-col gap-4 text-slate-200 text-lg">
            <div><strong>Name:</strong> {viewItem?.name}</div>
            <div><strong>Component Type:</strong> {viewItem?.componentType}</div>
            <div><strong>Percentage:</strong> {fmtNum(viewItem?.percentage)}</div>
            <div><strong>Fixed Amount:</strong> {fmtNum(viewItem?.fixedAmount)}</div>
            <div><strong>Effective Date:</strong> {viewItem?.effectiveDate?.slice(0, 10)}</div>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={() => setViewItem(null)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-2xl transition-all">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

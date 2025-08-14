import { useState, useEffect } from "react";
import useApi from "../customHooks/useApi";
import Loading from "../designingComponents/Loading";
import { MdEdit, MdVisibility, MdDeleteForever } from "react-icons/md";

const SALARY_COMPONENTS = [
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

export default function ManageUsers() {
  const { get, post, put, del, loading } = useApi(
    "http://localhost:8081/api/staff"
  );

  const [staffList, setStaffList] = useState([]);
  const [isFormPanelOpen, setIsFormPanelOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    joiningDate: "",
    department: "",
    salaryDetails: {
      basicPay: "",
      bankAccountNumber: "",
      ifscCode: "",
      bankName: "",
      salaryComponents: [],
    },
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await get();
      const sorted = (res || []).sort((a, b) => Number(a.id) - Number(b.id));
      setStaffList(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditId(null);
    resetForm();
    setIsFormPanelOpen(true);
  };

  const handleEditClick = (staff) => {
    setIsEditMode(true);
    setEditId(staff.id);
    setFormData({
      name: staff.name,
      joiningDate: staff.joiningDate,
      department: staff.department,
      salaryDetails: {
        basicPay: staff.salaryDetails?.basicPay || "",
        bankAccountNumber: staff.salaryDetails?.bankAccountNumber || "",
        ifscCode: staff.salaryDetails?.ifscCode || "",
        bankName: staff.salaryDetails?.bankName || "",
        salaryComponents: staff.salaryDetails?.salaryComponents || [],
      },
    });
    setIsFormPanelOpen(true);
  };

  const handleViewClick = (staff) => {
    setSelectedStaff(staff);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await del(`/${id}`);
      fetchStaff();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      salaryDetails: {
        ...formData.salaryDetails,
        basicPay: parseFloat(formData.salaryDetails.basicPay),
      },
    };

    try {
      if (isEditMode && editId) {
        await put(`/${editId}`, payload);
      } else {
        await post("", payload);
      }
      setIsFormPanelOpen(false);
      fetchStaff();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComponent = (comp) => {
    setFormData((prev) => {
      const comps = prev.salaryDetails.salaryComponents;
      return {
        ...prev,
        salaryDetails: {
          ...prev.salaryDetails,
          salaryComponents: comps.includes(comp)
            ? comps.filter((c) => c !== comp)
            : [...comps, comp],
        },
      };
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      joiningDate: "",
      department: "",
      salaryDetails: {
        basicPay: "",
        bankAccountNumber: "",
        ifscCode: "",
        bankName: "",
        salaryComponents: [],
      },
    });
  };

  const formatValue = (value) =>
    value === null || value === undefined || value === "" ? "NA" : value;

  return (
    <div className="w-full p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-300 to-cyan-300 bg-clip-text text-transparent">
          Manage Staff
        </h1>
       <button
  onClick={handleAddClick}
   className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold shadow transition-transform hover:scale-105"
>
  + Add Staff
</button>

      </div>

      {/* STAFF TABLE */}
      <div className="overflow-x-auto rounded-lg shadow-lg border border-slate-700 bg-slate-800 backdrop-blur-lg">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-teal-300 uppercase bg-slate-900/60">
            <tr>
              {["ID", "Name", "Department", "Joining Date", "Actions"].map(
                (col) => (
                  <th key={col} className="px-6 py-3">
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  <Loading />
                </td>
              </tr>
            ) : (
              staffList.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">{formatValue(staff.id)}</td>
                  <td className="px-6 py-4">{formatValue(staff.name)}</td>
                  <td className="px-6 py-4">{formatValue(staff.department)}</td>
                  <td className="px-6 py-4">{formatValue(staff.joiningDate)}</td>
                  <td className="px-6 py-4 flex gap-3 text-xl">
                    <MdVisibility
                      onClick={() => handleViewClick(staff)}
                      className="text-blue-400 hover:scale-110 cursor-pointer transition-transform"
                    />
                    <MdEdit
                      onClick={() => handleEditClick(staff)}
                      className="text-yellow-400 hover:scale-110 cursor-pointer transition-transform"
                    />
                    <MdDeleteForever
                      onClick={() => handleDeleteClick(staff.id)}
                      className="text-red-500 hover:scale-110 cursor-pointer transition-transform"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SLIDE-IN FORM PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-slate-900 shadow-2xl border-l border-slate-700 z-50 transform transition-transform duration-500 ease-in-out ${
          isFormPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 flex flex-col h-full overflow-y-auto">
          <h2 className="text-2xl font-semibold text-teal-400 mb-6">
            {isEditMode ? "Update Staff" : "Add Staff"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: "name", placeholder: "Name" },
              { type: "date", name: "joiningDate" },
              { name: "department", placeholder: "Department" },
              {
                type: "number",
                name: "basicPay",
                placeholder: "Basic Pay",
                nested: "salaryDetails",
              },
              {
                type: "number",
                name: "bankAccountNumber",
                placeholder: "Bank Account Number",
                nested: "salaryDetails",
              },
              {
                name: "ifscCode",
                placeholder: "IFSC Code",
                nested: "salaryDetails",
              },
              {
                name: "bankName",
                placeholder: "Bank Name",
                nested: "salaryDetails",
              },
            ].map((field, idx) => {
              const value =
                field.nested === "salaryDetails"
                  ? formData.salaryDetails[field.name]
                  : formData[field.name];
              return (
                <input
                  key={idx}
                  type={field.type || "text"}
                  name={field.name}
                  value={value}
                  onChange={(e) =>
                    field.nested
                      ? setFormData({
                          ...formData,
                          [field.nested]: {
                            ...formData[field.nested],
                            [field.name]: e.target.value,
                          },
                        })
                      : setFormData({
                          ...formData,
                          [field.name]: e.target.value,
                        })
                  }
                  placeholder={field.placeholder}
                  required
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-teal-400 focus:outline-none"
                />
              );
            })}

            {/* Salary Components */}
            <div className="flex flex-wrap gap-2 mt-2">
              {SALARY_COMPONENTS.map((comp) => {
                const isSelected =
                  formData.salaryDetails.salaryComponents.includes(comp);
                return (
                  <button
                    type="button"
                    key={comp}
                    onClick={() => toggleComponent(comp)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      isSelected
                        ? "bg-teal-500 text-slate-900 border-teal-500 shadow-md scale-105"
                        : "bg-slate-800 text-slate-300 border-slate-600 hover:border-teal-400"
                    }`}
                  >
                    {comp}
                  </button>
                );
              })}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsFormPanelOpen(false)}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-teal-500 to-green-400 hover:scale-105 transition-transform text-slate-900 rounded-lg font-bold"
              >
                {isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-xl w-11/12 max-w-xl relative border border-slate-700 shadow-lg">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 text-red-400 text-2xl hover:scale-110 transition-transform"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold text-teal-400 mb-4">
              Staff Details
            </h2>
            <div className="space-y-3 text-slate-300">
              <p>
                <span className="text-teal-300">Name:</span>{" "}
                {formatValue(selectedStaff.name)}
              </p>
              <p>
                <span className="text-teal-300">Department:</span>{" "}
                {formatValue(selectedStaff.department)}
              </p>
              <p>
                <span className="text-teal-300">Joining Date:</span>{" "}
                {formatValue(selectedStaff.joiningDate)}
              </p>
              <p>
                <span className="text-teal-300">Basic Pay:</span>{" "}
                {formatValue(selectedStaff.salaryDetails?.basicPay)}
              </p>
              <p>
                <span className="text-teal-300">Bank Account:</span>{" "}
                {formatValue(selectedStaff.salaryDetails?.bankAccountNumber)}
              </p>
              <p>
                <span className="text-teal-300">IFSC Code:</span>{" "}
                {formatValue(selectedStaff.salaryDetails?.ifscCode)}
              </p>
              <p>
                <span className="text-teal-300">Bank Name:</span>{" "}
                {formatValue(selectedStaff.salaryDetails?.bankName)}
              </p>
              <p>
                <span className="text-teal-300">Salary Components:</span>{" "}
                {selectedStaff.salaryDetails?.salaryComponents?.join(", ") ||
                  "NA"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import useApi from "../customHooks/useApi";
import Loading from "../designingComponents/Loading";
import { PencilIcon, PlusIcon, TrashIcon,EyeIcon } from '@heroicons/react/24/outline';
import ManageUsersShimmer from "../shimmers/ManageUsersShimmer";

const SALARY_COMPONENTS = [
  "DA", "HRA", "SPECIAL_ALLOWANCE", "TRANSPORT_ALLOWANCE", "MEDICAL_ALLOWANCE",
  "PF", "ESI", "PT", "TDS", "OTHER_DEDUCTIONS",
];

// ===== Helper Functions =====
const formatValue = (value) =>
  value === null || value === undefined || value === "" ? "NA" : value;

// ===== Components =====
const StaffTable = ({ staffList, loading, onView, onEdit, onDelete }) => (
  <div className="overflow-x-auto rounded shadow-lg border border-slate-700 bg-slate-800 backdrop-blur-lg">
    <table className="w-full text-sm text-left text-slate-300">
      <thead className="text-teal-300 uppercase bg-slate-900/60">
        <tr>
          {["ID", "Name", "Department", "Joining Date", "Actions"].map((col) => (
            <th key={col} className="px-6 py-3">{col}</th>
          ))}
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
            <tr key={staff.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
              <td className="px-6 py-4">{formatValue(staff.id)}</td>
              <td className="px-6 py-4">{formatValue(staff.name)}</td>
              <td className="px-6 py-4">{formatValue(staff.department)}</td>
              <td className="px-6 py-4">{formatValue(staff.joiningDate)}</td>
              <td className="px-6 py-4 flex gap-3 text-xl">
                <EyeIcon 
                  onClick={() => onView(staff)} 
                  className="w-5 h-4  text-blue-400 hover:scale-110 cursor-pointer transition-transform" 
                />
                 <PencilIcon
                  onClick={() => onEdit(staff)}
                  className="w-5 h-4 text-yellow-400 hover:scale-110 cursor-pointer transition-transform"
                />
                {/* Using TrashIcon for deleting */}
                <TrashIcon
                  onClick={() => onDelete(staff.id)}
                  className="w-5 h-4 text-red-500 hover:scale-110 cursor-pointer transition-transform"
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const StaffFormPanel = ({
  isOpen, isEditMode, formData, setFormData, onClose, onSubmit, toggleComponent
}) => {
  const fields = [
    { name: "name", placeholder: "Name" },
    { type: "date", name: "joiningDate" },
    { name: "department", placeholder: "Department" },
    { type: "number", name: "basicPay", placeholder: "Basic Pay", nested: "salaryDetails" },
    { type: "number", name: "bankAccountNumber", placeholder: "Bank Account Number", nested: "salaryDetails" },
    { name: "ifscCode", placeholder: "IFSC Code", nested: "salaryDetails" },
    { name: "bankName", placeholder: "Bank Name", nested: "salaryDetails" },
  ];

  return (
    <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-slate-900 shadow-2xl border-l border-slate-700 z-50 transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="p-8 flex flex-col h-full overflow-y-auto">
        <h2 className="text-2xl font-semibold text-teal-400 mb-6">
          {isEditMode ? "Update Staff" : "Add Staff"}
        </h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {fields.map((field, idx) => {
            const value = field.nested === "salaryDetails"
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
                    : setFormData({ ...formData, [field.name]: e.target.value })
                }
                placeholder={field.placeholder}
                required
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-teal-400 focus:outline-none"
              />
            );
          })}
          <div className="flex flex-wrap gap-2 mt-2">
            {SALARY_COMPONENTS.map((comp) => {
              const isSelected = formData.salaryDetails.salaryComponents.includes(comp);
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
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
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
  );
};

const StaffViewModal = ({ staff, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-slate-900 p-8 rounded-xl w-11/12 max-w-xl relative border border-slate-700 shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-red-400 text-2xl hover:scale-110 transition-transform"
      >
        ×
      </button>
      <h2 className="text-2xl font-semibold text-teal-400 mb-4">Staff Details</h2>
      <div className="space-y-3 text-slate-300">
        <p><span className="text-teal-300">Name:</span> {formatValue(staff.name)}</p>
        <p><span className="text-teal-300">Department:</span> {formatValue(staff.department)}</p>
        <p><span className="text-teal-300">Joining Date:</span> {formatValue(staff.joiningDate)}</p>
        <p><span className="text-teal-300">Basic Pay:</span> {formatValue(staff.salaryDetails?.basicPay)}</p>
        <p><span className="text-teal-300">Bank Account:</span> {formatValue(staff.salaryDetails?.bankAccountNumber)}</p>
        <p><span className="text-teal-300">IFSC Code:</span> {formatValue(staff.salaryDetails?.ifscCode)}</p>
        <p><span className="text-teal-300">Bank Name:</span> {formatValue(staff.salaryDetails?.bankName)}</p>
        <p><span className="text-teal-300">Salary Components:</span> {staff.salaryDetails?.salaryComponents?.join(", ") || "NA"}</p>
      </div>
    </div>
  </div>
);

// ===== Main Component =====
export default function ManageUsers() {
  const { get, post, put, del, loading } = useApi("http://localhost:8081/api/staff");
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const [shimmerDelay, setShimmerDelay] = useState(true); // For controlling shimmer delay

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmerDelay(false); // Hide shimmer after 3 seconds
    },500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    const filtered = staffList.filter((staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.id.toString().includes(searchTerm)
    );
    setFilteredStaffList(filtered);
  }, [searchTerm, staffList]);

  const fetchStaff = async () => {
    try {
      const res = await get();
      const sorted = (res || []).sort((a, b) => Number(a.id) - Number(b.id));
      setStaffList(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const filtered = staffList.filter((staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.id.toString().includes(searchTerm)
    );
    setFilteredStaffList(filtered);
  }, [searchTerm, staffList]);

  
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

  return (
    <div className="p-6 md:p-10">
      
      {loading || shimmerDelay ? (
        <ManageUsersShimmer />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-2/3 lg:w-4/5 px-4 py-2 rounded border border-slate-600 bg-slate-800 text-slate-200 focus:outline-none focus:border-teal-400"
            />
            <button
              onClick={handleAddClick}
              className="px-4 py-2 lg:px-8 rounded bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold shadow transition-transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5 inline-block mr-2" />
               Add Staff
            </button>
          </div>

          <StaffTable
            staffList={filteredStaffList}
            loading={loading}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          <StaffFormPanel
            isOpen={isFormPanelOpen}
            isEditMode={isEditMode}
            formData={formData}
            setFormData={setFormData}
            onClose={() => setIsFormPanelOpen(false)}
            onSubmit={handleSubmit}
            toggleComponent={toggleComponent}
          />

          {isViewModalOpen && selectedStaff && (
            <StaffViewModal
              staff={selectedStaff}
              onClose={() => setIsViewModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

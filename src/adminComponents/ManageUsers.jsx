import { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaUser, FaEdit, FaEye } from "react-icons/fa";
import {
  TextField,
  MenuItem,
  Button,
  Divider,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const roles = ["isAdmin", "isStaff", "isHr"];
const departmentsMap = {
  isAdmin: ["Management"],
  isHr: ["Management"],
  isStaff: ["CSE", "ECE", "CIVIL", "EEE", "MECH", "MCA", "OTHERS"],
};

export default function ManageUsers() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  const [form, setForm] = useState({
    name: "",
    role: "isStaff",
    department: "CSE",
    status: "Active",
    basicPay: 0,
    da: 0,
    hra: 0,
    allowances: 0,
    pf: 0,
    esi: 0,
    professionalTax: 0,
    incomeTax: 0,
    loans: 0,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Sync department on role change
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      department: departmentsMap[prev.role]?.[0] || "",
    }));
  }, [form.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name, value) => {
    if (/^\d*$/.test(value)) {
      setForm((prev) => ({ ...prev, [name]: Number(value) || 0 }));
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      role: "isStaff",
      department: "CSE",
      status: "Active",
      basicPay: 0,
      da: 0,
      hra: 0,
      allowances: 0,
      pf: 0,
      esi: 0,
      professionalTax: 0,
      incomeTax: 0,
      loans: 0,
    });
    setEditingEmployee(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (emp) => {
    setForm({ ...emp });
    setEditingEmployee(emp);
    setShowForm(true);
  };

  const handleAddOrUpdateEmployee = () => {
    if (!form.name.trim() || !form.role.trim() || !form.department.trim()) {
      alert("Please fill in all required fields: Name, Role, and Department.");
      return;
    }

    if (editingEmployee) {
      
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editingEmployee.id ? { ...form, id: editingEmployee.id } : emp))
      );
    } else {
      
      setEmployees((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  const grossSalary = form.basicPay + form.da + form.hra + form.allowances;
  const totalDeductions =
    form.pf + form.esi + form.professionalTax + form.incomeTax + form.loans;
  const netSalary = grossSalary - totalDeductions;

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#0f172a",
      color: "white",
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "#60a5fa",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3b82f6",
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root": {
      color: "#cbd5e1",
    },
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-lg lg:text-2xl font-bold tracking-wide">Manage Employees</h1>
        <Button
  variant="outlined"
  startIcon={<FaPlus />}
  onClick={openAddForm}
  sx={{
    backgroundColor: "black",
    color: "white",
    borderColor: "white",
    px: 1.5,  
    py: 0.5,  
    fontWeight: "bold",
    fontSize: "0.875rem", 
    minWidth: "auto",      
    "&:hover": {
      backgroundColor: "#222222",
      borderColor: "white",
    },
  }}
  size={isMobile ? "small" : "small"}  
>
  Add Employee
</Button>

      </div>

      {/* Table for desktop/tablet */}
      <div className="hidden sm:block overflow-x-auto rounded-xl shadow-lg border border-gray-800">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 uppercase text-xs tracking-wider select-none">
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department</th>
              <th className="p-4">Status</th>
              <th className="p-4">Net Salary</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400 italic">
                  No employees added yet.
                </td>
              </tr>
            )}
            {employees.map((emp, index) => {
              const empGross =
                emp.basicPay + emp.da + emp.hra + emp.allowances;
              const empDeduct =
                emp.pf + emp.esi + emp.professionalTax + emp.incomeTax + emp.loans;
              const empNet = empGross - empDeduct;

              return (
                <tr
                  key={emp.id}
                  className={`transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                  } hover:bg-gray-700`}
                >
                  <td className="p-4 font-medium text-gray-100">{emp.name}</td>
                  <td className="p-4 text-gray-300">{emp.role}</td>
                  <td className="p-4 text-gray-300">{emp.department}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          emp.status === "Active"
                            ? "bg-green-400"
                            : "bg-gray-500"
                        }`}
                      ></span>
                      <span
                        className={`text-sm ${
                          emp.status === "Active"
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-green-400">{empNet}</td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      sx={{ minWidth: "36px", borderRadius: "50%", p: "6px" }}
                      onClick={() => setViewingEmployee(emp)}
                      title="View Employee"
                    >
                      <FaEye />
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ minWidth: "36px", borderRadius: "50%", p: "6px" }}
                      onClick={() => openEditForm(emp)}
                      title="Edit Employee"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ minWidth: "36px", borderRadius: "50%", p: "6px" }}
                      onClick={() => handleDelete(emp.id)}
                      title="Delete Employee"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-4">
        {employees.length === 0 && (
          <p className="text-center text-gray-400 italic mt-10">
            No employees added yet.
          </p>
        )}
        {employees.map((emp) => {
          const empGross =
            emp.basicPay + emp.da + emp.hra + emp.allowances;
          const empDeduct =
            emp.pf + emp.esi + emp.professionalTax + emp.incomeTax + emp.loans;
          const empNet = empGross - empDeduct;

          return (
            <div
              key={emp.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-2"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold">{emp.name}</h3>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    variant="outlined"
                    color="info"
                    sx={{ minWidth: "32px", borderRadius: "50%", p: "6px" }}
                    onClick={() => setViewingEmployee(emp)}
                    title="View Employee"
                  >
                    <FaEye />
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ minWidth: "32px", borderRadius: "50%", p: "6px" }}
                    onClick={() => openEditForm(emp)}
                    title="Edit Employee"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    sx={{ minWidth: "32px", borderRadius: "50%", p: "6px" }}
                    onClick={() => handleDelete(emp.id)}
                    title="Delete Employee"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
              <p>
                <span className="font-semibold">Role:</span> {emp.role}
              </p>
              <p>
                <span className="font-semibold">Department:</span> {emp.department}
              </p>
              <p className="flex items-center gap-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    emp.status === "Active" ? "bg-green-400" : "bg-gray-500"
                  }`}
                ></span>
                <span
                  className={`text-sm ${
                    emp.status === "Active" ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {emp.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Net Salary:</span>{" "}
                <span className="text-green-400">{empNet}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Add / Update Employee Drawer */}
      <Drawer
        anchor="right"
        open={showForm}
        onClose={() => {
          setShowForm(false);
          resetForm();
        }}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400 },
            backgroundColor: "#1e293b",
            p: 3,
          },
        }}
      >
        <h2 className="text-xl font-bold mb-4 text-white select-none">
          {editingEmployee ? "Update Employee" : "Add Employee"}
        </h2>

        {/* Name */}
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={inputSx}
          required
          autoFocus
        />

        {/* Role */}
        <TextField
          select
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={inputSx}
          required
        >
          {roles.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>

        {/* Department */}
        <TextField
          select
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={inputSx}
          required
        >
          {(departmentsMap[form.role] || []).map((dep) => (
            <MenuItem key={dep} value={dep}>
              {dep}
            </MenuItem>
          ))}
        </TextField>

        <Divider sx={{ my: 2, borderColor: "#334155" }} />
        <h4 className="text-white mb-2 select-none">Salary Details</h4>

        {[
          { name: "basicPay", label: "Basic Pay" },
          { name: "da", label: "Dearness Allowance (DA)" },
          { name: "hra", label: "House Rent Allowance (HRA)" },
          { name: "allowances", label: "Allowances" },
          { name: "pf", label: "Provident Fund (PF)" },
          { name: "esi", label: "Employee State Insurance (ESI)" },
          { name: "professionalTax", label: "Professional Tax" },
          { name: "incomeTax", label: "Income Tax" },
          { name: "loans", label: "Loans" },
        ].map(({ name, label }) => (
          <TextField
            key={name}
            label={label}
            name={name}
            value={form[name]}
            onChange={(e) => handleNumberChange(name, e.target.value)}
            type="text"
            fullWidth
            margin="normal"
            variant="outlined"
            sx={inputSx}
            inputProps={{ min: 0 }}
          />
        ))}

        {/* Status */}
        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={inputSx}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>

        <p className="mt-4 font-semibold text-green-400 select-none">
          Net Salary: {netSalary}
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <Button
  variant="outlined"
  onClick={() => {
    setShowForm(false);
    resetForm();
  }}
  sx={{
    backgroundColor: "white",
    color: "black",
    borderColor: "black",
    "&:hover": {
      backgroundColor: "#f0f0f0",
      borderColor: "black",
    },
  }}
>
  Cancel
</Button>

          <Button variant="contained" onClick={handleAddOrUpdateEmployee}>
            {editingEmployee ? "Update" : "Add"}
          </Button>
        </div>
      </Drawer>

      {/* View Employee Dialog */}
      <Dialog
        open={!!viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-gray-800 text-white select-none">Employee Details</DialogTitle>
        <DialogContent dividers className="bg-gray-900 text-gray-300">
          {viewingEmployee && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {viewingEmployee.name}</p>
              <p><strong>Role:</strong> {viewingEmployee.role}</p>
              <p><strong>Department:</strong> {viewingEmployee.department}</p>
              <p><strong>Status:</strong> {viewingEmployee.status}</p>
              <Divider sx={{ my: 1, borderColor: "#475569" }} />
              <p><strong>Basic Pay:</strong> {viewingEmployee.basicPay}</p>
              <p><strong>DA:</strong> {viewingEmployee.da}</p>
              <p><strong>HRA:</strong> {viewingEmployee.hra}</p>
              <p><strong>Allowances:</strong> {viewingEmployee.allowances}</p>
              <Divider sx={{ my: 1, borderColor: "#475569" }} />
              <p><strong>PF:</strong> {viewingEmployee.pf}</p>
              <p><strong>ESI:</strong> {viewingEmployee.esi}</p>
              <p><strong>Professional Tax:</strong> {viewingEmployee.professionalTax}</p>
              <p><strong>Income Tax:</strong> {viewingEmployee.incomeTax}</p>
              <p><strong>Loans:</strong> {viewingEmployee.loans}</p>
              <Divider sx={{ my: 1, borderColor: "#475569" }} />
              <p className="font-semibold text-green-400">
                Net Salary:{" "}
                {viewingEmployee.basicPay +
                  viewingEmployee.da +
                  viewingEmployee.hra +
                  viewingEmployee.allowances -
                  (viewingEmployee.pf +
                    viewingEmployee.esi +
                    viewingEmployee.professionalTax +
                    viewingEmployee.incomeTax +
                    viewingEmployee.loans)}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-800">
          <Button onClick={() => setViewingEmployee(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

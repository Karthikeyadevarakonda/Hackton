import { useState } from 'react';
import {
  HiUserAdd,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from 'react-icons/hi';

const initialUsers = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'HR',
    salary: {
      basic: 32000,
      da: 4800,
      hra: 8000,
      pf: 1800,
      esi: 650,
      tax: 3000,
    },
  },
  {
    id: 2,
    name: 'Bob Williams',
    email: 'bob@example.com',
    role: 'Staff',
    salary: {
      basic: 28000,
      da: 4000,
      hra: 7000,
      pf: 1600,
      esi: 500,
      tax: 2500,
    },
  },
];

const roles = ['Admin', 'HR', 'Staff'];

const ManageUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Staff',
    salary: {
      basic: '',
      da: '',
      hra: '',
      pf: '',
      esi: '',
      tax: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.salary) {
      setForm({ ...form, salary: { ...form.salary, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedSalary = Object.fromEntries(
      Object.entries(form.salary).map(([k, v]) => [k, Number(v)])
    );

    const newUser = {
      ...form,
      id: editingUserId || Date.now(),
      salary: formattedSalary,
    };

    if (editingUserId) {
      setUsers((prev) => prev.map((u) => (u.id === editingUserId ? newUser : u)));
    } else {
      setUsers((prev) => [...prev, newUser]);
    }

    setForm({
      name: '',
      email: '',
      role: 'Staff',
      salary: {
        basic: '',
        da: '',
        hra: '',
        pf: '',
        esi: '',
        tax: '',
      },
    });

    setEditingUserId(null);
    setShowForm(false);
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      salary: { ...user.salary },
    });
    setEditingUserId(user.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const calculateNetSalary = (salary) =>
    salary.basic + salary.da + salary.hra - salary.pf - salary.esi - salary.tax;

  return (
    <div className="text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-teal-400">Manage Employees</h1>
        <button
          onClick={() => {
            setForm({
              name: '',
              email: '',
              role: 'Staff',
              salary: {
                basic: '',
                da: '',
                hra: '',
                pf: '',
                esi: '',
                tax: '',
              },
            });
            setEditingUserId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold px-5 py-2 rounded transition"
        >
          <HiUserAdd className="text-lg" />
          Add Employee
        </button>
      </div>

      <div className="overflow-auto border border-slate-700 rounded-lg">
        <table className="min-w-full table-auto bg-slate-800 text-sm">
          <thead className="bg-slate-700 text-teal-400 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Net Salary</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-slate-600 hover:bg-slate-700 transition"
              >
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 text-green-400 font-semibold">
                  ₹{calculateNetSalary(user.salary).toLocaleString()}
                </td>
                <td className="p-3 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-400 hover:text-blue-300"
                    title="Edit"
                  >
                    <HiOutlinePencilAlt className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-400"
                    title="Delete"
                  >
                    <HiOutlineTrash className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-6 animate-fadeIn">
          <div className="bg-slate-900 w-full max-w-4xl p-8 rounded-xl border border-slate-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-teal-400 mb-6 text-center">
              {editingUserId ? 'Edit Employee' : 'Add New Employee'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter name"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-md focus:ring-2 focus:ring-teal-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-md focus:ring-2 focus:ring-teal-500 transition"
                  />
                </div>
                <div className="relative z-10">
                  <label className="block text-sm text-gray-300 mb-1">Role</label>
                  <div className="relative">
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="appearance-none w-full px-4 py-2 pr-10 bg-slate-800 border border-slate-600 text-white rounded-md focus:ring-2 focus:ring-teal-500 transition"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Section */}
              <div>
                <h3 className="text-teal-400 font-semibold mb-3">Salary Components</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(form.salary).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-sm text-gray-300 block mb-1">
                        {{
                          basic: 'Basic Pay',
                          da: 'Dearness Allowance (DA)',
                          hra: 'House Rent Allowance (HRA)',
                          pf: 'Provident Fund (PF)',
                          esi: 'Employee State Insurance (ESI)',
                          tax: 'Income Tax',
                        }[key]}
                      </label>
                      <input
                        type="number"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-md focus:ring-2 focus:ring-teal-500 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold rounded-md transition"
                >
                  {editingUserId ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

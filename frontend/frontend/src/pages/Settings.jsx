

import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Building,
  Percent,
  ShieldCheck,
  RotateCcw,
  Info,
  Save,
} from "lucide-react";


export default function Settings() {
const [loading, setLoading] = useState(true);

const [companySettings, setCompanySettings] = useState(null);
const [taxBands, setTaxBands] = useState([]);

const [activeTab, setActiveTab] = useState("comp");

// Company Settings
const [compName, setCompName] = useState("");
const [compEmail, setCompEmail] = useState("");
const [compPhone, setCompPhone] = useState("");
const [compAddress, setCompAddress] = useState("");
const [compLogoUrl, setCompLogoUrl] = useState("");
const [compYear, setCompYear] = useState(2026);

// SSNIT Settings
const [empSsnit, setEmpSsnit] = useState(5.5);
const [employerSsnit, setEmployerSsnit] = useState(13);
const [defaultHours, setDefaultHours] = useState(8);

// Lateness Settings
const [lateGraceMins, setLateGraceMins] = useState(5);
const [lateTargetTime, setLateTargetTime] = useState("08:00:00");
const [lateDeductionRate, setLateDeductionRate] = useState(50);

// Tax Bands
const [editingBands, setEditingBands] = useState([]);

const [users, setUsers] = useState([]);
const [roles, setRoles] = useState([]);

const [showCreateUser, setShowCreateUser] = useState(false);
const [showResetModal, setShowResetModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [newPassword, setNewPassword] = useState("");

const [showEditModal, setShowEditModal] = useState(false);
const [editUser, setEditUser] = useState(null);

const [newUser, setNewUser] = useState({
  full_name: "",
  username: "",
  email: "",
  password: "",
  role_id: 2,
});


const resetPassword = async () => {
  try {
    await api.put(
      `/users/${selectedUser.id}/reset-password`,
      {
        password: newPassword,
      }
    );

    alert("Password reset successfully");

    setShowResetModal(false);
    setNewPassword("");
  } catch (err) {
    console.error(err);
    alert("Failed to reset password");
  }
};
const createUser = async () => {
  try {
    await api.post("/users", newUser);

    alert("User created successfully");

    setShowCreateUser(false);

    loadUsers();
  } catch (err) {
    console.error(err);
    alert("Failed to create user");
  }
};

const updateUser = async () => {
  try {
    await api.put(`/users/${editUser.id}`, {
      full_name: editUser.full_name,
      username: editUser.username,
      email: editUser.email,
      role_id: editUser.role_id,
      employee_id: editUser.employee_id,
    });

    alert("User updated successfully");

    setShowEditModal(false);

    loadUsers();
  } catch (err) {
    console.error(err);
    alert("Failed to update user");
  }
};

useEffect(() => {
  loadSettings();
}, []);

const loadSettings = async () => {
  try {
    const res = await api.get("/settings");

    const company = res.data.company;
    const bands = res.data.taxBands || [];

    setCompanySettings(company);
    setTaxBands(bands);

    setCompName(company.name || "");
    setCompEmail(company.email || "");
    setCompPhone(company.phone || "");
    setCompAddress(company.address || "");
    setCompLogoUrl(company.logo_url || "");
    setCompYear(company.payroll_year || 2026);

    setEmpSsnit(
      Number(company.employee_ssnit_rate || 5.5)
    );

    setEmployerSsnit(
      Number(company.employer_ssnit_rate || 13)
    );

    setDefaultHours(
      Number(company.default_working_hours || 8)
    );

    setLateGraceMins(
      Number(company.late_grace_mins || 5)
    );

    setLateTargetTime(
      company.late_target_time || "08:00:00"
    );

    setLateDeductionRate(
      Number(company.late_deduction_rate || 50)
    );

    setEditingBands(bands);
  } catch (error) {
    console.error(error);
    alert("Failed to load settings");
  } finally {
    setLoading(false);
  }
};

const handleSaveCompany = async (e) => {
  e.preventDefault();

  try {
    await api.put("/settings/company", {
      name: compName,
      email: compEmail,
      phone: compPhone,
      address: compAddress,
      logo_url: compLogoUrl,
      payroll_year: compYear,
    });

    alert("Company settings saved successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to save company settings");
  }
};

const handleSaveSsnit = async (e) => {
  e.preventDefault();

  try {
    await api.put("/settings/payroll", {
      employee_ssnit_rate: empSsnit,
      employer_ssnit_rate: employerSsnit,
      default_working_hours: defaultHours,
      late_target_time: lateTargetTime,
      late_grace_mins: lateGraceMins,
      late_deduction_rate: lateDeductionRate,
    });

    alert("Payroll settings saved successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to save payroll settings");
  }
};
const loadUsers = async () => {
  try {
    const res = await api.get("/users");

    if (res.data.success) {
      setUsers(res.data.data);
    }
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  loadUsers();
}, []);

const handleUpdateBandLimit = (index, value) => {
  const updated = [...editingBands];

  updated[index].limit_value =
    value === "" ? null : Number(value);

  setEditingBands(updated);
};

const handleUpdateBandRate = (index, value) => {
  const updated = [...editingBands];

  updated[index].rate = Number(value);

  setEditingBands(updated);
};

const handleSaveTaxBands = async () => {
  try {
    await api.put("/settings/tax-bands", {
      taxBands: editingBands,
    });

    alert("Tax bands updated successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to update tax bands");
  }
};

const handleResetTaxBands = async () => {
  const confirmed = window.confirm(
    "Reset tax bands to default GRA values?"
  );

  if (!confirmed) return;

  try {
    await loadSettings();
  } catch (error) {
    console.error(error);
  }
};

if (loading) {
  return (
    <div className="p-8">
      Loading settings...
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* Page Title header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Configuration</h2>
          <p className="text-slate-500 text-xs mt-0.5">Configure compliance brackets, SSNIT ratios, and operational schedules.</p>
        </div>

        {/* Configurations tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('comp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'comp' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Corporate Identity
          </button>
          <button
            onClick={() => setActiveTab('ssnit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ssnit' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SSNIT & Shifts
          </button>
          <button
            onClick={() => setActiveTab('tax')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tax' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-settings-tax"
          >
            GRA Progressive tax
          </button>

           <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'users' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-settings-users"
          >
           User Management
          </button>


       


        </div>
      </div>

      {/* ================= CONFIGURATION PANEL 1: REGULAR COMPANY DETAILS ================= */}
      {activeTab === 'comp' && (
        <form onSubmit={handleSaveCompany} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl">
          <div className="p-6 pb-2">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 mb-4">
              <Building size={16} className="text-blue-600" />
              Company Details Setup
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1">Company Registered Name *</label>
                <input
                  type="text"
                  required
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="px-3 py-2 w-full border border-slate-250 rounded text-xs focus:ring-1 focus:ring-blue-500 font-semibold text-slate-800 bg-slate-50/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={compEmail}
                  onChange={(e) => setCompEmail(e.target.value)}
                  className="px-3 py-2 w-full border border-slate-250 rounded text-xs focus:ring-1 focus:ring-blue-500 text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Corporate Phone Line *</label>
                <input
                  type="tel"
                  required
                  value={compPhone}
                  onChange={(e) => setCompPhone(e.target.value)}
                  className="px-3 py-2 w-full border border-slate-250 rounded text-xs focus:ring-1 focus:ring-blue-500 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">Head Office Address *</label>
                <textarea
                  rows={2}
                  required
                  value={compAddress}
                  onChange={(e) => setCompAddress(e.target.value)}
                  className="px-3 py-2 w-full border border-slate-250 rounded text-xs focus:ring-1 focus:ring-blue-500 text-slate-850 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Simulated Logo URL</label>
                <input
                  type="text"
                  value={compLogoUrl}
                  onChange={(e) => setCompLogoUrl(e.target.value)}
                  className="px-3 py-2 w-full border border-slate-250 rounded text-xs focus:ring-1 focus:ring-blue-500 font-mono text-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Current Active Fiscal Year *</label>
                <input
                  type="number"
                  required
                  value={compYear}
                  onChange={(e) => setCompYear(Number(e.target.value))}
                  className="px-3 py-2 w-full border border-slate-250 rounded text-xs focus:ring-1 focus:ring-blue-500 text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50/70 p-4 px-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save size={13} />
              Save Identity Parameters
            </button>
          </div>
        </form>
      )}

      {/* ================= CONFIGURATION PANEL 2: SSNIT & STATUTORY DEFAULT VARIABLES ================= */}
      {activeTab === 'ssnit' && (
        <form onSubmit={handleSaveSsnit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl">
          <div className="p-6 pb-2 space-y-6">
            <div>
              <h3 className="font-semibold text-slate-850 text-sm flex items-center gap-2 mb-3">
                <Percent size={16} className="text-blue-600" />
                Statutory Pensions & SSNIT Percentages
              </h3>
              <p className="text-slate-400 text-xs mb-4">
                Configure basic legal ratios in accordance with Ghana's Three-Tier Premium Scheme under National Act 766 (Employer 13% • Employee 5.5%).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                <div>
                  <label className="block text-xs font-bold mb-1">Employee SSNIT Contribution (%) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={empSsnit}
                    onChange={(e) => setEmpSsnit(Number(e.target.value))}
                    className="px-3 py-2 w-full border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:ring-1"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Deducted from Employee Basic Salary (Default: 5.5%).</p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Employer SSNIT Contribution (%) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={employerSsnit}
                    onChange={(e) => setEmployerSsnit(Number(e.target.value))}
                    className="px-3 py-2 w-full border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:ring-1"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Matched by Company directly (Default: 13.0%).</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 text-left">
              <h3 className="font-extrabold text-slate-850 text-sm mb-3">Operational Defaults</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                <div>
                  <label className="block text-xs font-bold mb-1">Standard Daily Work hours *</label>
                  <input
                    type="number"
                    required
                    value={defaultHours}
                    onChange={(e) => setDefaultHours(Number(e.target.value))}
                    className="px-3 py-2 w-full border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Baseline daily shift count. Used for audits (Default: 8).</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 text-left space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-850 text-sm">Lateness Deduction & Grace Rules</h3>
                <p className="text-slate-400 text-xs mt-0.5">Define employee shifts start parameters, allowable buffer mins, and salary charge deductions per late incident.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
                <div>
                  <label className="block text-xs font-bold mb-1">Expected Clock-In Time *</label>
                  <input
                    type="time"
                    required
                    value={lateTargetTime}
                    onChange={(e) => setLateTargetTime(e.target.value)}
                    className="px-3 py-2 w-full border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Standard daily shift target start (e.g. 08:00).</p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Grace Period (Minutes) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={lateGraceMins}
                    onChange={(e) => setLateGraceMins(Number(e.target.value))}
                    className="px-3 py-2 w-full border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Allowed buffer past start time (e.g. 5 mins).</p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Incident Deduction Amt (GH₵) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={lateDeductionRate}
                    onChange={(e) => setLateDeductionRate(Number(e.target.value))}
                    className="px-3 py-2 w-full border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Penalty fee deducted per late strike (GHS).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/70 p-4 px-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save size={13} />
              Save SSNIT Parameters
            </button>
          </div>
        </form>
      )}

      {/* ================= CONFIGURATION PANEL 3: GRA PROGRESSIVE GRADUATED SCALE EDITOR ================= */}
      {activeTab === 'tax' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl space-y-4">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
              <div>
                <h3 className="font-semibold text-slate-850 text-sm flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  Progressive Monthly Tax Scale (GRA 2026 Bands)
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Configure graduated tax band buckets. Leave the limit field EMPTY for final row and above.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleResetTaxBands}
                  className="bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Restore standard scale
                </button>
              </div>
            </div>

            {/* List and editable inputs of GRA Bands */}
            <div className="pt-4 space-y-3">
              <div className="grid grid-cols-12 gap-3 text-xs font-extrabold text-slate-500 uppercase border-b border-slate-50 pb-2">
                <div className="col-span-1">Band #</div>
                <div className="col-span-5">Band size (Taxable In This Band - GHS)</div>
                <div className="col-span-4">Tax rate (%)</div>
                <div className="col-span-2 text-right">Preview status</div>
              </div>

              {editingBands.map((band, idx) => (
                <div key={band.id} className="grid grid-cols-12 gap-3 items-center text-xs">
                  <div className="col-span-1 font-bold font-mono text-slate-400">#{idx + 1}</div>
                  
                  {/* Band Size limit input element */}
                  <div className="col-span-5">
                    {band.limit_value === null ? (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-500 font-bold italic text-left">
                        No maximum ceiling (Above previously sum)
                      </div>
                    ) : (
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-[10px] text-slate-400">GH₵</span>
                        <input
                          type="number"
                          value={band.limit_value}
                          onChange={(e) => handleUpdateBandLimit(idx, e.target.value)}
                          className="pl-8 pr-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
                        />
                      </div>
                    )}
                  </div>

                  {/* Rate input element */}
                  <div className="col-span-4">
                    <div className="relative">
                      <input
                        type="number"
                        value={band.rate}
                        onChange={(e) => handleUpdateBandRate(idx, e.target.value)}
                        className="pl-3 pr-8 py-1.5 w-full border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">%</span>
                    </div>
                  </div>

                  {/* Status labels */}
                  <div className="col-span-2 text-right">
                    <span className={`text-[10px] uppercase font-bold py-1 px-2 rounded-md ${
                      band.rate === 0 
                        ? 'bg-slate-100 text-slate-500' 
                        : band.rate <= 15
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {band.rate === 0 ? 'Tax Free' : `${band.rate}% Tier`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded border border-slate-200 flex gap-2 text-xs leading-relaxed text-slate-500">
              <Info className="text-blue-400 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-semibold text-slate-700">Cumulative Ceiling check:</p>
                <p className="text-[11px] mt-0.5">
                  Taxable income represents Gross minus 5.5% SSNIT. The first chunk of GHS 490 has a 0% rate, meaning no PAYE is charged for salaries under that amount. Next, 5% applies to the next GHS 110, and so on.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/70 p-4 px-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveTaxBands}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save size={13} />
              Save Graduated Bands
            </button>
          </div>
        </div>
      )}
      {activeTab === "users" && (
  <div className="bg-white rounded-xl border border-slate-200 p-5">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-lg">
        User Management
      </h3>

     <button
  onClick={() => setShowCreateUser(true)}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Create User
</button>
    </div>

    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2">Name</th>
          <th className="text-left py-2">Username</th>
          <th className="text-left py-2">Email</th>
          <th className="text-left py-2">Role</th>
          <th className="text-left py-2">Status</th>
          <th className="text-right py-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b">
            <td className="py-3">{user.full_name}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role_name}</td>

            <td>
              {user.is_active ? (
                <span className="text-green-600">
                  Active
                </span>
              ) : (
                <span className="text-red-600">
                  Disabled
                </span>
              )}
            </td>

            <td className="text-right">
             <button
  className="text-blue-600 mr-3"
  onClick={() => {
    setEditUser(user);
    setShowEditModal(true);
  }}
>
  Edit
</button>

           <button
  className="text-amber-600 mr-3"
  onClick={() => {
    setSelectedUser(user);
    setShowResetModal(true);
  }}
>
  Reset Password
</button>

            <button
  className="text-red-600"
  onClick={async () => {
    try {
      await api.put(
        `/users/${user.id}/toggle-status`
      );

      loadUsers();
    } catch (err) {
      console.error(err);
    }
  }}
>
  {user.is_active ? "Disable" : "Enable"}
</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {showCreateUser && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">
        Create User
      </h3>

      <input
        placeholder="Full Name"
        className="w-full border p-2 rounded mb-3"
        value={newUser.full_name}
        onChange={(e) =>
          setNewUser({
            ...newUser,
            full_name: e.target.value,
          })
        }
      />

      <input
        placeholder="Username"
        className="w-full border p-2 rounded mb-3"
        value={newUser.username}
        onChange={(e) =>
          setNewUser({
            ...newUser,
            username: e.target.value,
          })
        }
      />

      <input
        placeholder="Email"
        className="w-full border p-2 rounded mb-3"
        value={newUser.email}
        onChange={(e) =>
          setNewUser({
            ...newUser,
            email: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded mb-3"
        value={newUser.password}
        onChange={(e) =>
          setNewUser({
            ...newUser,
            password: e.target.value,
          })
        }
      />

      <select
        className="w-full border p-2 rounded mb-4"
        value={newUser.role_id}
        onChange={(e) =>
          setNewUser({
            ...newUser,
            role_id: Number(e.target.value),
          })
        }
      >
        <option value={1}>Administrator</option>
        <option value={2}>HR Officer</option>
        <option value={3}>Payroll Officer</option>
        <option value={4}>Read Only</option>
      </select>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowCreateUser(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={createUser}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save User
        </button>
      </div>
    </div>
  </div>
)}

{showResetModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">
        Reset Password
      </h3>

      <p className="text-sm text-slate-500 mb-4">
        {selectedUser?.full_name}
      </p>

      <input
        type="password"
        placeholder="New Password"
        className="w-full border p-2 rounded mb-4"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(e.target.value)
        }
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowResetModal(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={resetPassword}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Password
        </button>
      </div>
    </div>
  </div>
)}

{showEditModal && editUser && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
      <h3 className="text-lg font-bold mb-4">
        Edit User
      </h3>

      <input
        className="w-full border p-2 rounded mb-3"
        value={editUser.full_name}
        onChange={(e) =>
          setEditUser({
            ...editUser,
            full_name: e.target.value,
          })
        }
      />

      <input
        className="w-full border p-2 rounded mb-3"
        value={editUser.username}
        onChange={(e) =>
          setEditUser({
            ...editUser,
            username: e.target.value,
          })
        }
      />

      <input
        className="w-full border p-2 rounded mb-3"
        value={editUser.email}
        onChange={(e) =>
          setEditUser({
            ...editUser,
            email: e.target.value,
          })
        }
      />

      <select
        className="w-full border p-2 rounded mb-4"
        value={editUser.role_id}
        onChange={(e) =>
          setEditUser({
            ...editUser,
            role_id: Number(e.target.value),
          })
        }
      >
        <option value={1}>Administrator</option>
        <option value={2}>HR Officer</option>
        <option value={3}>Payroll Officer</option>
        <option value={4}>Read Only</option>
      </select>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowEditModal(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={updateUser}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );

}
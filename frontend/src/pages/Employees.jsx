import { useEffect, useState,useRef } from "react";
import {
  Search,
  UserPlus,
  Edit2,
  Archive,
  Trash2,
  Eye,
  X,
  Save,
  Upload,
  Download,
} from "lucide-react";
import api from "../services/api";
import { usePager, Pager } from "./_shiftui";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("");

  const [detailedEmployee, setDetailedEmployee] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [formId, setFormId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [gender, setGender] = useState("Male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [dateEmployed, setDateEmployed] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [position, setPosition] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ssnitNumber, setSsnitNumber] = useState("");
  const [ghanaCardNumber, setGhanaCardNumber] = useState("");
  const [status, setStatus] = useState("Active");
  const [photoUrl, setPhotoUrl] = useState("");

  const [basicSalary, setBasicSalary] = useState(0);
  const [transportAllowance, setTransportAllowance] = useState(0);
  const [housingAllowance, setHousingAllowance] = useState(0);
  const [utilityAllowance, setUtilityAllowance] = useState(0);
  const [riskAllowance, setRiskAllowance] = useState(0);
  const [otherAllowances, setOtherAllowances] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);

  const profilePics = [
    "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
    "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
    "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
    "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
    "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
    "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
  ];

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (value) => {
    if (!value) return "";
    return String(value).split("T")[0];
  };

  const mapEmployee = (row) => ({
    ...row,
    firstName: row.first_name,
    lastName: row.last_name,
    otherNames: row.other_names,
    dateOfBirth: formatDate(row.date_of_birth),
    phoneNumber: row.phone_number,
    dateEmployed: formatDate(row.date_employed),
    departmentId: row.department_id,
    employmentType: row.employment_type,
    bankName: row.bank_name,
    bankAccount: row.bank_account,
    ssnitNumber: row.ssnit_number,
    ghanaCardNumber: row.ghana_card_number,
    photoUrl: row.photo_url,
    basicSalary: Number(row.basic_salary || 0),
    transportAllowance: Number(row.transport_allowance || 0),
    housingAllowance: Number(row.housing_allowance || 0),
    utilityAllowance: Number(row.utility_allowance || 0),
    riskAllowance: Number(row.risk_allowance || 0),
    otherAllowances: Number(row.other_allowances || 0),
    otherDeductions: Number(row.other_deductions || 0),
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const [empRes, deptRes] = await Promise.all([
        api.get("/employees"),
        api.get("/departments"),
      ]);

      if (empRes.data.success) {
        setEmployees(empRes.data.data.map(mapEmployee));
      }

      if (deptRes.data.success) {
        setDepartments(deptRes.data.data);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load employee data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormId("");
    setFirstName("");
    setLastName("");
    setOtherNames("");
    setGender("Male");
    setDateOfBirth("1992-06-15");
    setPhoneNumber("");
    setEmail("");
    setAddress("");
    setDateEmployed(new Date().toISOString().split("T")[0]);
    setDepartmentId(departments[0]?.id || "");
    setPosition("");
    setEmploymentType("Full-Time");
    setBankName("Ecobank Ghana Ltd");
    setBankAccount("");
    setSsnitNumber("");
    setGhanaCardNumber("");
    setStatus("Active");
    setPhotoUrl(profilePics[0]);

    setBasicSalary(2500);
    setTransportAllowance(200);
    setHousingAllowance(200);
    setUtilityAllowance(50);
    setRiskAllowance(0);
    setOtherAllowances(0);
    setOtherDeductions(0);
  };

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);

    setFormId(emp.id);
    setFirstName(emp.firstName || "");
    setLastName(emp.lastName || "");
    setOtherNames(emp.otherNames || "");
    setGender(emp.gender || "Male");
    setDateOfBirth(emp.dateOfBirth || "");
    setPhoneNumber(emp.phoneNumber || "");
    setEmail(emp.email || "");
    setAddress(emp.address || "");
    setDateEmployed(emp.dateEmployed || "");
    setDepartmentId(emp.departmentId || "");
    setPosition(emp.position || "");
    setEmploymentType(emp.employmentType || "Full-Time");
    setBankName(emp.bankName || "");
    setBankAccount(emp.bankAccount || "");
    setSsnitNumber(emp.ssnitNumber || "");
    setGhanaCardNumber(emp.ghanaCardNumber || "");
    setStatus(emp.status || "Active");
    setPhotoUrl(emp.photoUrl || profilePics[0]);

    setBasicSalary(Number(emp.basicSalary || 0));
    setTransportAllowance(Number(emp.transportAllowance || 0));
    setHousingAllowance(Number(emp.housingAllowance || 0));
    setUtilityAllowance(Number(emp.utilityAllowance || 0));
    setRiskAllowance(Number(emp.riskAllowance || 0));
    setOtherAllowances(Number(emp.otherAllowances || 0));
    setOtherDeductions(Number(emp.otherDeductions || 0));

    setIsFormOpen(true);
  };

  const buildPayload = () => ({
    first_name: firstName,
    last_name: lastName,
    other_names: otherNames,
    gender,
    date_of_birth: dateOfBirth,
    phone_number: phoneNumber,
    email,
    address,
    date_employed: dateEmployed,
    department_id: departmentId,
    position,
    employment_type: employmentType,
    bank_name: bankName,
    bank_account: bankAccount,
    ssnit_number: ssnitNumber,
    ghana_card_number: ghanaCardNumber,
    status,
    photo_url: photoUrl,
    basic_salary: Number(basicSalary || 0),
    transport_allowance: Number(transportAllowance || 0),
    housing_allowance: Number(housingAllowance || 0),
    utility_allowance: Number(utilityAllowance || 0),
    risk_allowance: Number(riskAllowance || 0),
    other_allowances: Number(otherAllowances || 0),
    other_deductions: Number(otherDeductions || 0),
  });

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (!firstName || !lastName || !email || !departmentId) {
        alert("First name, last name, email and department are required.");
        return;
      }

      const payload = buildPayload();

      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, payload);
      } else {
        await api.post("/employees", payload);
      }

      setIsFormOpen(false);
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save employee.");
    }
  };

  const handleDelete = async (emp) => {
    if (!confirm(`Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`)) {
      return;
    }

    try {
      await api.delete(`/employees/${emp.id}`);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee.");
    }
  };

  const handleDeactivate = async (emp) => {
    try {
      const updated = {
        ...emp,
        status: emp.status === "Active" ? "Inactive" : "Active",
      };

      await api.put(`/employees/${emp.id}`, {
        first_name: updated.firstName,
        last_name: updated.lastName,
        other_names: updated.otherNames,
        gender: updated.gender,
        date_of_birth: updated.dateOfBirth,
        phone_number: updated.phoneNumber,
        email: updated.email,
        address: updated.address,
        date_employed: updated.dateEmployed,
        department_id: updated.departmentId,
        position: updated.position,
        employment_type: updated.employmentType,
        bank_name: updated.bankName,
        bank_account: updated.bankAccount,
        ssnit_number: updated.ssnitNumber,
        ghana_card_number: updated.ghanaCardNumber,
        status: updated.status,
        photo_url: updated.photoUrl,
        basic_salary: updated.basicSalary,
        transport_allowance: updated.transportAllowance,
        housing_allowance: updated.housingAllowance,
        utility_allowance: updated.utilityAllowance,
        risk_allowance: updated.riskAllowance,
        other_allowances: updated.otherAllowances,
        other_deductions: updated.otherDeductions,
      });

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const searchText = `${emp.firstName} ${emp.lastName} ${emp.id} ${emp.position}`.toLowerCase();

    const matchesSearch = searchText.includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDeptFilter === "" || emp.departmentId === selectedDeptFilter;
    const matchesStatus =
      selectedStatusFilter === "" || emp.status === selectedStatusFilter;
    const matchesType =
      selectedTypeFilter === "" || emp.employmentType === selectedTypeFilter;

    return matchesSearch && matchesDept && matchesStatus && matchesType;
  });

  const empPager = usePager(filteredEmployees, 10);

  const fileInputRef = useRef(null);

  const downloadTemplate = () => {
  window.open(
    "/templates/employee-import-template.csv",
    "_blank"
  );
};

const handleImport = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post(
      "/employees/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert(
`Import Complete

Created: ${response.data.created}
Updated: ${response.data.updated}`
    );

    await loadData();

    e.target.value = "";

  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
      error?.message ||
      "Import failed"
    );
  }
};

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Employee List
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage who gets paid, how much and where it lands.
          </p>
        </div>

     



<div className="flex items-center gap-2">

  <button
    onClick={downloadTemplate}
    className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded gap-2 flex items-center"
  >
    <Download size={14} />
    Download Template
  </button>

  <button
    onClick={() => fileInputRef.current.click()}
    className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-4 py-2 rounded gap-2 flex items-center"
  >
    <Upload size={14} />
    Import Employees
  </button>

  <input
    type="file"
    accept=".xlsx,.xls,.csv"
    ref={fileInputRef}
    hidden
    onChange={handleImport}
  />

  <button
    onClick={handleOpenCreate}
    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded flex items-center gap-2"
  >
    <UserPlus size={14} />
    Add Employee
  </button>

</div>



      </div>

      <div className="bg-white p-4 rounded border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search by ID, name or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedDeptFilter}
          onChange={(e) => setSelectedDeptFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded text-xs bg-white text-slate-700"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded text-xs bg-white text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded text-xs bg-white text-slate-700"
        >
          <option value="">All Employment Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm font-semibold">No employees found matching the filters</p>
            <p className="text-xs mt-1">Try resetting the search filters or add a new record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
                  <th className="px-6 py-3.5">ID & Name</th>
                  <th className="px-6 py-3.5">Department & Position</th>
                  <th className="px-6 py-3.5">Employment</th>
                  <th className="px-6 py-3.5">Basic Salary</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {empPager.slice.map((emp) => {
                  const dept = departments.find((d) => d.id === emp.departmentId);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {emp.photoUrl ? (
                            <img
                              src={emp.photoUrl}
                              alt={emp.lastName}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                              {emp.firstName?.[0]}
                              {emp.lastName?.[0]}
                            </div>
                          )}

                          <div>
                            <p className="font-bold text-slate-800">
                              {emp.lastName} {emp.firstName} {emp.otherNames || ""}
                            </p>
                            <p className="text-slate-400 text-[11px] font-mono">{emp.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-3.5">
                        <p className="text-slate-700 font-semibold">{emp.position}</p>
                        <p className="text-xs text-slate-400">
                          {dept ? dept.name : emp.department_name || "Unassigned"}
                        </p>
                      </td>

                      <td className="px-6 py-3.5">
                        <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded-md">
                          {emp.employmentType}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <span className="font-bold text-slate-800">
                          GH₵{formatMoney(emp.basicSalary)}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            emp.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              emp.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          ></span>
                          {emp.status}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => setDetailedEmployee(emp)}
                            className="p-1 px-2 text-xs bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={13} />
                            Inspect
                          </button>

                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1 px-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => handleDeactivate(emp)}
                            className={`p-1 px-1.5 rounded-md transition-colors cursor-pointer ${
                              emp.status === "Active"
                                ? "text-amber-600 hover:bg-amber-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            <Archive size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(emp)}
                            className="p-1 px-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-3">
              <Pager page={empPager.page} pages={empPager.pages} setPage={empPager.setPage} total={empPager.total} perPage={empPager.perPage} />
            </div>
          </div>
        )}
      </div>

      {detailedEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
              <div className="flex gap-4 items-center">
                {detailedEmployee.photoUrl ? (
                  <img
                    src={detailedEmployee.photoUrl}
                    alt={detailedEmployee.lastName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/10 text-white text-lg font-bold flex items-center justify-center">
                    {detailedEmployee.firstName?.[0]}
                    {detailedEmployee.lastName?.[0]}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold tracking-tight">
                    {detailedEmployee.lastName} {detailedEmployee.firstName}{" "}
                    {detailedEmployee.otherNames || ""}
                  </h3>
                  <p className="text-white/70 text-xs font-semibold">
                    {detailedEmployee.position} •{" "}
                    {detailedEmployee.department_name || "Unassigned"}
                  </p>
                  <p className="text-slate-400 text-[10px] font-mono mt-1">
                    {detailedEmployee.id} [{detailedEmployee.employmentType}]
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDetailedEmployee(null)}
                className="text-white/50 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <InfoBlock title="Personal Information">
                <Info label="Gender" value={detailedEmployee.gender} />
                <Info label="Date of Birth" value={detailedEmployee.dateOfBirth} />
                <Info label="Phone Number" value={detailedEmployee.phoneNumber} />
                <Info label="Email Address" value={detailedEmployee.email} />
                <Info label="Residential Address" value={detailedEmployee.address} full />
                <Info label="SSNIT Number" value={detailedEmployee.ssnitNumber} />
                <Info label="Ghana Card" value={detailedEmployee.ghanaCardNumber || "-"} />
              </InfoBlock>

              <InfoBlock title="Bank Registry Settings">
                <Info label="Recipient Bank" value={detailedEmployee.bankName} />
                <Info label="Bank Account Number" value={detailedEmployee.bankAccount} />
              </InfoBlock>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-800 border-b border-slate-200 pb-1.5 mb-3">
                  Monthly Emoluments & Deductions (GHS)
                </h4>

                <div className="bg-slate-50 p-4 rounded border border-slate-200 grid grid-cols-3 gap-3 text-xs">
                  <Money label="Basic Salary" value={detailedEmployee.basicSalary} large />
                  <Money label="Transport Allowance" value={detailedEmployee.transportAllowance} />
                  <Money label="Housing Allowance" value={detailedEmployee.housingAllowance} />
                  <Money label="Utility Allowance" value={detailedEmployee.utilityAllowance} />
                  <Money label="Risk Allowance" value={detailedEmployee.riskAllowance} />
                  <Money label="Other Allowances" value={detailedEmployee.otherAllowances} />

                  <div className="col-span-3 border-t border-slate-200 pt-2 flex justify-between items-center text-xs font-bold font-mono text-slate-700">
                    <span>Other Deductions:</span>
                    <span className="text-rose-600">
                      -GH₵{formatMoney(detailedEmployee.otherDeductions)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">
                Date Employed: {detailedEmployee.dateEmployed}
              </span>

              <button
                onClick={() => {
                  const emp = detailedEmployee;
                  setDetailedEmployee(null);
                  handleOpenEdit(emp);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded font-medium cursor-pointer"
              >
                Edit Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-2xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col my-5 max-h-[92vh]">
            <div className="bg-slate-50 border-b border-slate-100 p-5 px-6 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {editingEmployee ? `Edit Employee: ${editingEmployee.id}` : "Create New Personnel Form"}
                </h3>
                <p className="text-slate-400 text-xs">Create or update employee record.</p>
              </div>

              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <SectionTitle title="1. Profile Details & Contacts" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TextInput label="First Name *" value={firstName} setValue={setFirstName} required />
                <TextInput label="Last Name *" value={lastName} setValue={setLastName} required />
                <TextInput label="Other Names" value={otherNames} setValue={setOtherNames} />

                <SelectInput label="Gender *" value={gender} setValue={setGender} options={["Male", "Female", "Other"]} />
                <DateInput label="Date of Birth *" value={dateOfBirth} setValue={setDateOfBirth} />
                <TextInput label="Phone Number *" value={phoneNumber} setValue={setPhoneNumber} required />

                <div className="sm:col-span-2">
                  <TextInput label="Email Address *" value={email} setValue={setEmail} type="email" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Select Photo Avatar</label>
                  <div className="flex gap-1 items-center bg-slate-50 p-1 rounded-lg border border-slate-200">
                    {photoUrl ? (
                      <img src={photoUrl} alt="avatar" className="w-7 h-7 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0"></div>
                    )}

                    <select
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="p-1 w-full border-none bg-transparent text-[10px] focus:ring-0"
                    >
                      {profilePics.map((p, idx) => (
                        <option key={p} value={p}>
                          Avatar Profile #{idx + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Residential Address *</label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <SectionTitle title="2. Corporate Position & Bank Registry" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DateInput label="Date Employed *" value={dateEmployed} setValue={setDateEmployed} />

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Department Assigned *</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <TextInput label="Position / Title *" value={position} setValue={setPosition} required />
                <SelectInput label="Employment Type *" value={employmentType} setValue={setEmploymentType} options={["Full-Time", "Part-Time", "Contract", "Temporary"]} />
                <TextInput label="SSNIT National ID *" value={ssnitNumber} setValue={setSsnitNumber} required />
                <TextInput label="Ghana Card (NIA Number)" value={ghanaCardNumber} setValue={setGhanaCardNumber} />
                <TextInput label="Transfer Bank *" value={bankName} setValue={setBankName} required />
                <TextInput label="Bank Account Number *" value={bankAccount} setValue={setBankAccount} required />
                <SelectInput label="Account Status *" value={status} setValue={setStatus} options={["Active", "Inactive"]} />
              </div>

              <SectionTitle title="3. Monthly Salary Rules & Allowances" />

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <div className="sm:col-span-2">
                  <NumberInput label="Basic Salary (GHS) *" value={basicSalary} setValue={setBasicSalary} required />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Base calculation rate for SSNIT and PAYE.
                  </p>
                </div>

                <div className="hidden sm:block sm:col-span-2"></div>

                <NumberInput label="Transport Allow." value={transportAllowance} setValue={setTransportAllowance} />
                <NumberInput label="Housing Allow." value={housingAllowance} setValue={setHousingAllowance} />
                <NumberInput label="Utility Allow." value={utilityAllowance} setValue={setUtilityAllowance} />
                <NumberInput label="Risk Allowance" value={riskAllowance} setValue={setRiskAllowance} />
                <NumberInput label="Other Allowances" value={otherAllowances} setValue={setOtherAllowances} />
                <NumberInput label="Other Deductions" value={otherDeductions} setValue={setOtherDeductions} danger />
              </div>
            </form>

            <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-mono">
                Form Serial: {editingEmployee ? editingEmployee.id : "Auto-generated"}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-white hover:bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded font-medium border border-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save size={14} />
                  {editingEmployee ? "Save Changes" : "Enroll Employee"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h4 className="text-xs uppercase tracking-wider font-extrabold text-indigo-900 border-b border-indigo-100 pb-2 mb-4">
      {title}
    </h4>
  );
}

function TextInput({ label, value, setValue, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
}

function DateInput({ label, value, setValue }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1">{label}</label>
      <input
        type="date"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
}

function SelectInput({ label, value, setValue, options }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberInput({ label, value, setValue, required = false, danger = false }) {
  return (
    <div>
      <label className={`block text-xs font-bold mb-1 ${danger ? "text-rose-800" : "text-slate-600"}`}>
        {label}
      </label>
      <input
        type="number"
        min={0}
        required={required}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className={`px-3 py-1.5 w-full border rounded-lg text-xs ${
          danger
            ? "border-rose-200 text-rose-700 bg-rose-50 font-bold"
            : "border-slate-200 bg-white"
        }`}
      />
    </div>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-800 border-b border-slate-200 pb-1.5 mb-3">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">{children}</div>
    </div>
  );
}

function Info({ label, value, full = false }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <span className="text-slate-400 font-medium">{label}:</span>
      <p className="text-slate-800 font-bold">{value || "-"}</p>
    </div>
  );
}

function Money({ label, value, large = false }) {
  return (
    <div>
      <span className="text-slate-400 font-medium">{label}:</span>
      <p className={`${large ? "text-lg font-bold" : "font-semibold"} text-slate-800`}>
        GH₵{Number(value || 0).toLocaleString("en-US")}
      </p>
    </div>
  );
}
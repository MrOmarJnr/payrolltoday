import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  FileSpreadsheet,
  Terminal,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";
import { usePager, Pager } from "./_shiftui";

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];

  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(today);
  const [clockIn, setClockIn] = useState("08:00");
  const [clockOut, setClockOut] = useState("17:00");
  const [status, setStatus] = useState("Present");

  const [showDeviceSim, setShowDeviceSim] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  const [customCsvInput, setCustomCsvInput] = useState(
`# Hikvision Device Punch Log Template
EMP-2026-0001,2026-06-15 07:34:22
EMP-2026-0001,2026-06-15 17:15:44`
  );

  const formatDate = (value) => {
    if (!value) return "";
    return String(value).split("T")[0];
  };

  const formatTime = (value) => {
    if (!value) return "";
    return String(value).substring(0, 5);
  };

  const mapLog = (log) => ({
    id: log.id,
    employeeId: log.employee_id,
    date: formatDate(log.attendance_date),
    clockIn: formatTime(log.clock_in),
    clockOut: formatTime(log.clock_out),
    status: log.status,
    hoursWorked: Number(log.hours_worked || 0),
    source: log.source,
  });

  const mapEmployee = (emp) => ({
    ...emp,
    firstName: emp.first_name,
    lastName: emp.last_name,
    photoUrl: emp.photo_url,
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const [attRes, empRes] = await Promise.all([
        api.get("/attendance"),
        api.get("/employees"),
      ]);

      if (attRes.data.success) {
        setAttendanceLogs(attRes.data.data.map(mapLog));
      }

      if (empRes.data.success) {
        setEmployees(empRes.data.data.map(mapEmployee));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateHours = (inTime, outTime, selectedStatus) => {
    if (selectedStatus === "Absent") return 0;
    if (!inTime || !outTime) return 0;

    const [inH, inM] = inTime.split(":").map(Number);
    const [outH, outM] = outTime.split(":").map(Number);

    let hours = outH - inH + (outM - inM) / 60;
    if (hours < 0) hours += 24;

    return Number(hours.toFixed(2));
  };

  const handleOpenCreateLog = () => {
    setEditingLog(null);
    setEmployeeId(employees[0]?.id || "");
    setDate(today);
    setClockIn("08:00");
    setClockOut("17:00");
    setStatus("Present");
    setIsModalOpen(true);
  };

  const handleOpenEditLog = (log) => {
    setEditingLog(log);
    setEmployeeId(log.employeeId);
    setDate(log.date);
    setClockIn(log.clockIn || "");
    setClockOut(log.clockOut || "");
    setStatus(log.status);
    setIsModalOpen(true);
  };

  const handleSaveLog = async (e) => {
    e.preventDefault();

    try {
      const hours = calculateHours(clockIn, clockOut, status);

      const payload = {
        id: editingLog ? editingLog.id : `ATT-${Date.now()}`,
        employee_id: employeeId,
        attendance_date: date,
        clock_in: status === "Absent" ? null : clockIn,
        clock_out: status === "Absent" ? null : clockOut || null,
        status,
        hours_worked: hours,
        source: "Manual",
      };

      if (editingLog) {
        await api.put(`/attendance/${editingLog.id}`, payload);
      } else {
        await api.post("/attendance", payload);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to save attendance log.");
    }
  };

  const handleDeleteAttendance = async (id) => {
    if (!confirm("Delete this attendance entry?")) return;

    try {
      await api.delete(`/attendance/${id}`);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete attendance log.");
    }
  };

  const handleParseBiometricLogs = async () => {
    try {
      setSyncFeedback(null);

      const lines = customCsvInput.split("\n");
      const punches = [];

      for (const line of lines) {
        const clean = line.trim();
        if (!clean || clean.startsWith("#")) continue;

        const parts = clean.split(",");
        if (parts.length < 2) continue;

        const empId = parts[0].trim();
        const punchDateTime = parts[1].trim();

        const employeeExists = employees.some((e) => e.id === empId);
        if (!employeeExists) continue;

        const [pDate, pTimeFull] = punchDateTime.split(" ");
        if (!pDate || !pTimeFull) continue;

        punches.push({
          empId,
          date: pDate,
          time: pTimeFull.substring(0, 5),
        });
      }

      if (punches.length === 0) {
        setSyncFeedback("Error: No valid punch records found.");
        return;
      }

      const grouped = {};

      punches.forEach((p) => {
        const key = `${p.empId}_${p.date}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(p.time);
      });

      let created = 0;

      for (const key of Object.keys(grouped)) {
        const [empId, pDate] = key.split("_");
        const times = grouped[key].sort();

        const firstPunch = times[0];
        const lastPunch = times.length > 1 ? times[times.length - 1] : null;

        let statusResult = "Present";

        const [inH, inM] = firstPunch.split(":").map(Number);
        const actualMinutes = inH * 60 + inM;
        const thresholdMinutes = 8 * 60 + 5;

        if (actualMinutes > thresholdMinutes) {
          statusResult = "Late";
        }

        const hours = calculateHours(firstPunch, lastPunch, statusResult);

        await api.post("/attendance", {
          id: `ATT-HIK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          employee_id: empId,
          attendance_date: pDate,
          clock_in: firstPunch,
          clock_out: lastPunch,
          status: statusResult,
          hours_worked: hours || 4,
          source: "Hikvision",
        });

        created++;
      }

      setSyncFeedback(
        `Successfully processed ${punches.length} punch rows. Generated ${created} attendance logs.`
      );

      await loadData();
    } catch (error) {
      console.error(error);
      setSyncFeedback("Error: Failed to process biometric logs.");
    }
  };

  const filteredLogs = attendanceLogs
    .filter((log) => {
      const emp = employees.find((e) => e.id === log.employeeId);
      if (!emp) return false;

      const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.id} ${emp.position}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesDate = dateFilter === "" || log.date === dateFilter;
      const matchesStatus = statusFilter === "" || log.status === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const logPager = usePager(filteredLogs, 10);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
        Loading attendance logs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Attendance Logs
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Record daily office check-ins
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
        

          <button
            onClick={handleOpenCreateLog}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded font-medium flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            Manual Clock Item
          </button>
        </div>
      </div>

     

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            aria-label="Search by ID or employee name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded text-xs outline-none"
          />
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded text-xs text-slate-700 bg-white"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded text-xs bg-white text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Late">Late</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm font-semibold">No attendance records found</p>
            <p className="text-xs mt-1">
              Select a different date or import biometric logs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Clock In</th>
                  <th className="px-6 py-3.5">Clock Out</th>
                  <th className="px-6 py-3.5">Total Hours</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Source</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {logPager.slice.map((log) => {
                  const emp = employees.find((e) => e.id === log.employeeId);
                  if (!emp) return null;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {emp.photoUrl ? (
                            <img
                              src={emp.photoUrl}
                              alt={emp.lastName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center">
                              {emp.firstName?.[0]}
                              {emp.lastName?.[0]}
                            </div>
                          )}

                          <div>
                            <p className="font-bold text-slate-800">
                              {emp.lastName} {emp.firstName}
                            </p>
                            <p className="text-slate-400 text-[10px] font-mono">
                              {emp.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 font-semibold text-xs">
                        {log.date}
                      </td>

                      <td className="px-6 py-3.5 font-mono text-xs text-slate-700">
                        {log.clockIn || "--:--"}
                      </td>

                      <td className="px-6 py-3.5 font-mono text-xs text-slate-700">
                        {log.clockOut || "--:--"}
                      </td>

                      <td className="px-6 py-3.5">
                        <span className="font-bold text-slate-800">
                          {log.hoursWorked > 0 ? `${log.hoursWorked} hrs` : "-"}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                            log.status === "Present"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : log.status === "Late"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            log.source === "Hikvision"
                              ? "bg-teal-50 text-teal-700 border border-teal-100"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {log.source}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditLog(log)}
                            className="p-1 text-slate-600 hover:bg-slate-100 rounded-md"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            onClick={() => handleDeleteAttendance(log.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-md"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-3">
              <Pager page={logPager.page} pages={logPager.pages} setPage={logPager.setPage} total={logPager.total} perPage={logPager.perPage} />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-3xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-2xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-5 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {editingLog ? "Edit Ledger Log" : "Create Manual Attendance"}
                </h3>
                <p className="text-slate-400 text-[10px]">
                  Log daily working shifts for payroll tracking.
                </p>
              </div>

              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLog}>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Select Employee *
                  </label>
                  <select
                    disabled={!!editingLog}
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-700 disabled:bg-slate-50"
                    required
                  >
                    {employees
                      .filter((e) => e.status === "Active")
                      .map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.lastName} {emp.firstName} ({emp.id})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Shift Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Attendance Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                {status !== "Absent" && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Check In *
                      </label>
                      <input
                        type="time"
                        required
                        value={clockIn}
                        onChange={(e) => setClockIn(e.target.value)}
                        className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Check Out
                      </label>
                      <input
                        type="time"
                        value={clockOut}
                        onChange={(e) => setClockOut(e.target.value)}
                        className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white hover:bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded font-medium"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
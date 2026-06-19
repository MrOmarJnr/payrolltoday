import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
  Users,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  Cake,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDateStr = new Date()
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        employeesRes,
        departmentsRes,
        attendanceRes,
        payrollRes,
      ] = await Promise.all([
        api.get("/employees"),
        api.get("/departments"),
        api.get("/attendance"),
        api.get("/payroll"),
      ]);

      setEmployees(employeesRes.data.data || []);
      setDepartments(departmentsRes.data.data || []);
      setAttendanceLogs(attendanceRes.data.data || []);
      setPayrollRuns(payrollRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Stats calculation

  const totalEmployees = employees.length;

  const activeEmployeesNum = employees.filter(
    (e) => e.status === "Active"
  ).length;

  const todayLogs = attendanceLogs.filter(
    (log) =>
      String(log.attendance_date).substring(0, 10) ===
      currentDateStr
  );

  const presentTodayNum = todayLogs.filter(
    (l) =>
      l.status === "Present" ||
      l.status === "Late"
  ).length;

  const absentTodayNum = todayLogs.filter(
    (l) => l.status === "Absent"
  ).length;

  const activeEmployees = employees.filter(
    (e) => e.status === "Active"
  );

  const loggedEmployeeIds = new Set(
    todayLogs.map((l) => l.employee_id)
  );

  const unloggedActiveNum =
    activeEmployees.filter(
      (e) => !loggedEmployeeIds.has(e.id)
    ).length;

  const consolidatedAbsentNum =
    absentTodayNum + unloggedActiveNum;

  // Payroll

  const latestPayrollRun =
    payrollRuns.length > 0
      ? payrollRuns[payrollRuns.length - 1]
      : null;

  const lastMonthCost = latestPayrollRun
    ? Number(
        latestPayrollRun.total_net_salary
      )
    : 0;

  const lastMonthGross = latestPayrollRun
    ? Number(
        latestPayrollRun.total_gross_salary
      )
    : 0;

  const ssnitLiability = latestPayrollRun
    ? Number(
        latestPayrollRun.total_ssnit_employee
      ) +
      Number(
        latestPayrollRun.total_ssnit_employer
      )
    : 0;

  // Birthdays

  const upcomingBirthdays = employees
    .filter((emp) => {
      if (!emp.date_of_birth) return false;

      const dobMonth =
        emp.date_of_birth.split("-")[1];

      return (
        dobMonth === "06" ||
        dobMonth === "07"
      );
    })
    .map((emp) => {
      const parts =
        emp.date_of_birth.split("-");

      return {
        id: emp.id,
        fullName: `${emp.first_name} ${emp.last_name}`,
        department:
          departments.find(
            (d) =>
              d.id === emp.department_id
          )?.name || "",
        birthDate: `${parts[2]}/${parts[1]}`,
        day: parseInt(parts[2], 10),
        month: parseInt(parts[1], 10),
      };
    })
    .sort((a, b) => {
      if (a.month !== b.month)
        return a.month - b.month;

      return a.day - b.day;
    });

  // Recent Attendance

  const recentClockIns = todayLogs
    .filter((log) => log.clock_in)
    .map((log) => {
      const emp = employees.find(
        (e) => e.id === log.employee_id
      );

      return {
        id: log.id,
        employeeName: emp
          ? `${emp.last_name} ${emp.first_name}`
          : "Unknown Employee",

        position: emp?.position || "",

        clockIn: log.clock_in,
        clockOut: log.clock_out,
        status: log.status,
        source: log.source,
      };
    })
    .slice(0, 5);

  // Department Stats

  const deptStats = departments
    .map((dept) => {
      const count = employees.filter(
        (e) =>
          e.department_id === dept.id
      ).length;

      return {
        name: dept.name,
        code: dept.code,
        count,
      };
    })
    .filter((d) => d.count > 0);

  const maxDeptCount = Math.max(
    ...deptStats.map((d) => d.count),
    1
  );

  const onNavigateToTab = (tab) => {
    console.log("Navigate:", tab);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Dashboard</h1>
          <p className="text-slate-500 text-xs mt-1">
           Welcome to the LEF Payroll & Attendance system. Current ledger date:
            <span className="font-semibold text-slate-800">
            {" "}
            {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
            </span>
.
          </p>
        </div>
        
      </div>

      {/* Grid Stats Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Staff */}
        <div 
          onClick={() => onNavigateToTab('employees')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden group"
          id="stat-employees"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Headcount</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-2 tracking-tight">{totalEmployees}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500 gap-1.5">
            <span className="font-medium text-slate-700">{activeEmployeesNum}</span> Active, 
            <span className="font-medium text-slate-400">{totalEmployees - activeEmployeesNum}</span> Inactive
          </div>
        </div>

        {/* Present Today */}
        <div 
          onClick={() => onNavigateToTab('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden group"
          id="stat-attendance-present"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Present Today</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-2 tracking-tight">{presentTodayNum}</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500 gap-1">
            <span>Attendance Today </span>
          </div>
        </div>

        {/* Absent Today */}
        <div 
          onClick={() => onNavigateToTab('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden group"
          id="stat-attendance-absent"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Absent Today</p>
              <h3 className="text-2xl font-extrabold text-rose-600 mt-2 tracking-tight">{consolidatedAbsentNum}</h3>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded">
              <XCircle size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-rose-500 font-medium">
            <AlertCircle size={12} className="mr-1" />
            Requires manual verification/call
          </div>
        </div>

        {/* Current Monthly Payroll Cost */}
        <div 
          onClick={() => onNavigateToTab('payroll')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden group"
          id="stat-payroll-cost"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Latest Net payroll</p>
              <h3 className="text-xl font-extrabold text-slate-800 mt-2 tracking-tight">GH₵{lastMonthCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500 gap-1">
            <span>Gross: GH₵{lastMonthGross.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            <span className="text-slate-300">|</span>
            <span className="text-amber-700 font-semibold">Ssnit: GH₵{ssnitLiability.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time clocks / today activity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Today's Attendance Logs</h4>
              <p className="text-slate-400 text-xs">Recent Clock activities captured via system and device imports</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('attendance')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline"
            >
              Manage Logs <Clock size={12} />
            </button>
          </div>

          {todayLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Clock size={36} className="text-slate-300 mb-2" />
              <p className="text-slate-500 text-sm font-medium">No biometric punch files imported today</p>
             
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-medium">
                    <th className="pb-3 text-slate-500">Employee</th>
                    <th className="pb-3 text-slate-500">Clock In</th>
                    <th className="pb-3 text-slate-500">Clock Out</th>
                    <th className="pb-3 text-slate-500">Status</th>
                    <th className="pb-3 text-slate-500 text-right">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentClockIns.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3">
                        <div>
                          <p className="font-semibold text-slate-800">{log.employeeName}</p>
                          <p className="text-xs text-slate-400">{log.position}</p>
                        </div>
                      </td>
                      <td className="py-3 text-slate-700 font-mono text-xs">{log.clockIn || '--:--'}</td>
                      <td className="py-3 text-slate-700 font-mono text-xs">
                        {log.clockOut ? (
                          log.clockOut
                        ) : (
                          <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide text-[10px] animate-pulse">
                            On-duty
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider ${
                          log.status === 'Present' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : log.status === 'Late'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          log.source === 'Hikvision' 
                            ? 'bg-teal-50 text-teal-700 font-semibold' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {log.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Department Headcounts dynamic bar chart */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h5 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-4">Departmental Staff Breakdown</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deptStats.map((dept) => {
                const percentage = Math.round((dept.count / totalEmployees) * 100);
                return (
                  <div key={dept.code} className="bg-slate-50 p-3 rounded border border-slate-200">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-slate-700">{dept.name} ({dept.code})</span>
                      <span className="font-medium text-slate-500">{dept.count} Staff ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(dept.count / maxDeptCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Info Panels: Upcoming Birthdays & General System Info */}
        <div className="space-y-6">
          {/* Birthdays Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Cake size={16} className="text-blue-600" />
              Staff Birthdays
            </h4>
            
            {upcomingBirthdays.length === 0 ? (
              <p className="text-slate-400 text-xs py-4 text-center">No staff birthdays.</p>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {upcomingBirthdays.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex flex-col items-center justify-center font-bold text-[10px] uppercase border border-blue-100 tracking-tighter shrink-0">
                      <span>{item.birthDate.split('/')[0]}</span>
                      <span className="text-[8px] font-medium text-blue-400">
                        {item.birthDate.split('/')[1] === '06' ? 'Jun' : 'Jul'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

         
        </div>

      </div>
    </div>
  );
}

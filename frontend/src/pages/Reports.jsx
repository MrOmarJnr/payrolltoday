
import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Download,
  Printer,
  Users,
  Building2,
  Clock,
  Calendar,
  Eye,
  TrendingUp,
  Heart,
  FileSpreadsheet,
  DollarSign
} from "lucide-react";

export default function Reports() 
{
const [selectedReportTab, setSelectedReportTab] = useState("payroll");
  const [loading, setLoading] = useState(true);

const [payrollRuns, setPayrollRuns] = useState([]);
const [employees, setEmployees] = useState([]);
const [departments, setDepartments] = useState([]);
const [attendanceLogs, setAttendanceLogs] = useState([]);

useEffect(() => {
  loadReports();
}, []);

const loadReports = async () => {
  try {
    const res = await api.get("/reports");

    const employeesMapped = (res.data.employees || []).map(
      (e) => ({
        ...e,
        firstName: e.first_name,
        lastName: e.last_name,
        photoUrl: e.photo_url,
        departmentId: e.department_id,
        bankName: e.bank_name,
        bankAccount: e.bank_account,
        ssnitNumber: e.ssnit_number,
      })
    );

    const attendanceMapped = (
      res.data.attendanceLogs || []
    ).map((a) => ({
      employeeId: a.employee_id,
      date: a.attendance_date,
      status: a.status,
      hoursWorked: Number(a.hours_worked),
    }));

    const payrollMapped = (
      res.data.payrollRuns || []
    ).map((run) => ({
      ...run,

      periodMonth: run.period_month,

      totalBasicSalary: Number(
        run.total_basic_salary || 0
      ),

      totalSsnitEmployee: Number(
        run.total_ssnit_employee || 0
      ),

      totalSsnitEmployer: Number(
        run.total_ssnit_employer || 0
      ),

      totalPaye: Number(run.total_paye || 0),

      totalDeductions: Number(
        run.total_deductions || 0
      ),

      totalNetSalary: Number(
        run.total_net_salary || 0
      ),

      items: (run.items || []).map((item) => ({
        ...item,

        employeeId: item.employee_id,
        employeeName: item.employee_name,
        departmentName: item.department_name,

        basicSalary: Number(item.basic_salary || 0),
        transportAllowance: Number(
          item.transport_allowance || 0
        ),
        housingAllowance: Number(
          item.housing_allowance || 0
        ),
        utilityAllowance: Number(
          item.utility_allowance || 0
        ),
        riskAllowance: Number(
          item.risk_allowance || 0
        ),
        otherAllowances: Number(
          item.other_allowances || 0
        ),

        grossSalary: Number(item.gross_salary || 0),

        employeeSsnit: Number(
          item.employee_ssnit || 0
        ),

        paye: Number(item.paye || 0),

        otherDeductions: Number(
          item.other_deductions || 0
        ),

        netSalary: Number(item.net_salary || 0),

        employerSsnit: Number(
          item.employer_ssnit || 0
        ),
      })),
    }));

    setEmployees(employeesMapped);
    if (employeesMapped.length > 0) {
  setTargetEmpId(employeesMapped[0].id);
}
    setAttendanceLogs(attendanceMapped);
    setPayrollRuns(payrollMapped);
    setDepartments(res.data.departments || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  
  // Custom states for reports
const [targetEmpId, setTargetEmpId] = useState("");
  const [targetMonth, setTargetMonth] = useState('2026-05');

  // Utility to compile and download Excel/CSV records truly
const triggerCSVDownload = (headers, rows, filename) => {
    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      const cleanRow = row.map((val) => {
        const str = String(val);
        // Escape quotes
        return `"${str.replace(/"/g, '""')}"`;
      });
      csvContent += cleanRow.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= REPORT 1: PAYROLL SUMMARY EXCEL =================
  const currentRun = payrollRuns.find((run) => run.periodMonth === targetMonth);
  
  const handleExportPayrollSummary = () => {
    if (!currentRun) return;
    const headers = [
      'Employee ID', 'Employee Name', 'Department', 'Basic Salary (GHS)', 
      'Allowances (GHS)', 'Gross Salary (GHS)', 'Employee SSNIT (5.5%)', 
      'PAYE GRA Tax (GHS)', 'Deductions (GHS)', 'Net Salary (GHS)', 'Employer SSNIT (13%)'
    ];
    const rows = currentRun.items.map((item) => {
      const allAllowances = item.transportAllowance + item.housingAllowance + item.utilityAllowance + item.riskAllowance + item.otherAllowances;
      return [
        item.employeeId,
        item.employeeName,
        item.departmentName,
        item.basicSalary,
        allAllowances,
        item.grossSalary,
        item.employeeSsnit,
        item.paye,
        item.otherDeductions,
        item.netSalary,
        item.employerSsnit
      ];
    });

    triggerCSVDownload(headers, rows, `LEF_Payroll_Summary_${targetMonth}`);
  };

  // ================= REPORT 2: DEPARTMENT BREAKDOWN =================
  const departmentCosts = departments.map((dept) => {
    let totalBasic = 0;
    let totalGross = 0;
    let totalNet = 0;
    let staffCount = 0;

    // Sum using latest run
    const latestRun = payrollRuns[payrollRuns.length - 1];
    if (latestRun) {
      latestRun.items.forEach((item) => {
        const emp = employees.find((e) => e.id === item.employeeId);
        if (emp?.departmentId === dept.id) {
          totalBasic += item.basicSalary;
          totalGross += item.grossSalary;
          totalNet += item.netSalary;
          staffCount++;
        }
      });
    }

    return {
      deptId: dept.id,
      deptName: dept.name,
      code: dept.code,
      totalBasic,
      totalGross,
      totalNet,
      staffCount,
    };
  }).filter((d) => d.staffCount > 0);

  const handleExportDeptCosts = () => {
    const headers = ['Dept Budget Code', 'Department Name', 'Employee Headcount', 'Total Basic Cost (GHS)', 'Total Gross Cost (GHS)', 'Total Net Payout (GHS)'];
    const rows = departmentCosts.map((d) => [
      d.code, d.deptName, d.staffCount, d.totalBasic, d.totalGross, d.totalNet
    ]);
    triggerCSVDownload(headers, rows, `LEF_Department_Payroll_Report_June_2026`);
  };

  // ================= REPORT 3: EMPLOYEE LEDGER HISTORY =================
  const employeeHistory = payrollRuns.map((run) => {
    const item = run.items.find((it) => it.employeeId === targetEmpId);
    return {
      month: run.periodMonth,
      basic: item ? item.basicSalary : 0,
      gross: item ? item.grossSalary : 0,
      net: item ? item.netSalary : 0,
      paye: item ? item.paye : 0,
    };
  }).filter((h) => h.net > 0);

  const targetEmpObj = employees.find((e) => e.id === targetEmpId);

  const handleExportEmployeeHistory = () => {
    if (!targetEmpObj) return;
    const headers = ['Payroll Month', 'Base Salary (GHS)', 'Gross Earnings (GHS)', 'PAYE Paid (GHS)', 'Net Salary Transferred (GHS)'];
    const rows = employeeHistory.map((h) => [
      h.month, h.basic, h.gross, h.paye, h.net
    ]);
    triggerCSVDownload(headers, rows, `LEF_Employee_Ledger_History_${targetEmpObj.lastName}_${targetEmpObj.firstName}`);
  };

  // ================= REPORT 4: MONTHLY ATTENDANCE AUDIT =================
  const attendanceRegistry = employees.map((emp) => {
    // Audit for selected month June 2026 logs
    const empLogs = attendanceLogs.filter(
      (l) => l.employeeId === emp.id && l.date.substring(0, 7) === '2026-06'
    );
    const present = empLogs.filter((l) => l.status === 'Present').length;
    const lates = empLogs.filter((l) => l.status === 'Late').length;
    const absent = empLogs.filter((l) => l.status === 'Absent').length;
    const hours = empLogs.reduce((acc, curr) => acc + curr.hoursWorked, 0);

    return {
      id: emp.id,
      name: `${emp.lastName} ${emp.firstName}`,
      present,
      lates,
      absent,
      hours: Number(hours.toFixed(1)),
    };
  });

  const handleExportAttendanceAudit = () => {
    const headers = ['Employee ID', 'Employee Name', 'Present Days (June)', 'Late Counts', 'Absent Days', 'Total Hours Worked'];
    const rows = attendanceRegistry.map((a) => [
      a.id, a.name, a.present, a.lates, a.absent, a.hours
    ]);
    triggerCSVDownload(headers, rows, `LEF_Attendance_Audit_June_2026`);
  };

  if (loading) {
  return (
    <div className="bg-white rounded-xl p-8 text-center">
      Loading reports...
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* Upper header summary segment */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reports & Auditing</h2>
          <p className="text-slate-500 text-xs mt-0.5">Generate statutory financial indexes and log ledger summaries.</p>
        </div>

        {/* Tab switcher navigation */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedReportTab('payroll')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedReportTab === 'payroll' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Payroll Runs Summary
          </button>
          <button
            onClick={() => setSelectedReportTab('department')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedReportTab === 'department' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Department Costs
          </button>
          <button
            onClick={() => setSelectedReportTab('employee')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedReportTab === 'employee' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Employee Ledger Hist.
          </button>
          <button
            onClick={() => setSelectedReportTab('attendance')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedReportTab === 'attendance' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attendance Audits
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: PAYROLL SUMMARY IN-TABLE ================= */}
      {selectedReportTab === 'payroll' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Controls run selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-bold text-xs">Payroll Periods Archive:</span>
              <select
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 bg-white text-slate-700 text-xs rounded-lg font-bold focus:ring-1"
              >
                {payrollRuns.map((run) => (
                  <option key={run.id} value={run.periodMonth}>
                    {run.periodMonth} Run Ledger
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Printer size={13} />
                Print List
              </button>
              <button
                onClick={handleExportPayrollSummary}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer shadow-3xs"
              >
                <Download size={13} />
                Export to Excel (.CSV)
              </button>
            </div>
          </div>

          {currentRun ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase">
                      <th className="px-5 py-3">Employee Name</th>
                      <th className="px-5 py-3">Department</th>
                      <th className="px-5 py-3 text-right">Basic Salary</th>
                      <th className="px-5 py-3 text-right">SSNIT Employer</th>
                      <th className="px-5 py-3 text-right">SSNIT Employee</th>
                      <th className="px-5 py-3 text-right">PAYE Paid</th>
                      <th className="px-5 py-3 text-right">Other Deduct</th>
                      <th className="px-5 py-3 text-right font-bold text-slate-800 bg-slate-50">Net Pay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentRun.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 font-bold text-slate-800">{item.employeeName}</td>
                        <td className="px-5 py-3.5 text-slate-500">{item.departmentName}</td>
                        <td className="px-5 py-3.5 text-right text-slate-600">GH₵{item.basicSalary.toLocaleString('en-US')}</td>
                        <td className="px-5 py-3.5 text-right text-slate-500">GH₵{item.employerSsnit.toLocaleString('en-US')}</td>
                        <td className="px-5 py-3.5 text-right text-rose-500 font-semibold">-GH₵{item.employeeSsnit}</td>
                        <td className="px-5 py-3.5 text-right text-rose-600 font-semibold">-GH₵{item.paye.toLocaleString('en-US')}</td>
                        <td className="px-5 py-3.5 text-right text-rose-500 font-medium">-GH₵{item.otherDeductions}</td>
                        <td className="px-5 py-3.5 text-right font-extrabold text-emerald-600 bg-emerald-50/5 text-xs">
                          GH₵{item.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    {/* Totals summation Row */}
                    <tr className="bg-slate-50 font-extrabold font-mono text-slate-800">
                      <td className="px-5 py-4 text-left">GRAND TOTAL LEDGER:</td>
                      <td className="px-5 py-4"></td>
                      <td className="px-5 py-4 text-right">GH₵{currentRun.totalBasicSalary.toLocaleString('en-US')}</td>
                      <td className="px-5 py-4 text-right text-slate-600">GH₵{currentRun.totalSsnitEmployer.toLocaleString('en-US')}</td>
                      <td className="px-5 py-4 text-right text-rose-600">-GH₵{currentRun.totalSsnitEmployee.toLocaleString('en-US')}</td>
                      <td className="px-5 py-4 text-right text-rose-600">-GH₵{currentRun.totalPaye.toLocaleString('en-US')}</td>
                      <td className="px-5 py-4 text-right text-rose-600">-GH₵{currentRun.totalDeductions.toLocaleString('en-US')}</td>
                      <td className="px-5 py-4 text-right text-emerald-600 text-sm bg-emerald-50">
                        GH₵{currentRun.totalNetSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white border rounded-xl">
              No historical data exists for {targetMonth}.
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 2: DEPARTMENT COST INDEXES ================= */}
      {selectedReportTab === 'department' && (
        <div className="space-y-4 animate-fadeIn bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs">
          <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Department Wage Metrics (Last Processed Month)</h3>
              <p className="text-slate-400 text-xs">A snapshot of departmental cost allocations.</p>
            </div>
            <button
              onClick={handleExportDeptCosts}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
            >
              <Download size={13} />
              Export Costs List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Costs bar items */}
            <div className="space-y-4">
              {departmentCosts.map((d) => (
                <div key={d.deptId} className="bg-slate-50 p-4 rounded border border-slate-200">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-slate-800">{d.deptName}</span>
                    <span className="text-[11px] text-blue-600 font-semibold font-mono">GH₵{d.totalNet.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Headcount: {d.staffCount}</span>
                    <span>Gross Wages: GH₵{d.totalGross.toLocaleString('en-US')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* General informational table */}
            <div className="border border-slate-200/75 rounded-2xl overflow-hidden self-start">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 font-bold text-slate-500 uppercase border-b border-slate-200">
                    <th className="p-3">Department</th>
                    <th className="p-3 text-right">Headcount</th>
                    <th className="p-3 text-right">Net Compensation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departmentCosts.map((d) => (
                    <tr key={d.deptId} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-800">{d.deptName}</td>
                      <td className="p-3 text-right text-slate-600 font-bold">{d.staffCount}</td>
                      <td className="p-3 text-right font-extrabold text-slate-800">GH₵{d.totalNet.toLocaleString('en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: INDIVIDUAL EMPLOYEE LEDGER HISTORY ================= */}
      {selectedReportTab === 'employee' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Controls employee selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-bold text-xs">Choose Employee Record:</span>
              <select
                value={targetEmpId}
                onChange={(e) => setTargetEmpId(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 bg-white text-slate-700 text-xs rounded-lg font-bold"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.lastName} {emp.firstName} ({emp.id})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportEmployeeHistory}
              disabled={employeeHistory.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs disabled:opacity-40"
            >
              <Download size={13} />
              Export employee History (.CSV)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Mini avatar card info */}
            {targetEmpObj && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs text-center space-y-3">
                {targetEmpObj.photoUrl ? (
                  <img
                    src={targetEmpObj.photoUrl}
                    alt={targetEmpObj.lastName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-full object-cover border mx-auto"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-500 font-bold text-lg flex items-center justify-center mx-auto">
                    {targetEmpObj.firstName[0]}
                    {targetEmpObj.lastName[0]}
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {targetEmpObj.lastName} {targetEmpObj.firstName}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{targetEmpObj.position} • {targetEmpObj.id}</p>
                </div>
                <div className="border-t border-slate-100 pt-3 text-xs text-left text-slate-500 space-y-1">
                  <p>Bank: {targetEmpObj.bankName}</p>
                  <p>A/C Number: {targetEmpObj.bankAccount}</p>
                  <p>SSNIT ID: {targetEmpObj.ssnitNumber}</p>
                </div>
              </div>
            )}

            {/* History Table listing */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden md:col-span-2">
              {employeeHistory.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  No payout entries processed in system.
                </div>
              ) : (
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-extrabold uppercase uppercase">
                      <th className="p-3 px-5">Payroll Month</th>
                      <th className="p-3 px-5 text-right">Base salary</th>
                      <th className="p-3 px-5 text-right">Gross earnings</th>
                      <th className="p-3 px-5 text-right text-rose-500">PAYE Taxed</th>
                      <th className="p-3 px-5 text-right font-bold text-slate-800 bg-slate-50">Net Pay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employeeHistory.map((h, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 px-5 font-bold text-slate-700">{h.month}</td>
                        <td className="p-3 px-5 text-right text-slate-600">GH₵{h.basic.toLocaleString('en-US')}</td>
                        <td className="p-3 px-5 text-right text-slate-600">GH₵{h.gross.toLocaleString('en-US')}</td>
                        <td className="p-3 px-5 text-right text-rose-500 font-medium">-GH₵{h.paye}</td>
                        <td className="p-3 px-5 text-right font-extrabold text-emerald-600 bg-emerald-50/5">
                          GH₵{h.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 4: ATTENDANCE LEDGER AUDIT JUNE 2026 ================= */}
      {selectedReportTab === 'attendance' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header trigger excel download */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Biometric Attendance Audit ledger</h3>
              <p className="text-slate-400 text-xs mt-0.5">Summary of total days clocked & total hours logged in June 2026.</p>
            </div>
            <button
              onClick={handleExportAttendanceAudit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
            >
              <Download size={13} />
              Export Audit (.CSV)
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase">
                  <th className="px-6 py-3.5">Employee Name</th>
                  <th className="px-6 py-3.5">Present Days</th>
                  <th className="px-6 py-3.5">Late Entries</th>
                  <th className="px-6 py-3.5">Absent Days</th>
                  <th className="px-6 py-3.5 font-bold text-slate-800">Cumu. Hours Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceRegistry.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/55">
                    <td className="px-6 py-3.5">
                      <div>
                        <p className="font-bold text-slate-800">{a.name}</p>
                        <p className="text-[10px] text-slate-400">{a.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-slate-700 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">
                        {a.present} Days
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`font-semibold px-2 py-0.5 rounded ${
                        a.lates > 0 ? 'bg-amber-50 text-amber-800 border border-amber-100' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {a.lates} Late(s)
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-rose-600 font-semibold">{a.absent} Day(s) absent</td>
                    <td className="px-6 py-3.5 font-extrabold text-slate-850 font-mono text-xs">{a.hours} Hrs logged</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

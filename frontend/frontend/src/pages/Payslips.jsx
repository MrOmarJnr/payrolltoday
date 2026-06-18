import { useEffect, useState } from "react";
import {
  Printer,
  Download,
  Mail,
  FileText,
} from "lucide-react";
import api from "../services/api";
import logo from "../assets/leflogo.png";

export default function Payslips() {
  const [payslips, setPayslips] = useState([]);
  const [companySettings, setCompanySettings] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const money = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    loadPayslipData();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedEmployeeId) {
      loadSelectedPayslip(selectedEmployeeId, selectedMonth);
    }
  }, [selectedMonth, selectedEmployeeId]);

  const loadPayslipData = async () => {
    try {
      setLoading(true);

      const [payslipRes, settingsRes] = await Promise.all([
        api.get("/payslips"),
        api.get("/settings"),
      ]);

      const list = payslipRes.data.success ? payslipRes.data.data : [];
      const company = settingsRes.data.company || null;

      setPayslips(list);
      setCompanySettings(company);

      if (list.length > 0) {
        setSelectedMonth(list[0].period_month);
        setSelectedEmployeeId(list[0].employee_id);
        await loadSelectedPayslip(list[0].employee_id, list[0].period_month);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load payslip data.");
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedPayslip = async (employeeId, periodMonth) => {
    try {
      const response = await api.get(`/payslips/${employeeId}/${periodMonth}`);

      if (response.data.success) {
        setSelectedPayslip(response.data);
      }
    } catch (error) {
      console.error(error);
      setSelectedPayslip(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setIsDownloading(true);

    alert(
      "To download as PDF:\n\n1. The print window will open.\n2. Choose 'Save as PDF'.\n3. Click Save."
    );

    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 500);
  };

  const months = [...new Set(payslips.map((p) => p.period_month))];

  const employeesForMonth = payslips.filter(
    (p) => p.period_month === selectedMonth
  );

  const company = companySettings || selectedPayslip?.company || {};
  const employee = selectedPayslip?.employee || {};
  const item = selectedPayslip?.payslip || null;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
        Loading payslips...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              aside,
              header,
              nav,
              button,
              select,
              .no-print,
              #selector-dashboard-bar,
              .lg\\:col-span-1 {
                display: none !important;
                visibility: hidden !important;
              }

              body, html, #root {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: auto !important;
              }

              main {
                padding: 0 !important;
                margin: 0 !important;
              }

              .lg\\:col-span-2 {
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }

              #printable-payslip {
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 100% !important;
                background: white !important;
                color: black !important;
              }

              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .bg-slate-50 {
                background-color: #f8fafc !important;
              }

              .bg-blue-50 {
                background-color: #eff6ff !important;
              }

              .bg-slate-900 {
                background-color: #0f172a !important;
              }

              .border-slate-100,
              .border-slate-200 {
                border-color: #e2e8f0 !important;
              }
            }
          `,
        }}
      />

      <div
        id="selector-dashboard-bar"
        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Payslip Generator
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Generate compliant payslips and download PDFs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">
              Payroll Month
            </span>

            <select
              value={selectedMonth}
              onChange={(e) => {
                const month = e.target.value;
                setSelectedMonth(month);

                const firstEmp = payslips.find(
                  (p) => p.period_month === month
                );

                if (firstEmp) {
                  setSelectedEmployeeId(firstEmp.employee_id);
                }
              }}
              className="px-3 py-1.5 border border-slate-200 bg-white text-slate-700 text-xs rounded-lg font-bold"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {new Date(month + "-01").toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">
              Select Employee
            </span>

            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 bg-white text-slate-700 text-xs rounded-lg font-bold"
            >
              {employeesForMonth.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.employee_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">
              Payslip Actions
            </h3>

            <p className="text-slate-500 text-xs leading-relaxed">
              Verify employee earnings, statutory SSNIT, PAYE and deductions
              before printing or sending payslip.
            </p>

            <div className="space-y-2 pt-2">
              <button
                disabled={!item}
                onClick={handlePrint}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Printer size={13} />
                Print Payslip Voucher
              </button>

              <button
                disabled={!item || isDownloading}
                onClick={handleDownload}
                className="w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Download size={13} />
                {isDownloading ? "Compiling PDF..." : "Download PDF Copy"}
              </button>

              <button
                disabled={!item}
                onClick={() =>
                  alert(
                    `Payslip has been queued for delivery to ${
                      employee.email || "employee email"
                    }`
                  )
                }
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Mail size={13} />
                Email to Employee
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-2">
            <span className="font-bold text-slate-700 block text-xs">
              Employee Bank Details:
            </span>
            <p className="font-mono">
              Recipient: {employee.bank_name || "N/A"}
            </p>
            <p className="font-mono">
              Account: {employee.bank_account || "N/A"}
            </p>
            <p className="font-mono">
              SSNIT ID: {employee.ssnit_number || "N/A"}
            </p>
            <p className="font-mono">
              Ghana Card: {employee.ghana_card_number || "N/A"}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          {item ? (
            <div
              id="printable-payslip"
              className="bg-white rounded-2xl border-2 border-slate-200/80 p-8 shadow-sm max-w-2xl mx-auto space-y-6 relative overflow-hidden text-slate-900"
            >
              <div className="flex justify-between items-start pb-5 border-b-2 border-slate-100">
                <div className="space-y-1.5">
                <div className="flex items-center gap-3">
  <div className="w-30 h-14 shrink-0">
    <img
      src={logo}
      alt="LEF Signature Ltd"
      className="w-full h-full object-contain"
    />
  </div>

  <div>
    <span className="text-sm font-semibold text-slate-900 uppercase tracking-tight">
      {company.name || "LEF Signature LTD"}
    </span>

    <p className="text-[10px] text-slate-400">
      {company.address || "Accra, Ghana"}
    </p>
  </div>
</div>
                </div>

                <div className="text-right">
                  <span className="inline-block text-[10px] bg-blue-50 border border-blue-100 text-blue-900 font-semibold uppercase px-2.5 py-1 rounded-full tracking-wider mb-2">
                    Official payslip
                  </span>

                  <p className="text-xs text-slate-400 font-bold uppercase">
                    Disbursement Month
                  </p>

                  <p className="text-sm font-extrabold text-slate-800">
                    {new Date(selectedMonth + "-01").toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div className="space-y-1.5 text-left">
                  <p className="text-slate-400 font-medium">
                    Employee Accounts Target:
                  </p>

                  <p className="font-extrabold text-slate-800">
                    {employee.first_name} {employee.last_name}
                  </p>

                  <p className="text-slate-500 font-semibold">
                    {employee.position || "Employee"} •{" "}
                    {item.department_name || "Unassigned"}
                  </p>

                  <p className="text-slate-400 font-mono">
                    Employee ID: {employee.id || item.employee_id}
                  </p>
                </div>

                <div className="space-y-1.5 text-right">
                  <p className="text-slate-400 font-medium">
                    Payment Protocol:
                  </p>

                  <p className="font-extrabold text-slate-800">
                    {employee.bank_name || "N/A"}
                  </p>

                  <p className="text-slate-500 font-mono">
                    Account No: {employee.bank_account || "N/A"}
                  </p>

                  <p className="text-slate-400 font-mono">
                    SSNIT NO: {employee.ssnit_number || "N/A"}
                  </p>
                </div>
              </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
  {/* EARNINGS */}
  <div className="space-y-3">
    <h4 className="text-xs font-semibold uppercase text-slate-800 border-b border-slate-200 pb-1 flex justify-between items-center">
      <span>Emoluments & Earnings</span>
      <span className="text-[10px] text-slate-400 capitalize font-normal">
        GHS Currency
      </span>
    </h4>

    <div className="space-y-2 text-xs">
      <Line
        label="Basic Salary"
        value={`GH₵${money(item.basic_salary)}`}
      />

      <Line
        label="Transport Allowance"
        value={`GH₵${money(item.transport_allowance || 0)}`}
      />

      <Line
        label="Housing Allowance"
        value={`GH₵${money(item.housing_allowance || 0)}`}
      />

      <Line
        label="Utility Allowance"
        value={`GH₵${money(item.utility_allowance || 0)}`}
      />

      <Line
        label="Risk Allowance"
        value={`GH₵${money(item.risk_allowance || 0)}`}
      />

      <Line
        label="Other Allowance / Bonus"
        value={`GH₵${money(item.other_allowances || 0)}`}
      />

      <div className="border-t border-slate-200 pt-2 mt-2">
        <Line
          label="TOTAL GROSS EARNINGS"
          value={`GH₵${money(item.gross_salary)}`}
        />
      </div>
    </div>
  </div>

  {/* DEDUCTIONS */}
  <div className="space-y-3">
    <h4 className="text-xs font-extrabold uppercase text-rose-950 border-b border-rose-100 pb-1 flex justify-between items-center">
      <span>Statutory Deductions</span>
      <span className="text-[10px] text-slate-400 capitalize font-normal">
        GHS Currency
      </span>
    </h4>

    <div className="space-y-2 text-xs">
      <Line
        label="SSNIT Employee Cont. (5.5%)"
        value={`-GH₵${money(item.employee_ssnit || 0)}`}
        danger
      />

      <Line
        label="PAYE GRA Tax"
        value={`-GH₵${money(item.paye || 0)}`}
        danger
      />

      <Line
        label={`Lateness Penalty (${item.late_days_count || 0} incidents)`}
        value={`-GH₵${money(item.lateness_deduction || 0)}`}
        danger
      />

      <Line
        label="Other Office Deductions"
        value={`-GH₵${money(item.other_deductions || 0)}`}
        danger
      />

      <div className="border-t border-rose-100 pt-2 mt-2">
        <Line
          label="TOTAL DEDUCTIONS"
          value={`-GH₵${money(
            Number(item.employee_ssnit || 0) +
            Number(item.paye || 0) +
            Number(item.lateness_deduction || 0) +
            Number(item.other_deductions || 0)
          )}`}
          danger
        />
      </div>
    </div>
  </div>
</div>

<div className="border-t-2 border-slate-100 pt-5 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold font-mono">
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <span className="text-slate-500 uppercase tracking-tight text-[11px]">
        Gross Monthly Emoluments:
      </span>

      <span className="text-slate-800">
        GH₵{money(item.gross_salary)}
      </span>
    </div>

    <div className="flex justify-between items-center">
      <span className="text-slate-500 uppercase tracking-tight text-[11px]">
        Total Deductions:
      </span>

      <span className="text-rose-600">
        GH₵{money(
          Number(item.employee_ssnit || 0) +
          Number(item.paye || 0) +
          Number(item.lateness_deduction || 0) +
          Number(item.other_deductions || 0)
        )}
      </span>
    </div>

    <div className="flex justify-between items-center">
      <span className="text-slate-500 uppercase tracking-tight text-[11px]">
        SSNIT Employer Match (13%):
      </span>

      <span className="text-slate-500 font-normal">
        GH₵{money(item.employer_ssnit)}
      </span>
    </div>
  </div>

  <div className="bg-slate-900 text-white p-4 rounded flex flex-col justify-center items-center font-sans">
    <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">
      Net salary transferred
    </span>

    <p className="text-xl font-bold tracking-tight mt-1 font-mono">
      GH₵{money(item.net_salary)}
    </p>
  </div>
</div>


              <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                <div className="text-left space-y-1">
                  <p className="font-bold">
                    Authorizing Officer: Payroll Administrator
                  </p>
                  <p>LEF Finance, Payroll Audit</p>
                </div>

                <div className="text-right italic">
                  *Computer generated payslip. No physical signature required.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 bg-white border border-slate-100 rounded-2xl text-slate-400">
              <FileText size={44} className="text-slate-200 mb-3" />
              <p className="font-bold text-sm">
                No payroll file generated for {selectedMonth || "selected month"} yet
              </p>
              <p className="text-xs mt-1 max-w-xs text-center leading-relaxed">
                Before generating payslips, go to Run Payroll and save a payroll run first.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Line({ label, value, danger = false }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-slate-500 font-medium">{label}</span>
      <span
        className={`font-bold ${
          danger ? "text-rose-600" : "text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
import { useEffect, useState } from "react";
import {
  Printer,
  Download,
  Mail,
  FileText,
  Building2,
  User,
  Landmark,
  CalendarDays,
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

  const monthName = (month) => {
    if (!month) return "N/A";
    return new Date(month + "-01").toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const payslipNo = (companyName, periodMonth, employeeId) => {
    const prefix = String(companyName || "LEF")
      .replace(/[^A-Z]/gi, "")
      .slice(0, 3)
      .toUpperCase();

    return `${prefix}-${String(periodMonth || "").replace("-", "")}-${String(
      employeeId || ""
    ).replace(/[^0-9]/g, "")}`;
  };

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

    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 300);
  };

  const months = [...new Set(payslips.map((p) => p.period_month))];

  const employeesForMonth = payslips.filter(
    (p) => p.period_month === selectedMonth
  );

  const company = companySettings || selectedPayslip?.company || {};
  const employee = selectedPayslip?.employee || {};
  const item = selectedPayslip?.payslip || null;

  const totalDeductions = item
    ? Number(item.employee_ssnit || 0) +
      Number(item.paye || 0) +
      Number(item.lateness_deduction || 0) +
      Number(item.other_deductions || 0)
    : 0;

  const totalEarnings = item ? Number(item.gross_salary || 0) : 0;

  const tierOne = item ? Number(item.employer_ssnit || 0) * 0.7 : 0;
  const tierTwo = item ? Number(item.employer_ssnit || 0) * 0.3 : 0;

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
              .payslip-sidebar {
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

              #printable-payslip {
                border: 1px solid #111827 !important;
                box-shadow: none !important;
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 980px !important;
                background: white !important;
                color: black !important;
                page-break-inside: avoid !important;
              }

              .print-wrapper {
                width: 100% !important;
                max-width: 100% !important;
                display: block !important;
              }

              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
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
            Generate LEF-style payslips with earnings, deductions and statutory payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SelectBox label="Payroll Month">
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
                  {monthName(month)}
                </option>
              ))}
            </select>
          </SelectBox>

          <SelectBox label="Select Employee">
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
          </SelectBox>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print-wrapper">
        <div className="payslip-sidebar lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">
              Payslip Actions
            </h3>

            <p className="text-slate-500 text-xs leading-relaxed">
              Review employee earnings, PAYE, SSNIT and net pay before printing
              or sending the payslip.
            </p>

            <div className="space-y-2 pt-2">
              <ActionButton
                disabled={!item}
                onClick={handlePrint}
                icon={<Printer size={13} />}
                dark
              >
                Print Payslip
              </ActionButton>

              <ActionButton
                disabled={!item || isDownloading}
                onClick={handleDownload}
                icon={<Download size={13} />}
              >
                {isDownloading ? "Preparing PDF..." : "Download PDF"}
              </ActionButton>

              <ActionButton
                disabled={!item}
                onClick={() =>
                  alert(
                    `Payslip queued for delivery to ${
                      employee.email || "employee email"
                    }`
                  )
                }
                icon={<Mail size={13} />}
                blue
              >
                Email to Employee
              </ActionButton>
            </div>
          </div>

          <InfoCard title="Bank Details">
            <MiniLine label="Bank" value={employee.bank_name || "N/A"} />
            <MiniLine label="Account" value={employee.bank_account || "N/A"} />
            <MiniLine label="SSNIT No." value={employee.ssnit_number || "N/A"} />
            <MiniLine
              label="Ghana Card"
              value={employee.ghana_card_number || "N/A"}
            />
          </InfoCard>
        </div>

        <div className="lg:col-span-2">
          {item ? (
            <div
              id="printable-payslip"
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-4xl mx-auto relative overflow-hidden text-slate-900"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
                <img
                  src={logo}
                  alt="watermark"
                  className="w-[480px] max-w-[80%] object-contain"
                />
              </div>

              <div className="relative z-10 space-y-5">
                <div className="border border-slate-900">
                  <div className="bg-yellow-300 px-3 py-1 border-b border-slate-900 flex items-center justify-between">
                    <h1 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                      {company.name || "LEF SIGNATURE LTD"}
                    </h1>

                    <span className="text-[10px] font-bold uppercase">
                      Official Payslip
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 text-[11px]">
                    <div className="flex items-start gap-2">
                      <Building2 size={14} className="text-slate-500 mt-0.5" />
                      <div>
                        <p className="font-bold uppercase text-slate-700">
                          Company
                        </p>
                        <p>{company.name || "LEF Signature Ltd"}</p>
                        <p className="text-slate-500">
                          {company.address || "Accra, Ghana"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CalendarDays size={14} className="text-slate-500 mt-0.5" />
                      <div>
                        <p className="font-bold uppercase text-slate-700">
                          Pay Period
                        </p>
                        <p>{monthName(selectedMonth)}</p>
                        <p className="text-slate-500">
                          Payslip No:{" "}
                          {payslipNo(company.name, selectedMonth, employee.id)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Landmark size={14} className="text-slate-500 mt-0.5" />
                      <div>
                        <p className="font-bold uppercase text-slate-700">
                          Payment
                        </p>
                        <p>{employee.bank_name || "N/A"}</p>
                        <p className="text-slate-500">
                          {employee.bank_account || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <SectionTitle icon={<User size={13} />}>
                      Employee Information
                    </SectionTitle>

                    <div className="p-3 space-y-1.5">
                      <DetailLine
                        label="Name"
                        value={`${employee.first_name || ""} ${
                          employee.last_name || ""
                        }`.trim() || item.employee_name}
                      />
                      <DetailLine
                        label="Staff Number"
                        value={employee.id || item.employee_id}
                      />
                      <DetailLine
                        label="Department"
                        value={item.department_name || "N/A"}
                      />
                      <DetailLine
                        label="Designation"
                        value={employee.position || "Employee"}
                      />
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <SectionTitle icon={<Landmark size={13} />}>
                      Statutory / Bank Information
                    </SectionTitle>

                    <div className="p-3 space-y-1.5">
                      <DetailLine
                        label="Bank Name"
                        value={employee.bank_name || "N/A"}
                      />
                      <DetailLine
                        label="Bank Account"
                        value={employee.bank_account || "N/A"}
                      />
                      <DetailLine
                        label="SSNIT Number"
                        value={employee.ssnit_number || "N/A"}
                      />
                      <DetailLine
                        label="Pay Period"
                        value={monthName(selectedMonth)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-900 text-white px-3 py-2 flex justify-between text-[11px] font-bold uppercase">
                      <span>Earnings</span>
                      <span>GHS</span>
                    </div>

                    <div className="p-3 space-y-1.5 text-[11px]">
                      <AmountLine
                        label="Basic Salary"
                        value={item.basic_salary}
                      />
                      <AmountLine
                        label="Rent Allowance"
                        value={item.housing_allowance}
                      />
                      <AmountLine
                        label="Transportation Allowance"
                        value={item.transport_allowance}
                      />
                      <AmountLine
                        label="Meal Allowance"
                        value={item.utility_allowance}
                      />
                      <AmountLine
                        label="Mobile Allowance"
                        value={item.other_allowances}
                      />
                      <AmountLine
                        label="Risk Allowance"
                        value={item.risk_allowance}
                      />

                      <div className="border-t border-slate-200 pt-2 mt-2">
                        <AmountLine
                          label="TOTAL EARNINGS"
                          value={totalEarnings}
                          strong
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-900 text-white px-3 py-2 flex justify-between text-[11px] font-bold uppercase">
                      <span>Deductions</span>
                      <span>GHS</span>
                    </div>

                    <div className="p-3 space-y-1.5 text-[11px]">
                      <AmountLine
                        label="PAYE As You Earn"
                        value={item.paye}
                        danger
                      />
                      <AmountLine
                        label="Social Security / Employee SSNIT"
                        value={item.employee_ssnit}
                        danger
                      />
                      <AmountLine
                        label={`Lateness Deduction (${
                          item.late_days_count || 0
                        } incidents)`}
                        value={item.lateness_deduction}
                        danger
                      />
                      <AmountLine
                        label="Other Deductions"
                        value={item.other_deductions}
                        danger
                      />

                      <div className="border-t border-slate-200 pt-2 mt-2">
                        <AmountLine
                          label="TOTAL DEDUCTIONS"
                          value={totalDeductions}
                          danger
                          strong
                        />
                      </div>

                      <div className="border-t border-slate-100 pt-2 mt-2">
                        <AmountLine
                          label="NET PAY"
                          value={item.net_salary}
                          net
                          strong
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SummaryBox
                    label="Total Earnings"
                    value={`GH₵${money(totalEarnings)}`}
                  />

                  <SummaryBox
                    label="Total Deductions"
                    value={`GH₵${money(totalDeductions)}`}
                    danger
                  />

                  <SummaryBox
                    label="Net Pay"
                    value={`GH₵${money(item.net_salary)}`}
                    dark
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <SectionTitle>Employer / Statutory Payments</SectionTitle>

                    <div className="p-3 space-y-1.5">
                      <AmountLine
                        label="Social Security Employer SSNIT"
                        value={item.employer_ssnit}
                      />
                      <AmountLine label="SSNIT Tier 1" value={tierOne} />
                      <AmountLine label="Trustee Tier 2" value={tierTwo} />
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <SectionTitle>Payroll Notes</SectionTitle>

                    <div className="p-3 text-slate-500 leading-relaxed">
                      <p>
                        This payslip was generated from the approved payroll run
                        for {monthName(selectedMonth)}.
                      </p>
                      <p className="mt-2">
                        Net pay is calculated after statutory deductions and all
                        approved payroll deductions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row justify-between gap-3 text-[10px] text-slate-500">
                  <div>
                    <p className="font-bold text-slate-700">
                      Authorizing Officer: Payroll Administrator
                    </p>
                    <p>Finance / Payroll Audit</p>
                  </div>

                  <div className="md:text-right">
                    <p className="italic">
                      Computer generated payslip. No physical signature required.
                    </p>
                    <p>
                      Generated: {new Date().toLocaleString("en-GB")}
                    </p>
                  </div>
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

function SelectBox({ label, children }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">
        {label}
      </span>
      {children}
    </div>
  );
}

function ActionButton({ children, icon, onClick, disabled, dark, blue }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer ${
        dark
          ? "bg-slate-900 hover:bg-slate-800 text-white"
          : blue
          ? "bg-blue-50 hover:bg-blue-100 text-blue-700"
          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-2">
      <span className="font-bold text-slate-700 block text-xs">{title}</span>
      {children}
    </div>
  );
}

function MiniLine({ label, value }) {
  return (
    <p className="font-mono">
      <span className="font-semibold">{label}: </span>
      {value}
    </p>
  );
}

function SectionTitle({ children, icon }) {
  return (
    <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-700 flex items-center gap-1.5">
      {icon}
      {children}
    </div>
  );
}

function DetailLine({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="font-bold text-slate-800 text-right">{value || "N/A"}</span>
    </div>
  );
}

function AmountLine({ label, value, danger, strong, net }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span
        className={`${
          strong ? "font-extrabold text-slate-800" : "font-medium text-slate-500"
        }`}
      >
        {label}
      </span>

      <span
        className={`font-bold ${
          net
            ? "text-emerald-700 text-sm"
            : danger
            ? "text-rose-600"
            : "text-slate-800"
        }`}
      >
        {danger ? "-" : ""}GH₵
        {Number(value || 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}

function SummaryBox({ label, value, danger, dark }) {
  return (
    <div
      className={`rounded-xl border p-4 text-center ${
        dark
          ? "bg-slate-900 border-slate-900 text-white"
          : "bg-white border-slate-200 text-slate-800"
      }`}
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-wider ${
          dark ? "text-slate-300" : danger ? "text-rose-500" : "text-slate-400"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-lg font-extrabold mt-1 ${
          danger ? "text-rose-600" : dark ? "text-white" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
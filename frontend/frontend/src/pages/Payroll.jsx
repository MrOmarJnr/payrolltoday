import { useEffect, useState } from "react";
import {
  Play,
  Calendar,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Check,
  AlertTriangle,
} from "lucide-react";
import api from "../services/api";

export default function Payroll() {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [payrollRuns, setPayrollRuns] = useState([]);
  const [payrollItems, setPayrollItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [activeTab, setActiveTab] = useState("runs");
  const [expandedRunId, setExpandedRunId] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [generationItems, setGenerationItems] = useState([]);

  const [totalBasic, setTotalBasic] = useState(0);
  const [totalGross, setTotalGross] = useState(0);
  const [totalNet, setTotalNet] = useState(0);
  const [totalEmployeeSsnit, setTotalEmployeeSsnit] = useState(0);
  const [totalEmployerSsnit, setTotalEmployerSsnit] = useState(0);
  const [totalPaye, setTotalPaye] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);

  const [duplicateWarning, setDuplicateWarning] = useState(false);

  const money = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const mapRun = (run) => ({
    id: run.id,
    periodMonth: run.period_month,
    generatedAt: run.generated_at,
    generatedBy: run.generated_by,
    totalBasicSalary: Number(run.total_basic_salary || 0),
    totalGrossSalary: Number(run.total_gross_salary || 0),
    totalSsnitEmployee: Number(run.total_ssnit_employee || 0),
    totalSsnitEmployer: Number(run.total_ssnit_employer || 0),
    totalPaye: Number(run.total_paye || 0),
    totalDeductions: Number(run.total_deductions || 0),
    totalNetSalary: Number(run.total_net_salary || 0),
    itemsCount: Number(run.items_count || 0),
  });

  const mapItem = (item) => ({
    id: item.id,
    payrollRunId: item.payroll_run_id,
    employeeId: item.employee_id,
    employeeName: item.employee_name,
    departmentName: item.department_name,

    basicSalary: Number(item.basic_salary || 0),
    transportAllowance: Number(item.transport_allowance || 0),
    housingAllowance: Number(item.housing_allowance || 0),
    utilityAllowance: Number(item.utility_allowance || 0),
    riskAllowance: Number(item.risk_allowance || 0),
    otherAllowances: Number(item.other_allowances || 0),

    grossSalary: Number(item.gross_salary || 0),

    employeeSsnit: Number(item.employee_ssnit || 0),
    employerSsnit: Number(item.employer_ssnit || 0),

    taxableIncome: Number(item.taxable_income || 0),
    paye: Number(item.paye || 0),

    lateDaysCount: Number(item.late_days_count || 0),
    latenessDeduction: Number(item.lateness_deduction || 0),

    otherDeductions: Number(item.other_deductions || 0),
    netSalary: Number(item.net_salary || 0),
  });

  const loadPayroll = async () => {
    try {
      setLoading(true);

      const [runsRes, itemsRes] = await Promise.all([
        api.get("/payroll"),
        api.get("/payroll/items"),
      ]);

      if (runsRes.data.success) {
        setPayrollRuns(runsRes.data.data.map(mapRun));
      }

      if (itemsRes.data.success) {
        setPayrollItems(itemsRes.data.data.map(mapItem));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load payroll data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayroll();
  }, []);

  const checkDuplicatePeriod = (month) => {
    const exists = payrollRuns.some((run) => run.periodMonth === month);
    setDuplicateWarning(exists);
    return exists;
  };

  const getRunItems = (runId) => {
    return payrollItems.filter((item) => item.payrollRunId === runId);
  };

  const handlePreviewPayroll = async () => {
    try {
      setIsProcessing(true);
      checkDuplicatePeriod(selectedMonth);

      const response = await api.post("/payroll/process", {
        periodMonth: selectedMonth,
      });

      if (!response.data.success) {
        alert(response.data.message || "Payroll processing failed.");
        return;
      }

      await loadPayroll();

      const newRunId = response.data.payrollRunId;

      const itemsRes = await api.get("/payroll/items");

      if (itemsRes.data.success) {
        const allItems = itemsRes.data.data.map(mapItem);
        const newItems = allItems.filter((item) => item.payrollRunId === newRunId);

        setPayrollItems(allItems);
        setGenerationItems(newItems);

        const basic = newItems.reduce((sum, item) => sum + item.basicSalary, 0);
        const gross = newItems.reduce((sum, item) => sum + item.grossSalary, 0);
        const net = newItems.reduce((sum, item) => sum + item.netSalary, 0);
        const empSsnit = newItems.reduce((sum, item) => sum + item.employeeSsnit, 0);
        const employerSsnit = newItems.reduce((sum, item) => sum + item.employerSsnit, 0);
        const paye = newItems.reduce((sum, item) => sum + item.paye, 0);
        const deductions = newItems.reduce(
          (sum, item) =>
            sum +
            item.employeeSsnit +
            item.paye +
            item.otherDeductions +
            item.latenessDeduction,
          0
        );

        setTotalBasic(basic);
        setTotalGross(gross);
        setTotalNet(net);
        setTotalEmployeeSsnit(empSsnit);
        setTotalEmployerSsnit(employerSsnit);
        setTotalPaye(paye);
        setTotalDeductions(deductions);
        setExpandedRunId(newRunId);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to process payroll.");
      setIsProcessing(false);
    }
  };

  const handleApprovePayroll = async () => {
    alert(`Payroll for ${selectedMonth} has been processed and saved.`);
    setIsProcessing(false);
    setGenerationItems([]);
    setDuplicateWarning(false);
    setActiveTab("runs");
    await loadPayroll();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
        Loading payroll...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex gap-1 bg-slate-100 p-1 rounded">
          <button
            onClick={() => {
              setActiveTab("runs");
              setIsProcessing(false);
            }}
            className={`px-4 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "runs"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Saved Runs History
          </button>

          <button
            onClick={() => {
              setActiveTab("process");
              checkDuplicatePeriod(selectedMonth);
            }}
            className={`px-4 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "process"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Process New Month
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Tax Base: GRA Graduated Scales | SSNIT 5.5% / 13%
        </div>
      </div>

      {activeTab === "runs" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Payroll Archives
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Historical monthly disbursements locked for auditing.
            </p>
          </div>

          {payrollRuns.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-xl text-slate-400">
              <Calendar size={40} className="mx-auto text-slate-200 mb-2" />
              <p className="font-semibold text-sm">
                No payroll histories processed yet
              </p>
              <p className="text-xs mt-1">
                Navigate to Process New Month to run your first payroll ledger.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payrollRuns.map((run) => {
                const isExpanded = expandedRunId === run.id;
                const items = getRunItems(run.id);

                return (
                  <div
                    key={run.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
                  >
                    <div
                      onClick={() =>
                        setExpandedRunId(isExpanded ? null : run.id)
                      }
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded">
                          <DollarSign size={20} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-800 text-sm">
                            Payroll Run –{" "}
                            {new Date(run.periodMonth + "-01").toLocaleString(
                              "en-US",
                              {
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-medium">
                            Processed at: {String(run.generatedAt).replace("T", " ")} by{" "}
                            {run.generatedBy}
                          </p>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-8 text-right">
                        <Summary label="Staff count" value={`${run.itemsCount} Active`} />
                        <Summary label="Total PAYE Tax" value={`GH₵${money(run.totalPaye)}`} />
                        <Summary
                          label="Total Net Salary"
                          value={`GH₵${money(run.totalNetSalary)}`}
                          strong
                        />
                      </div>

                      <div className="text-slate-400 p-1 bg-slate-100 rounded-lg">
                        {isExpanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/20 p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-200">
                          <Metric label="Employer SSNIT (13%)" value={run.totalSsnitEmployer} />
                          <Metric label="Employee SSNIT (5.5%)" value={run.totalSsnitEmployee} />
                          <Metric label="Gross Wages" value={run.totalGrossSalary} />
                          <Metric label="Net Transferred" value={run.totalNetSalary} green />
                        </div>

                        <PayrollItemsTable items={items} money={money} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "process" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Payroll Calculation Engine
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Select a month and compute payroll data
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setDuplicateWarning(
                    payrollRuns.some(
                      (run) => run.periodMonth === e.target.value
                    )
                  );
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold"
              />

              <button
                onClick={handlePreviewPayroll}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Play size={13} />
                Generate Ledger Preview
              </button>
            </div>
          </div>

          {duplicateWarning && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs flex gap-3 leading-relaxed">
              <AlertTriangle className="text-amber-600 shrink-0" size={16} />
              <div>
                <p className="font-bold">Existing Payroll Run Detected</p>
                <p className="mt-0.5">
                  A payroll run for{" "}
                  <span className="font-semibold">{selectedMonth}</span>{" "}
                  already exists. Processing again will create another run.
                </p>
              </div>
            </div>
          )}

          {isProcessing ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ProcessCard label="Active Employees" value={`${generationItems.length} Enlisted`} />
                <ProcessCard label="Combined Wages" value={`GH₵${money(totalGross)}`} />
                <ProcessCard label="Employee SSNIT" value={`GH₵${money(totalEmployeeSsnit)}`} red />
                <ProcessCard label="PAYE Tax" value={`GH₵${money(totalPaye)}`} red />
                <ProcessCard label="Transfer Liability" value={`GH₵${money(totalNet)}`} green />
              </div>

              <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 px-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    Draft Ledger Recipient Details
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsProcessing(false);
                        setGenerationItems([]);
                      }}
                      className="bg-white text-slate-500 hover:text-slate-700 border border-slate-200 text-xs px-3 py-1.5 rounded font-medium"
                    >
                      Clear Draft
                    </button>

                    <button
                      onClick={handleApprovePayroll}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-1.5 rounded font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Check size={14} />
                      Lock & Save Payroll
                    </button>
                  </div>
                </div>

                <PayrollItemsTable items={generationItems} money={money} preview />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl text-slate-400">
              <Calendar size={44} className="text-slate-200 mb-3" />
              <p className="font-bold text-sm text-slate-600">
                Generation ledger preview is empty
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm text-center leading-relaxed">
                Click Generate Ledger Preview to assemble active employees,
                calculate SSNIT, PAYE and net salary.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Summary({ label, value, strong = false }) {
  return (
    <div>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
        {label}
      </span>
      <span className={`${strong ? "text-sm font-extrabold text-slate-900" : "text-xs font-bold text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}

function Metric({ label, value, green = false }) {
  return (
    <div className="bg-white p-3 rounded border border-slate-200 shadow-sm text-center">
      <span className="text-[10px] text-slate-400 font-medium uppercase font-sans">
        {label}
      </span>
      <p className={`text-xs font-semibold mt-1 ${green ? "text-emerald-600" : "text-slate-700"}`}>
        GH₵{Number(value || 0).toLocaleString("en-US")}
      </p>
    </div>
  );
}

function ProcessCard({ label, value, red = false, green = false }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
      <span className="text-[9px] text-slate-400 font-semibold uppercase block">
        {label}
      </span>
      <p
        className={`text-lg font-extrabold mt-1 ${
          red ? "text-rose-600" : green ? "text-emerald-600" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PayrollItemsTable({ items, money }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/85 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Employee Name</th>
              <th className="px-4 py-3">Dept</th>
              <th className="px-4 py-3">Basic</th>
              <th className="px-4 py-3">Gross</th>
              <th className="px-4 py-3">SSNIT 5.5%</th>
              <th className="px-4 py-3">PAYE</th>
              <th className="px-4 py-3 text-rose-500">Late Penalty</th>
              <th className="px-4 py-3">Other Deducts</th>
              <th className="px-4 py-3">Net Pay</th>
              <th className="px-4 py-3 text-right">SSNIT 13%</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-10 text-slate-400">
                  No payroll items found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5 font-bold text-slate-800">
                    {item.employeeName}
                  </td>

                  <td className="px-4 py-3.5 text-slate-600">
                    {item.departmentName}
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-slate-700">
                    GH₵{money(item.basicSalary)}
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-slate-800">
                    GH₵{money(item.grossSalary)}
                  </td>

                  <td className="px-4 py-3.5 text-rose-500 font-medium">
                    -GH₵{money(item.employeeSsnit)}
                  </td>

                  <td className="px-4 py-3.5 text-rose-600 font-semibold">
                    -GH₵{money(item.paye)}
                  </td>

                  <td className="px-4 py-3.5 text-rose-500 font-medium">
                    {item.latenessDeduction > 0 ? (
                      <span>
                        -GH₵{money(item.latenessDeduction)}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({item.lateDaysCount}d)
                        </span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-rose-500 font-semibold">
                    -GH₵{money(item.otherDeductions)}
                  </td>

                  <td className="px-4 py-3.5 font-extrabold text-emerald-600">
                    GH₵{money(item.netSalary)}
                  </td>

                  <td className="px-4 py-3.5 text-slate-500 text-right">
                    GH₵{money(item.employerSsnit)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
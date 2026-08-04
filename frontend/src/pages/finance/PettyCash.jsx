import { useState, useEffect } from "react";
import { Wallet, Plus } from "lucide-react";
import api from "../../services/api";
import { save } from "../../hooks/useApi";
import { money, date } from "../../utils/format";
import { PageHeader, Kpi, Section, DataTable, StatusChip, Modal, Field, TextInput, Select, Grid2, AddButton } from "../../components/ui";

export default function PettyCash() {
  const [accounts, setAccounts] = useState([]);
  const [active, setActive] = useState(null);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTxn, setOpenTxn] = useState(false);
  const [openAcct, setOpenAcct] = useState(false);
  const [txn, setTxn] = useState({ type: "expense", amount: "", description: "", txn_date: new Date().toISOString().slice(0, 10) });
  const [acct, setAcct] = useState({ name: "", custodian: "", float_amount: "" });

  const loadAccounts = async () => {
    setLoading(true);
    const res = await api.get("/petty-cash/accounts");
    const list = res.data?.data || [];
    setAccounts(list);
    if (list.length && !active) setActive(list[0]);
    setLoading(false);
  };
  const loadTxns = async (id) => {
    const res = await api.get("/petty-cash/txns", { params: { account_id: id } });
    setTxns(res.data?.data || []);
  };
  useEffect(() => { loadAccounts(); }, []);
  useEffect(() => { if (active) loadTxns(active.id); }, [active]);

  const submitTxn = async () => {
    if (!active || !txn.amount) return;
    if (await save("post", "/petty-cash/txns", { ...txn, account_id: active.id })) {
      setOpenTxn(false); setTxn({ type: "expense", amount: "", description: "", txn_date: new Date().toISOString().slice(0, 10) });
      await loadAccounts(); await loadTxns(active.id);
      const fresh = (await api.get("/petty-cash/accounts")).data?.data?.find((a) => a.id === active.id);
      if (fresh) setActive(fresh);
    }
  };
  const submitAcct = async () => {
    if (!acct.name) return;
    if (await save("post", "/petty-cash/accounts", acct)) { setOpenAcct(false); setAcct({ name: "", custodian: "", float_amount: "" }); loadAccounts(); }
  };

  return (
    <div>
      <PageHeader title="Petty Cash" subtitle="Cash floats, withdrawals, replenishments and balances">
        <button className="btn-ghost" onClick={() => setOpenAcct(true)}><Plus size={15} /> New Account</button>
        {active && <AddButton onClick={() => setOpenTxn(true)} label="Record Transaction" />}
      </PageHeader>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {accounts.map((a) => (
          <button key={a.id} onClick={() => setActive(a)} className={`card p-4 text-left transition ${active?.id === a.id ? "ring-2 ring-brand-500" : ""}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] text-muted font-semibold">{a.name}</p>
                <p className="text-2xl font-extrabold text-ink mt-1">{money(a.balance)}</p>
              </div>
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-50 text-brand-600"><Wallet size={17} /></span>
            </div>
            <p className="text-[11px] text-muted mt-2">Float {money(a.float_amount)} · {a.custodian || "—"}</p>
          </button>
        ))}
        {!accounts.length && !loading && <p className="text-sm text-muted">No petty cash accounts yet.</p>}
      </div>

      <Section title={active ? `Transactions — ${active.name}` : "Transactions"}>
        <DataTable loading={loading} rows={txns}
          columns={[
            { key: "txn_date", label: "Date", render: (r) => date(r.txn_date) },
            { key: "ref", label: "Reference" },
            { key: "type", label: "Type", render: (r) => <StatusChip status={r.type} /> },
            { key: "description", label: "Description" },
            { key: "amount", label: "Amount", align: "right", render: (r) => <span className={["float", "replenishment"].includes(r.type) ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>{["float", "replenishment"].includes(r.type) ? "+" : "−"}{money(r.amount)}</span> },
            { key: "balance_after", label: "Balance", align: "right", render: (r) => money(r.balance_after) },
          ]}
        />
      </Section>

      <Modal open={openTxn} onClose={() => setOpenTxn(false)} title="Record Transaction"
        footer={<><button className="btn-ghost" onClick={() => setOpenTxn(false)}>Cancel</button><button className="btn-primary" onClick={submitTxn}>Save</button></>}>
        <div className="space-y-4">
          <Field label="Type"><Select value={txn.type} onChange={(e) => setTxn({ ...txn, type: e.target.value })}>
            <option value="expense">Expense (out)</option><option value="withdrawal">Withdrawal (out)</option>
            <option value="replenishment">Replenishment (in)</option><option value="float">Float top-up (in)</option>
          </Select></Field>
          <Grid2>
            <Field label="Amount (GHS)" required><TextInput type="number" value={txn.amount} onChange={(e) => setTxn({ ...txn, amount: e.target.value })} /></Field>
            <Field label="Date"><TextInput type="date" value={txn.txn_date} onChange={(e) => setTxn({ ...txn, txn_date: e.target.value })} /></Field>
          </Grid2>
          <Field label="Description"><TextInput value={txn.description} onChange={(e) => setTxn({ ...txn, description: e.target.value })} /></Field>
        </div>
      </Modal>

      <Modal open={openAcct} onClose={() => setOpenAcct(false)} title="New Petty Cash Account"
        footer={<><button className="btn-ghost" onClick={() => setOpenAcct(false)}>Cancel</button><button className="btn-primary" onClick={submitAcct}>Create</button></>}>
        <div className="space-y-4">
          <Field label="Account Name" required><TextInput value={acct.name} onChange={(e) => setAcct({ ...acct, name: e.target.value })} placeholder="e.g. HQ Petty Cash" /></Field>
          <Grid2>
            <Field label="Custodian"><TextInput value={acct.custodian} onChange={(e) => setAcct({ ...acct, custodian: e.target.value })} /></Field>
            <Field label="Opening Float (GHS)"><TextInput type="number" value={acct.float_amount} onChange={(e) => setAcct({ ...acct, float_amount: e.target.value })} /></Field>
          </Grid2>
        </div>
      </Modal>
    </div>
  );
}

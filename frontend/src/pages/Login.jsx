import { useState } from "react";
import { ShieldCheck, ArrowRight, User, Key, Eye, EyeOff } from "lucide-react";

import api from "../services/api";
import logo from "../assets/logo.png";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("lefpayroll_token", response.data.token);
        localStorage.setItem("lefpayroll_user", JSON.stringify(response.data.user));

        onLogin(response.data.user);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login failed.");
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas font-sans">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left panel — quiet, solid, no gradients or glow */}
        <div className="hidden lg:flex flex-col justify-between p-14 bg-ink text-white">
          <div className="flex items-center gap-3 animate-[fadeUp_.4s_var(--ease-out)]">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="LEF Signature LTD" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/50 font-bold">LEF Signature LTD</p>
              <h1 className="text-[15px] font-extrabold tracking-tight">Payroll &amp; Attendance</h1>
            </div>
          </div>

          <div className="max-w-md animate-[fadeUp_.5s_var(--ease-out)_.05s_both]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-semibold text-white/70 mb-6">
              <ShieldCheck size={13} />
              Secure workspace for payroll, attendance &amp; payslips
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15]">
              Run payroll with confidence, speed and clarity.
            </h2>

            <p className="mt-4 text-[13px] leading-6 text-white/50 max-w-sm">
              Attendance tracked. Payroll run. Payslips generated.
            </p>
          </div>

          <p className="text-[11px] text-white/30 font-mono animate-[fadeUp_.4s_var(--ease-out)_.1s_both]">
            LEF Payroll &amp; Attendance — v3.0
          </p>
        </div>

        {/* Login card */}
        <div className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-[380px] animate-[fadeUp_.35s_var(--ease-out)_.05s_both]">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center overflow-hidden p-1.5">
                <img src={logo} alt="LEF Signature LTD" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">LEF Signature LTD</p>
                <p className="text-sm font-extrabold text-ink">Payroll &amp; Attendance</p>
              </div>
            </div>

            <div className="mb-7">
              <h1 className="text-[22px] font-extrabold text-ink tracking-tight">Welcome back</h1>
              <p className="text-[13px] text-muted mt-1.5">Sign in to continue to your workspace.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="username" className="label mb-1.5 block">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                    <User size={16} />
                  </span>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="label">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                    <Key size={16} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-100 text-red-700 text-[12px] font-semibold rounded-lg px-3.5 py-2.5"
                >
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-[13px] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Signing in…" : "Sign in"}
                {!loading && <ArrowRight size={15} />}
              </button>
            </form>

            <p className="mt-8 text-[11px] text-muted/70 text-center">
              LEF Payroll &amp; Attendance — v3.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

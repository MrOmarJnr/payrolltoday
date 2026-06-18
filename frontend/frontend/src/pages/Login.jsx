import { useState } from "react";
import {
  ShieldCheck,
  Briefcase,
  Clock,
  FileText,
  User,
  Key,
} from "lucide-react";

import api from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (!username || !password) {
    setError("Please enter your username and password.");
    return;
  }

  try {
    const response = await api.post("/auth/login", {
      username,
      password,
    });

    if (response.data.success) {
      localStorage.setItem(
        "lefpayroll_token",
        response.data.token
      );

      localStorage.setItem(
        "lefpayroll_user",
        JSON.stringify(response.data.user)
      );

      onLogin(response.data.user);
    } else {
      setError(response.data.message);
    }
  } catch (error) {
    if (error.response) {
      setError(
        error.response.data.message ||
          "Login failed."
      );
    } else {
      setError(
        "Unable to connect to the server."
      );
    }
  }
};

  return (
    <div className="min-h-screen bg-[#07111f] font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.22),_transparent_34%)]"></div>

      <div className="absolute top-12 left-10 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400/10 blur-3xl rounded-full"></div>

      <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src="/logo.png"
                alt="LEF Signature LTD"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-blue-200 font-bold">
                LEF Signature LTD
              </p>
              <h1 className="text-lg font-black tracking-tight text-white">
                Payroll Basic
              </h1>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur text-[11px] font-bold text-blue-100 mb-6">
              <ShieldCheck size={14} />
              Local payroll, attendance and payslip workspace
            </div>

            <h2 className="text-5xl font-black tracking-tight leading-tight">
              Run payroll with confidence, speed and clarity.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-300 max-w-lg">
              Attendance tracked. Payroll run. Payslips generated.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-10 max-w-lg">
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur">
                <Briefcase size={18} className="text-blue-200 mb-3" />
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Modules
                </p>
                <p className="text-sm font-black mt-1">8 Active</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur">
                <Clock size={18} className="text-blue-200 mb-3" />
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Mode
                </p>
                <p className="text-sm font-black mt-1">Cloud Ready</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur">
                <FileText size={18} className="text-blue-200 mb-3" />
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Payslips
                </p>
                <p className="text-sm font-black mt-1">Digital</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono">
            Making Seamless Connections With Technology | LEF Payroll &
            Attendance v3.0
          </p>
        </div>

        {/* Login Card */}
        <div className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md">
            <div className="rounded-[2rem] bg-white/95 backdrop-blur-xl border border-white/70 shadow-2xl shadow-blue-950/30 overflow-hidden">
              <div className="p-7 sm:p-8">
                <div className="text-center mb-7">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-slate-900 flex items-center justify-center shadow-lg shadow-blue-600/20 mb-5 overflow-hidden p-2">
                    <img
                      src="/whitelogo.png"
                      alt="LEF Signature LTD"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                    Welcome Back
                  </h1>

                  <p className="text-xs text-slate-500 mt-2">
                    Sign in to continue to LEF Payroll & Attendance.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.18em] mb-2">
                      Username
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <User size={16} />
                      </span>

                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="pl-11 pr-4 py-3 w-full border border-slate-200 bg-slate-50 rounded-2xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.18em] mb-2">
                      Password
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Key size={16} />
                      </span>

                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-11 pr-4 py-3 w-full border border-slate-200 bg-slate-50 rounded-2xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-bold text-center rounded-2xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-slate-950 hover:bg-blue-900 text-white font-black text-xs uppercase tracking-[0.2em] py-3.5 rounded-2xl transition-all"
                  >
                    Login
                  </button>
                </form>
              </div>

              <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  LEF Payroll & Attendance
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  v3.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
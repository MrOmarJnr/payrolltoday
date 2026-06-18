import { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";

export default function Header({
  authUser,
  activeTab,
  onLogout,
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] font-black text-slate-400">
          Current Page
        </p>
        <h2 className="text-sm font-black text-slate-900 capitalize">
          {activeTab}
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-slate-100"
        >
          <div className="text-right">
            <p className="text-xs font-black">
              {authUser?.fullName}
            </p>
            <p className="text-[10px] uppercase text-blue-600 font-bold">
              {authUser?.role}
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
            {authUser?.fullName
              ? authUser.fullName.substring(0, 1)
              : "U"}
          </div>
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50">
              <User size={16} />
              My Profile
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50">
              <Settings size={16} />
              Account Settings
            </button>

            <div className="border-t"></div>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
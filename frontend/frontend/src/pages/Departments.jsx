import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Building2,
  Users,
  Save,
  X,
} from "lucide-react";

import api from "../services/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/departments");

      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setName("");
    setCode("");
    setDescription("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setName(dept.name);
    setCode(dept.code);
    setDescription(dept.description || "");
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (!name.trim() || !code.trim()) {
        alert("Department Name and Code are required.");
        return;
      }

      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, {
          name,
          code,
          description,
        });
      } else {
        await api.post("/departments", {
          name,
          code,
          description,
        });
      }

      setIsFormOpen(false);

      await loadDepartments();
    } catch (error) {
      console.error(error);

      alert("Failed to save department.");
    }
  };

  const handleDelete = async (dept) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${dept.name}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/departments/${dept.id}`);

      await loadDepartments();
    } catch (error) {
      console.error(error);

      alert("Failed to delete department.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        Loading departments...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Department Management
          </h2>

          <p className="text-slate-500 text-xs mt-0.5">
            Control company and team structures.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 py-2 rounded font-semibold flex items-center gap-1.5"
        >
          <Plus size={14} />
          Create Department
        </button>
      </div>

      {/* Stats */}

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="text-sm text-slate-500">
          Total Departments
        </div>

        <div className="text-3xl font-bold text-slate-800 mt-1">
          {departments.length}
        </div>
      </div>

      {/* Department Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded">
                <Building2 size={18} />
              </div>

              <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold uppercase tracking-widest px-2.5 py-1 rounded font-mono">
                {dept.code}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              {dept.name}
            </h3>

            <p className="text-slate-400 text-xs mt-1.5 min-h-[3rem] leading-relaxed">
              {dept.description ||
                "No description provided for this department."}
            </p>

            <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Users size={14} className="text-blue-400" />
                Department Record
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(dept)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded"
                >
                  <Edit2 size={13} />
                </button>

                <button
                  onClick={() => handleDelete(dept)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {editingDept
                    ? "Update Department"
                    : "Create Department"}
                </h3>

                <p className="text-slate-400 text-[11px]">
                  Department Configuration
                </p>
              </div>

              <button onClick={() => setIsFormOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Department Name
                  </label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Department Code
                  </label>

                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Description
                  </label>

                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-white border px-3 py-2 rounded text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                >
                  <Save size={14} />
                  {editingDept
                    ? "Save Changes"
                    : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
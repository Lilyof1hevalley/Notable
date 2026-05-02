import { useState } from "react";

// ── Priority config ───────────────────────────────────────────────────────────
const PRIORITIES = [
  { value: "high",   label: "High",   color: "#E53935", bg: "#FFF0F0" },
  { value: "medium", label: "Medium", color: "#F57C00", bg: "#FFF8F0" },
  { value: "low",    label: "Low",    color: "#43A047", bg: "#F0FAF0" },
];

const FOLDERS = [
  "Discrete Math", "Physics", "Calculus", "Software Eng", "General",
];

const EFFORT = [1, 2, 3, 4, 5];

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  overlay: {
    position: "fixed", inset: 0,
    backgroundColor: "rgba(10,8,20,0.45)",
    backdropFilter: "blur(3px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.15s ease",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E5E5E5",
    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    width: "460px",
    maxWidth: "calc(100vw - 32px)",
    padding: "24px",
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    animation: "slideUp 0.18s ease",
  },
  header: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  title: {
    fontSize: "16px", fontWeight: "700",
    fontStyle: "italic", color: "#1A1A1A",
  },
  closeBtn: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: "18px", color: "#888", padding: "2px 6px",
    borderRadius: "4px", lineHeight: 1,
    transition: "background 0.12s",
  },
  fieldGroup: { marginBottom: "14px" },
  label: {
    display: "block", fontSize: "11px", fontWeight: "600",
    color: "#888", letterSpacing: "0.06em",
    textTransform: "uppercase", marginBottom: "6px",
  },
  input: {
    width: "100%", boxSizing: "border-box",
    padding: "9px 12px", fontSize: "13px",
    border: "1px solid #E0E0E0", borderRadius: "7px",
    outline: "none", color: "#1A1A1A",
    backgroundColor: "#FAFAFA",
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    transition: "border-color 0.15s",
  },
  row: { display: "flex", gap: "12px" },
  select: {
    flex: 1, padding: "9px 12px", fontSize: "13px",
    border: "1px solid #E0E0E0", borderRadius: "7px",
    outline: "none", color: "#1A1A1A",
    backgroundColor: "#FAFAFA", cursor: "pointer",
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M6 8 0 0h12z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: "28px",
  },
  dateInput: {
    flex: 1, padding: "9px 12px", fontSize: "13px",
    border: "1px solid #E0E0E0", borderRadius: "7px",
    outline: "none", color: "#1A1A1A",
    backgroundColor: "#FAFAFA",
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    boxSizing: "border-box",
  },

  // Priority pills
  pillRow: { display: "flex", gap: "8px" },
  pill: (active, color, bg) => ({
    padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
    fontWeight: "600", cursor: "pointer", border: "1.5px solid",
    borderColor: active ? color : "#E0E0E0",
    backgroundColor: active ? bg : "#FAFAFA",
    color: active ? color : "#888",
    transition: "all 0.12s",
  }),

  // Effort dots
  effortRow: { display: "flex", gap: "8px", alignItems: "center" },
  effortDot: (active) => ({
    width: "28px", height: "28px", borderRadius: "50%",
    border: `1.5px solid ${active ? "#863bff" : "#E0E0E0"}`,
    backgroundColor: active ? "#863bff" : "#FAFAFA",
    color: active ? "#fff" : "#888",
    fontSize: "11px", fontWeight: "600",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", transition: "all 0.12s",
  }),

  // Notes textarea
  textarea: {
    width: "100%", boxSizing: "border-box",
    padding: "9px 12px", fontSize: "13px", lineHeight: "1.5",
    border: "1px solid #E0E0E0", borderRadius: "7px",
    outline: "none", color: "#1A1A1A",
    backgroundColor: "#FAFAFA", resize: "vertical",
    minHeight: "72px",
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
  },

  // Footer
  footer: {
    display: "flex", justifyContent: "flex-end", gap: "10px",
    marginTop: "20px", paddingTop: "16px",
    borderTop: "1px solid #F0F0F0",
  },
  cancelBtn: {
    padding: "8px 18px", fontSize: "13px", borderRadius: "7px",
    border: "1px solid #E0E0E0", backgroundColor: "transparent",
    color: "#555", cursor: "pointer", fontWeight: "500",
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    transition: "background 0.12s",
  },
  submitBtn: {
    padding: "8px 20px", fontSize: "13px", borderRadius: "7px",
    border: "none", backgroundColor: "#1A1A1A",
    color: "#FFFFFF", cursor: "pointer", fontWeight: "600",
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    transition: "background 0.12s",
  },

  // BHPS preview chip
  bhpsChip: (color) => ({
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "3px 10px", borderRadius: "20px", fontSize: "11px",
    fontWeight: "700", color, border: `1px solid ${color}`,
    backgroundColor: color + "18",
    marginTop: "8px",
  }),
};

// ── BHPS score helper (simplified) ───────────────────────────────────────────
function calcBHPS(deadline, priority, effort) {
  if (!deadline || !priority || !effort) return null;
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(deadline) - new Date()) / 86400000)
  );
  const urgency = daysLeft === 0 ? 10 : Math.max(1, 10 - daysLeft * 0.4);
  const pMap = { high: 10, medium: 6, low: 3 };
  const raw = urgency * 0.5 + pMap[priority] * 0.35 + effort * 0.15;
  return Math.min(10, raw).toFixed(1);
}

function bhpsColor(score) {
  if (!score) return "#888";
  if (score >= 7) return "#E53935";
  if (score >= 4) return "#F57C00";
  return "#43A047";
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AddTaskModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "", folder: "", deadline: "", time: "",
    priority: "", effort: null, notes: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const bhps = calcBHPS(form.deadline, form.priority, form.effort);
  const bColor = bhpsColor(bhps ? parseFloat(bhps) : null);

  function handleSubmit() {
    if (!form.name.trim()) return;
    onAdd?.({ ...form, id: Date.now(), done: false, bhps });
    onClose?.();
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(12px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        .notable-input:focus { border-color: #863bff !important; background:#fff !important; }
        .notable-cancel:hover { background:#F5F5F5 !important; }
        .notable-submit:hover { background:#333 !important; }
        .notable-close:hover { background:#F5F5F5 !important; }
      `}</style>

      <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div style={s.modal}>

          {/* Header */}
          <div style={s.header}>
            <span style={s.title}>Add Task</span>
            <button className="notable-close" style={s.closeBtn} onClick={onClose}>✕</button>
          </div>

          {/* Task name */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Task Name</label>
            <input
              className="notable-input"
              style={s.input}
              placeholder="e.g. Review Chapter 3 problems"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          {/* Folder + Deadline row */}
          <div style={{ ...s.fieldGroup, ...s.row }}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Folder / Course</label>
              <select
                className="notable-input"
                style={s.select}
                value={form.folder}
                onChange={(e) => set("folder", e.target.value)}
              >
                <option value="">Select folder</option>
                {FOLDERS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Deadline</label>
              <input
                className="notable-input"
                style={{ ...s.dateInput }}
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
              />
            </div>
            <div style={{ width: "90px" }}>
              <label style={s.label}>Time</label>
              <input
                className="notable-input"
                style={{ ...s.dateInput, width: "100%" }}
                type="time"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
              />
            </div>
          </div>

          {/* Priority */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Priority</label>
            <div style={s.pillRow}>
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  style={s.pill(form.priority === p.value, p.color, p.bg)}
                  onClick={() => set("priority", form.priority === p.value ? "" : p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Effort */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Effort Level</label>
            <div style={s.effortRow}>
              {EFFORT.map((n) => (
                <div
                  key={n}
                  style={s.effortDot(form.effort === n)}
                  onClick={() => set("effort", form.effort === n ? null : n)}
                >
                  {n}
                </div>
              ))}
              <span style={{ fontSize: "11px", color: "#AAA", marginLeft: "4px" }}>
                {form.effort ? ["", "Very easy", "Easy", "Moderate", "Hard", "Very hard"][form.effort] : "Select effort"}
              </span>
            </div>
          </div>

          {/* BHPS Preview */}
          {bhps && (
            <div style={s.fieldGroup}>
              <label style={s.label}>BHPS Preview</label>
              <div style={s.bhpsChip(bColor)}>
                ⚡ Priority Score: {bhps} / 10
              </div>
            </div>
          )}

          {/* Notes */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Notes (optional)</label>
            <textarea
              className="notable-input"
              style={s.textarea}
              placeholder="Any extra context for this task..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {/* Footer */}
          <div style={s.footer}>
            <button className="notable-cancel" style={s.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              className="notable-submit"
              style={{
                ...s.submitBtn,
                opacity: form.name.trim() ? 1 : 0.45,
                cursor: form.name.trim() ? "pointer" : "not-allowed",
              }}
              onClick={handleSubmit}
              disabled={!form.name.trim()}
            >
              Add Task
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
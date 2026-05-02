import { useState } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  high:   { label: "High",   color: "#E53935", bg: "#FFF0F0" },
  medium: { label: "Medium", color: "#F57C00", bg: "#FFF8F0" },
  low:    { label: "Low",    color: "#43A047", bg: "#F0FAF0" },
};

function bhpsColor(score) {
  if (score >= 7) return "#E53935";
  if (score >= 4) return "#F57C00";
  return "#43A047";
}

function formatDeadline(deadline, time) {
  if (!deadline) return null;
  const d = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d - today) / 86400000);
  const label =
    diff === 0 ? "Today" :
    diff === 1 ? "Tomorrow" :
    diff < 0   ? `${Math.abs(diff)}d overdue` :
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return { label, overdue: diff < 0, today: diff === 0 };
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  card: (done, hovered) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid",
    borderColor: hovered ? "#D0D0D0" : "#EEEEEE",
    backgroundColor: done ? "#FAFAFA" : "#FFFFFF",
    boxShadow: hovered ? "0 2px 10px rgba(0,0,0,0.06)" : "none",
    transition: "all 0.15s",
    cursor: "default",
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    position: "relative",
    marginBottom: "8px",
  }),

  // Checkbox
  checkbox: (done) => ({
    width: "16px", height: "16px", borderRadius: "50%",
    border: `1.5px solid ${done ? "#863bff" : "#BBBBBB"}`,
    backgroundColor: done ? "#863bff" : "transparent",
    flexShrink: 0, marginTop: "2px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.15s",
  }),
  checkmark: {
    color: "#fff", fontSize: "9px", fontWeight: "700", lineHeight: 1,
  },

  // Content
  content: { flex: 1, minWidth: 0 },
  topRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", gap: "8px",
    marginBottom: "3px",
  },
  taskName: (done) => ({
    fontSize: "13px", fontWeight: "500", color: done ? "#AAAAAA" : "#1A1A1A",
    textDecoration: done ? "line-through" : "none",
    lineHeight: 1.4, whiteSpace: "nowrap",
    overflow: "hidden", textOverflow: "ellipsis",
    transition: "color 0.15s",
  }),

  // Meta row
  metaRow: {
    display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
  },
  metaChip: (color, bg) => ({
    display: "inline-flex", alignItems: "center", gap: "3px",
    padding: "2px 7px", borderRadius: "20px", fontSize: "10px",
    fontWeight: "600", color, backgroundColor: bg,
    border: `1px solid ${color}28`, lineHeight: 1.5,
  }),
  folderTag: {
    fontSize: "11px", color: "#888",
    display: "flex", alignItems: "center", gap: "3px",
  },
  deadlineTag: (overdue, today) => ({
    fontSize: "11px", fontWeight: "600",
    color: overdue ? "#E53935" : today ? "#F57C00" : "#666",
    display: "flex", alignItems: "center", gap: "3px",
  }),

  // BHPS badge
  bhpsBadge: (score) => ({
    display: "inline-flex", alignItems: "center", gap: "3px",
    padding: "2px 7px", borderRadius: "20px", fontSize: "10px",
    fontWeight: "700", color: bhpsColor(score),
    backgroundColor: bhpsColor(score) + "15",
    border: `1px solid ${bhpsColor(score)}30`,
  }),

  // Notes preview
  notesPreview: {
    fontSize: "11px", color: "#999", marginTop: "4px",
    fontStyle: "italic", lineHeight: 1.4,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },

  // Action buttons (appear on hover)
  actions: (visible) => ({
    display: "flex", alignItems: "center", gap: "2px",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.15s",
    flexShrink: 0,
  }),
  actionBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: "3px 6px", borderRadius: "5px",
    fontSize: "12px", color: "#AAA",
    transition: "background 0.12s, color 0.12s",
  },
};

// ── TaskCard Component ────────────────────────────────────────────────────────
export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [actionHovered, setActionHovered] = useState(null);

  const deadline = formatDeadline(task.deadline, task.time);
  const priority = task.priority ? PRIORITY_CONFIG[task.priority] : null;
  const bhps = task.bhps ? parseFloat(task.bhps) : null;

  return (
    <>
      <style>{`
        .task-action-btn:hover { background: #F5F5F5 !important; color: #555 !important; }
        .task-action-delete:hover { background: #FFF0F0 !important; color: #E53935 !important; }
      `}</style>

      <div
        style={s.card(task.done, hovered)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Checkbox */}
        <div style={s.checkbox(task.done)} onClick={() => onToggle?.(task.id)}>
          {task.done && <span style={s.checkmark}>✓</span>}
        </div>

        {/* Content */}
        <div style={s.content}>
          <div style={s.topRow}>
            <span style={s.taskName(task.done)}>{task.name}</span>
          </div>

          {/* Meta row */}
          <div style={s.metaRow}>
            {/* Folder */}
            {task.folder && (
              <span style={s.folderTag}>
                📁 {task.folder}
              </span>
            )}

            {/* Priority pill */}
            {priority && (
              <span style={s.metaChip(priority.color, priority.bg)}>
                {priority.label}
              </span>
            )}

            {/* Deadline */}
            {deadline && (
              <span style={s.deadlineTag(deadline.overdue, deadline.today)}>
                {deadline.overdue ? "⚠️" : "📅"} {deadline.label}
                {task.time && ` · ${task.time}`}
              </span>
            )}

            {/* Effort */}
            {task.effort && (
              <span style={{ fontSize: "11px", color: "#AAA" }}>
                {"●".repeat(task.effort)}{"○".repeat(5 - task.effort)}
              </span>
            )}

            {/* BHPS */}
            {bhps && (
              <span style={s.bhpsBadge(bhps)}>
                ⚡ {bhps}
              </span>
            )}
          </div>

          {/* Notes preview */}
          {task.notes && !task.done && (
            <div style={s.notesPreview}>{task.notes}</div>
          )}
        </div>

        {/* Action buttons */}
        <div style={s.actions(hovered)}>
          <button
            className="task-action-btn"
            style={s.actionBtn}
            onClick={() => onEdit?.(task)}
            title="Edit"
          >✏️</button>
          <button
            className="task-action-btn task-action-delete"
            style={s.actionBtn}
            onClick={() => onDelete?.(task.id)}
            title="Delete"
          >🗑</button>
        </div>
      </div>
    </>
  );
}
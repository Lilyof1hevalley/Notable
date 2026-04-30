import { useState } from "react";

// ── Sample Data (replace with real API data later) ────────────────────────────
const sampleTimeline = [
  {
    date: "25 Mar 2026",
    tasks: [
      { id: 1, name: "Review Chapter 3", time: "08:00", folder: "Discrete Math" },
      { id: 2, name: "Submit Lab Report", time: "10:00", folder: "Physics" },
    ],
  },
  {
    date: "26 Mar 2026",
    tasks: [
      { id: 3, name: "Quiz Preparation", time: "09:00", folder: "Calculus" },
      { id: 4, name: "Group Meeting", time: "13:00", folder: "Software Eng" },
    ],
  },
];

const sampleResources = [
  {
    chapter: "Chapter 1",
    files: ["Textbook.pdf", "Lecture_Slides.pdf"],
    images: ["7404_Datasheet_Image.png"],
  },
  {
    chapter: "Chapter 2",
    files: ["Textbook.pdf"],
    images: ["7404_Datasheet_Image.png", "7420_Datasheet_Image.png"],
  },
];

const sampleChapters = [
  {
    id: 1,
    title: "Chapter 1: Introduction",
    preview:
      "An overview of the core concepts covered in this notebook. Topics include foundational theory, key definitions, and the scope of the subject matter as outlined in the course syllabus.",
    createdOn: "25/03/2026",
  },
  {
    id: 2,
    title: "Chapter 2: Core Concepts",
    preview:
      "Deep dive into the primary subject matter with worked examples and case studies. This chapter builds on the introduction and presents the main theoretical framework used throughout the course.",
    createdOn: "25/03/2026",
  },
  {
    id: 3,
    title: "Chapter 3: Applications",
    preview:
      "Practical applications and problem-solving strategies derived from the core concepts. Students are expected to apply the theoretical knowledge from Chapter 2 to solve real-world scenarios.",
    createdOn: "25/03/2026",
  },
  {
    id: 4,
    title: "Chapter 4: Advanced Topics",
    preview:
      "Extension material for deeper understanding. Covers advanced derivations, edge cases, and contemporary research directions relevant to the subject area covered in this notebook.",
    createdOn: "26/03/2026",
  },
  {
    id: 5,
    title: "Chapter 5: Review & Summary",
    preview:
      "Consolidated review of all topics covered throughout the notebook. Includes a structured summary, key takeaways, and a self-assessment checklist to prepare for examinations.",
    createdOn: "26/03/2026",
  },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    minHeight: "100vh",
    backgroundColor: "#F9F9F9",
    color: "#1A1A1A",
  },

  // Top navbar
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: "52px",
    backgroundColor: "#FFFFFF",
    borderBottom: "1px solid #E5E5E5",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "#1A1A1A",
    fontSize: "18px",
    fontStyle: "italic",
    fontWeight: "400",
  },
  backArrow: {
    fontSize: "16px",
    color: "#555",
  },
  notebookTitle: {
    fontSize: "18px",
    fontStyle: "italic",
    fontWeight: "400",
    textDecoration: "underline",
    textDecorationStyle: "solid",
    color: "#1A1A1A",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid #D0D0D0",
    borderRadius: "6px",
    padding: "5px 10px",
    fontSize: "13px",
    backgroundColor: "#FFFFFF",
    width: "200px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "13px",
    width: "100%",
    backgroundColor: "transparent",
    color: "#1A1A1A",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#555",
    padding: "4px",
  },

  // Main layout
  body: {
    display: "flex",
    height: "calc(100vh - 52px)",
    overflow: "hidden",
  },

  // Left sidebar
  sidebar: {
    width: "260px",
    flexShrink: 0,
    borderRight: "1px solid #E5E5E5",
    backgroundColor: "#FFFFFF",
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  sidebarSection: {},
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  sidebarTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: "0.02em",
  },
  addBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#555",
    lineHeight: 1,
    padding: "0 2px",
  },

  // Timeline
  dateGroup: {
    marginBottom: "10px",
  },
  dateLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#888",
    marginBottom: "6px",
    letterSpacing: "0.04em",
  },
  taskItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "6px",
    padding: "6px 8px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  taskCheckbox: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    border: "1.5px solid #BBBBBB",
    flexShrink: 0,
    marginTop: "2px",
  },
  taskInfo: {},
  taskName: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#1A1A1A",
    lineHeight: 1.4,
  },
  taskMeta: {
    fontSize: "11px",
    color: "#888",
  },

  // Resources
  resourceGroup: {
    marginBottom: "10px",
  },
  resourceChapter: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: "4px",
  },
  resourceFile: {
    fontSize: "11px",
    color: "#555",
    padding: "2px 0 2px 8px",
    borderLeft: "2px solid #E5E5E5",
    marginBottom: "2px",
    cursor: "pointer",
  },

  // Right main area
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 32px",
  },
  chapterCard: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
    padding: "16px 20px",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "box-shadow 0.15s, border-color 0.15s",
  },
  chapterTitle: {
    fontSize: "15px",
    fontWeight: "500",
    fontStyle: "italic",
    textDecoration: "underline",
    color: "#1A1A1A",
    marginBottom: "8px",
  },
  chapterPreview: {
    fontSize: "13px",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "10px",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  chapterDate: {
    fontSize: "11px",
    color: "#AAA",
    textAlign: "right",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Notebook() {
  const [search, setSearch] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);

  const filteredChapters = sampleChapters.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>

      {/* ── Navbar ── */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.backArrow}>←</span>
          <span style={styles.notebookTitle}>Notebook Title</span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.searchBar}>
            <span style={{ color: "#AAA", fontSize: "13px" }}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <span
                style={{ cursor: "pointer", color: "#AAA", fontSize: "12px" }}
                onClick={() => setSearch("")}
              >✕</span>
            )}
          </div>
          <button style={styles.iconBtn} title="Filter">▽</button>
          <button style={styles.iconBtn} title="Sort">↕</button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={styles.body}>

        {/* ── Left Sidebar ── */}
        <aside style={styles.sidebar}>

          {/* Timeline */}
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarHeader}>
              <span style={styles.sidebarTitle}>Timeline</span>
              <button style={styles.addBtn} title="Add task">+</button>
            </div>
            {sampleTimeline.map((group) => (
              <div key={group.date} style={styles.dateGroup}>
                <div style={styles.dateLabel}>{group.date}</div>
                {group.tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      ...styles.taskItem,
                      background: hoveredTask === task.id ? "#F5F5F5" : "transparent",
                    }}
                    onMouseEnter={() => setHoveredTask(task.id)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    <div style={styles.taskCheckbox} />
                    <div style={styles.taskInfo}>
                      <div style={styles.taskName}>{task.name}</div>
                      <div style={styles.taskMeta}>{task.time} · {task.folder}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Resources */}
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarHeader}>
              <span style={styles.sidebarTitle}>Resources</span>
              <button style={styles.addBtn} title="Add resource">+</button>
            </div>
            {sampleResources.map((group) => (
              <div key={group.chapter} style={styles.resourceGroup}>
                <div style={styles.resourceChapter}>{group.chapter}</div>
                {group.files.map((file) => (
                  <div key={file} style={styles.resourceFile}>{file}</div>
                ))}
                {group.images.map((img) => (
                  <div key={img} style={{ ...styles.resourceFile, color: "#888" }}>{img}</div>
                ))}
              </div>
            ))}
          </div>

        </aside>

        {/* ── Main Area ── */}
        <main style={styles.main}>
          {filteredChapters.length === 0 ? (
            <div style={{ color: "#AAA", fontSize: "14px", textAlign: "center", marginTop: "60px" }}>
              No chapters found.
            </div>
          ) : (
            filteredChapters.map((chapter) => (
              <div
                key={chapter.id}
                style={{
                  ...styles.chapterCard,
                  boxShadow: hoveredCard === chapter.id ? "0 2px 12px rgba(0,0,0,0.08)" : "none",
                  borderColor: hoveredCard === chapter.id ? "#CCCCCC" : "#E5E5E5",
                }}
                onMouseEnter={() => setHoveredCard(chapter.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.chapterTitle}>{chapter.title}</div>
                <div style={styles.chapterPreview}>{chapter.preview}</div>
                <div style={styles.chapterDate}>Created On {chapter.createdOn}</div>
              </div>
            ))
          )}
        </main>

      </div>
    </div>
  );
}
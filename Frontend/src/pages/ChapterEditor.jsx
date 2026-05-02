import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    minHeight: '100vh',
    backgroundColor: '#F9F9F9',
    color: '#1A1A1A',
    display: 'flex',
    flexDirection: 'column',
  },

  // Top navbar — identical to Notebook
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '52px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
    position: 'sticky',
    top: 0,
    zIndex: 200,
    flexShrink: 0,
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#1A1A1A',
    fontSize: '18px',
  },
  backArrow: {
    fontSize: '16px',
    color: '#555',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px',
    lineHeight: 1,
  },
  chapterTitle: {
    fontSize: '16px',
    fontStyle: 'italic',
    fontWeight: '400',
    color: '#1A1A1A',
    textDecoration: 'underline',
    textDecorationStyle: 'solid',
  },
  notebookCrumb: {
    fontSize: '14px',
    color: '#888',
    fontStyle: 'italic',
  },
  crumbSep: {
    fontSize: '14px',
    color: '#CCC',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  saveBtn: {
    padding: '6px 14px',
    fontSize: '13px',
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    transition: 'background 0.15s',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#555',
    padding: '4px',
  },

  // Formatting toolbar
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '6px 24px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
    position: 'sticky',
    top: '52px',
    zIndex: 100,
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  toolbarGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1px',
    paddingRight: '8px',
    marginRight: '8px',
    borderRight: '1px solid #E5E5E5',
  },
  toolbarGroupLast: {
    display: 'flex',
    alignItems: 'center',
    gap: '1px',
  },
  toolBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#333',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    transition: 'background 0.1s, color 0.1s',
    flexShrink: 0,
  },
  toolBtnActive: {
    backgroundColor: '#F0F0F0',
    color: '#1A1A1A',
  },
  toolBtnWide: {
    width: 'auto',
    padding: '0 8px',
    fontSize: '12px',
    height: '28px',
    borderRadius: '4px',
    border: '1px solid #E5E5E5',
    background: 'transparent',
    cursor: 'pointer',
    color: '#333',
    fontFamily: "'Inria Sans', 'Inter', sans-serif',",
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  select: {
    border: '1px solid #E5E5E5',
    borderRadius: '4px',
    padding: '3px 6px',
    fontSize: '12px',
    color: '#333',
    background: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none',
    height: '28px',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
  },
  colorInput: {
    width: '24px',
    height: '24px',
    border: '1px solid #E5E5E5',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '1px',
  },

  // Editor area
  editorArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '40px 0',
  },
  editorPage: {
    maxWidth: '720px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    padding: '48px 56px',
    minHeight: '800px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  editorTitleInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '22px',
    fontStyle: 'italic',
    fontWeight: '400',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    color: '#1A1A1A',
    marginBottom: '4px',
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },
  editorMeta: {
    fontSize: '11px',
    color: '#AAA',
    marginBottom: '28px',
    paddingBottom: '16px',
    borderBottom: '1px solid #F0F0F0',
  },
  editor: {
    outline: 'none',
    minHeight: '600px',
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#1A1A1A',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
  },

  // Word count bar
  statusBar: {
    borderTop: '1px solid #E5E5E5',
    padding: '6px 24px',
    backgroundColor: '#FFFFFF',
    fontSize: '11px',
    color: '#AAA',
    display: 'flex',
    gap: '16px',
    flexShrink: 0,
  },
}

// ── Toolbar button component ──────────────────────────────────────────────────
function ToolBtn({ title, onClick, active, children, wide, style: extraStyle }) {
  const [hovered, setHovered] = useState(false)
  const btnStyle = {
    ...(wide ? styles.toolBtnWide : styles.toolBtn),
    ...(active || hovered ? styles.toolBtnActive : {}),
    ...extraStyle,
  }
  return (
    <button
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick && onClick() }}
      style={btnStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ChapterEditor() {
  const navigate = useNavigate()
  const editorRef = useRef(null)
  const [chapterTitle, setChapterTitle] = useState('Chapter 1: Introduction')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [activeFormats, setActiveFormats] = useState({})
  const [fontFamily, setFontFamily] = useState('Inria Sans')
  const [fontSize, setFontSize] = useState('14')
  const [savedAt, setSavedAt] = useState(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const savedRange = useRef(null)

  // ── Sync active formats ───────────────────────────────────────────────────
  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      orderedList: document.queryCommandState('insertOrderedList'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState('justifyRight'),
    })
  }, [])

  const updateCounts = useCallback(() => {
    const text = editorRef.current?.innerText || ''
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    setWordCount(words)
    setCharCount(text.length)
  }, [])

  // ── Exec command ─────────────────────────────────────────────────────────
  const exec = useCallback((command, value = null) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    updateActiveFormats()
    updateCounts()
  }, [updateActiveFormats, updateCounts])

  // ── Heading ──────────────────────────────────────────────────────────────
  const applyBlock = useCallback((tag) => {
    editorRef.current?.focus()
    document.execCommand('formatBlock', false, tag)
    updateActiveFormats()
  }, [updateActiveFormats])

  // ── Font ─────────────────────────────────────────────────────────────────
  const applyFont = useCallback((font) => {
    setFontFamily(font)
    exec('fontName', font)
  }, [exec])

  const applySize = useCallback((size) => {
    setFontSize(size)
    // Use inline style via a span for pixel-accurate sizing
    editorRef.current?.focus()
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      document.execCommand('fontSize', false, '7') // placeholder
      // Replace all font size=7 with correct px
      editorRef.current.querySelectorAll('font[size="7"]').forEach(el => {
        el.removeAttribute('size')
        el.style.fontSize = size + 'px'
      })
    }
  }, [])

  // ── Link ─────────────────────────────────────────────────────────────────
  const insertLink = () => {
    editorRef.current?.focus()
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange()
    }
    setLinkDialogOpen(true)
    setLinkUrl('')
  }

  const confirmLink = () => {
    if (!linkUrl) { setLinkDialogOpen(false); return }
    editorRef.current?.focus()
    const sel = window.getSelection()
    if (savedRange.current) {
      sel.removeAllRanges()
      sel.addRange(savedRange.current)
    }
    const url = linkUrl.startsWith('http') ? linkUrl : 'https://' + linkUrl
    exec('createLink', url)
    setLinkDialogOpen(false)
  }

  // ── Image ─────────────────────────────────────────────────────────────────
  const insertImage = () => {
    const url = prompt('Image URL:')
    if (url) exec('insertImage', url)
  }

  // ── Table ─────────────────────────────────────────────────────────────────
  const insertTable = () => {
    editorRef.current?.focus()
    const table = `
      <table style="border-collapse:collapse;width:100%;margin:12px 0">
        ${[1,2,3].map(r => `<tr>${[1,2,3].map(c =>
          `<td style="border:1px solid #E5E5E5;padding:8px 12px;font-size:13px">${r === 1 ? `<strong>Header ${c}</strong>` : `Cell ${r-1},${c}`}</td>`
        ).join('')}</tr>`).join('')}
      </table>
      <p><br></p>
    `
    exec('insertHTML', table)
  }

  // ── Code block ───────────────────────────────────────────────────────────
  const insertCode = () => {
    exec('insertHTML', '<pre style="background:#F5F5F5;border:1px solid #E5E5E5;border-radius:6px;padding:12px 16px;font-size:12px;font-family:monospace;overflow-x:auto;margin:12px 0"><code>// Your code here</code></pre><p><br></p>')
  }

  // ── Divider ───────────────────────────────────────────────────────────────
  const insertDivider = () => {
    exec('insertHTML', '<hr style="border:none;border-top:1px solid #E5E5E5;margin:20px 0"><p><br></p>')
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    const now = new Date()
    setSavedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 's': e.preventDefault(); handleSave(); break
        case 'b': e.preventDefault(); exec('bold'); break
        case 'i': e.preventDefault(); exec('italic'); break
        case 'u': e.preventDefault(); exec('underline'); break
        case 'k': e.preventDefault(); insertLink(); break
        default: break
      }
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = `
        <p>An overview of the core concepts covered in this notebook. Topics include foundational theory, key definitions, and the scope of the subject matter as outlined in the course syllabus.</p>
        <p><br></p>
        <h2>Key Definitions</h2>
        <p>Begin by establishing the foundational vocabulary used throughout this chapter. These terms will be referenced in all subsequent sections.</p>
        <p><br></p>
        <ul>
          <li>First key concept and its formal definition</li>
          <li>Second key concept with relevant context</li>
          <li>Third key concept including examples</li>
        </ul>
        <p><br></p>
        <h2>Main Theory</h2>
        <p>The primary theoretical framework underpins all practical applications discussed later. This section provides the formal basis from which all derivations are drawn.</p>
        <p><br></p>
      `
      updateCounts()
    }
  }, [])

  return (
    <div style={styles.page}>

      {/* ── Navbar ── */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <button style={styles.backArrow} onClick={() => navigate('/notebook')}>←</button>
          <span style={styles.notebookCrumb}>Notebook Title</span>
          <span style={styles.crumbSep}>/</span>
          <span style={styles.chapterTitle}>{chapterTitle}</span>
        </div>
        <div style={styles.navRight}>
          {savedAt && (
            <span style={{ fontSize: '12px', color: '#AAA' }}>Saved {savedAt}</span>
          )}
          <button
            style={styles.saveBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSave}
          >
            Save
          </button>
          <button style={styles.iconBtn} title="More options">⋯</button>
        </div>
      </nav>

      {/* ── Formatting Toolbar ── */}
      <div style={styles.toolbar}>

        {/* History */}
        <div style={styles.toolbarGroup}>
          <ToolBtn title="Undo (⌘Z)" onClick={() => exec('undo')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          </ToolBtn>
          <ToolBtn title="Redo (⌘⇧Z)" onClick={() => exec('redo')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
          </ToolBtn>
        </div>

        {/* Block style */}
        <div style={styles.toolbarGroup}>
          <select
            style={styles.select}
            onChange={(e) => applyBlock(e.target.value)}
            defaultValue="p"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="blockquote">Blockquote</option>
          </select>
        </div>

        {/* Font family */}
        <div style={styles.toolbarGroup}>
          <select
            style={{ ...styles.select, width: '110px' }}
            value={fontFamily}
            onChange={(e) => applyFont(e.target.value)}
          >
            <option value="Inria Sans">Inria Sans</option>
            <option value="Inter">Inter</option>
            <option value="Georgia">Georgia</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>

        {/* Font size */}
        <div style={styles.toolbarGroup}>
          <select
            style={{ ...styles.select, width: '60px' }}
            value={fontSize}
            onChange={(e) => applySize(e.target.value)}
          >
            {[10,11,12,13,14,16,18,20,24,28,32,36,48].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Text format */}
        <div style={styles.toolbarGroup}>
          <ToolBtn title="Bold (⌘B)" onClick={() => exec('bold')} active={activeFormats.bold}>
            <strong style={{ fontSize: '13px' }}>B</strong>
          </ToolBtn>
          <ToolBtn title="Italic (⌘I)" onClick={() => exec('italic')} active={activeFormats.italic}>
            <em style={{ fontSize: '13px' }}>I</em>
          </ToolBtn>
          <ToolBtn title="Underline (⌘U)" onClick={() => exec('underline')} active={activeFormats.underline}>
            <span style={{ textDecoration: 'underline', fontSize: '13px' }}>U</span>
          </ToolBtn>
          <ToolBtn title="Strikethrough" onClick={() => exec('strikeThrough')} active={activeFormats.strikeThrough}>
            <span style={{ textDecoration: 'line-through', fontSize: '13px' }}>S</span>
          </ToolBtn>
          <ToolBtn title="Superscript" onClick={() => exec('superscript')}>
            <span style={{ fontSize: '11px' }}>x²</span>
          </ToolBtn>
          <ToolBtn title="Subscript" onClick={() => exec('subscript')}>
            <span style={{ fontSize: '11px' }}>x₂</span>
          </ToolBtn>
        </div>

        {/* Color */}
        <div style={styles.toolbarGroup}>
          <ToolBtn title="Text color" style={{ position: 'relative', overflow: 'hidden' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>A</span>
            <input
              type="color"
              defaultValue="#1A1A1A"
              title="Text color"
              style={{
                position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%',
              }}
              onChange={(e) => exec('foreColor', e.target.value)}
            />
          </ToolBtn>
          <ToolBtn title="Highlight color" style={{ position: 'relative', overflow: 'hidden' }}>
            <span style={{ fontSize: '12px', background: '#FFFB00', padding: '0 2px' }}>H</span>
            <input
              type="color"
              defaultValue="#FFFB00"
              title="Highlight"
              style={{
                position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%',
              }}
              onChange={(e) => exec('hiliteColor', e.target.value)}
            />
          </ToolBtn>
        </div>

        {/* Alignment */}
        <div style={styles.toolbarGroup}>
          <ToolBtn title="Align left" onClick={() => exec('justifyLeft')} active={activeFormats.justifyLeft}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          </ToolBtn>
          <ToolBtn title="Center" onClick={() => exec('justifyCenter')} active={activeFormats.justifyCenter}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="7" y2="12"/><line x1="19" y1="18" x2="5" y2="18"/></svg>
          </ToolBtn>
          <ToolBtn title="Align right" onClick={() => exec('justifyRight')} active={activeFormats.justifyRight}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
          </ToolBtn>
          <ToolBtn title="Justify" onClick={() => exec('justifyFull')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
          </ToolBtn>
        </div>

        {/* Lists & indent */}
        <div style={styles.toolbarGroup}>
          <ToolBtn title="Bullet list" onClick={() => exec('insertUnorderedList')} active={activeFormats.unorderedList}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>
          </ToolBtn>
          <ToolBtn title="Numbered list" onClick={() => exec('insertOrderedList')} active={activeFormats.orderedList}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4" stroke="currentColor"/><path d="M4 10h2" stroke="currentColor"/><path d="M3 14h2a1 1 0 0 1 0 2H3a1 1 0 0 1 0 2h2" stroke="currentColor"/></svg>
          </ToolBtn>
          <ToolBtn title="Decrease indent" onClick={() => exec('outdent')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/><polyline points="7 8 3 12 7 16"/></svg>
          </ToolBtn>
          <ToolBtn title="Increase indent" onClick={() => exec('indent')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/><polyline points="3 8 7 12 3 16"/></svg>
          </ToolBtn>
        </div>

        {/* Insert */}
        <div style={styles.toolbarGroupLast}>
          <ToolBtn title="Insert link (⌘K)" onClick={insertLink}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </ToolBtn>
          <ToolBtn title="Insert image" onClick={insertImage}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </ToolBtn>
          <ToolBtn title="Insert table" onClick={insertTable}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
          </ToolBtn>
          <ToolBtn title="Insert code block" onClick={insertCode}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </ToolBtn>
          <ToolBtn title="Insert divider" onClick={insertDivider}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>
          </ToolBtn>
          <ToolBtn title="Clear formatting" onClick={() => exec('removeFormat')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="7" x2="16" y2="7"/><line x1="10" y1="3" x2="10" y2="7"/><path d="M8 21H12L17 7"/><line x1="3" y1="21" x2="6" y2="21"/></svg>
          </ToolBtn>
        </div>
      </div>

      {/* ── Link dialog ── */}
      {linkDialogOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.15)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setLinkDialogOpen(false) }}
        >
          <div style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px',
            padding: '20px 24px', width: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Insert Link</div>
            <input
              autoFocus
              type="text"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmLink(); if (e.key === 'Escape') setLinkDialogOpen(false) }}
              style={{
                width: '100%', border: '1px solid #D0D0D0', borderRadius: '6px',
                padding: '8px 10px', fontSize: '13px', outline: 'none',
                fontFamily: "'Inria Sans', 'Inter', sans-serif",
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setLinkDialogOpen(false)}
                style={{
                  padding: '6px 14px', fontSize: '13px', border: '1px solid #E5E5E5',
                  borderRadius: '6px', background: 'none', cursor: 'pointer',
                  fontFamily: "'Inria Sans', 'Inter', sans-serif",
                }}
              >Cancel</button>
              <button
                onClick={confirmLink}
                style={{
                  padding: '6px 14px', fontSize: '13px', backgroundColor: '#1A1A1A',
                  color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer',
                  fontFamily: "'Inria Sans', 'Inter', sans-serif",
                }}
              >Insert</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Editor area ── */}
      <div style={styles.editorArea}>
        <div style={styles.editorPage}>
          <input
            style={styles.editorTitleInput}
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            placeholder="Chapter title…"
          />
          <div style={styles.editorMeta}>Created On 25/03/2026 · Notebook Title</div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            spellCheck
            style={styles.editor}
            onKeyDown={handleKeyDown}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            onInput={updateCounts}
          />
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={styles.statusBar}>
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
        <span style={{ marginLeft: 'auto' }}>⌘B Bold · ⌘I Italic · ⌘U Underline · ⌘K Link · ⌘S Save</span>
      </div>

    </div>
  )
}
export default function Dashboard() {
  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      
      {/* Left: notebook grid */}
      <div style={{ flex: 1 }}>
        <h2>Hello, Nadira</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {/* FolderCard and NoteCard components go here */}
        </div>
      </div>

      {/* Right: sidebar */}
      <div style={{ width: '300px' }}>
        <h3>Your Day</h3>
        {/* Event items go here */}
        <h3>Timeline</h3>
        {/* Task items go here */}
      </div>

    </div>
  )
}

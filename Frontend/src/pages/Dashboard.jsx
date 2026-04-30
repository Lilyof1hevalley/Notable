import { Link } from 'react-router-dom'

const notebooks = [
  { id: 'discrete-math', title: 'Discrete Math', noteCount: 12 },
  { id: 'physics', title: 'Physics', noteCount: 8 },
  { id: 'calculus', title: 'Calculus', noteCount: 15 },
  { id: 'software-eng', title: 'Software Eng', noteCount: 6 },
]

function Dashboard() {
  return (
    <main style={{ display: 'flex', gap: '24px', padding: '32px' }}>
      <section style={{ flex: 1 }}>
        <h1>Hello, Nadira</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {notebooks.map((notebook) => (
            <Link
              key={notebook.id}
              to="/notebook"
              style={{
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                color: '#1A1A1A',
                padding: '16px',
                textDecoration: 'none',
              }}
            >
              <strong>{notebook.title}</strong>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                {notebook.noteCount} notes
              </div>
            </Link>
          ))}
        </div>
      </section>

      <aside style={{ width: '300px' }}>
        <h2>Your Day</h2>
        <p>Review Chapter 3 at 08:00</p>
        <h2>Timeline</h2>
        <p>Submit Lab Report at 10:00</p>
      </aside>
    </main>
  )
}

export default Dashboard

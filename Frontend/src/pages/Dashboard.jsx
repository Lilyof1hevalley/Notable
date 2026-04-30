import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FolderCard from '../components/FolderCard';
import TaskCard from '../components/TaskCard';
import { Plus, X } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [notebooks, setNotebooks] = useState([
    { id: 1, title: "Software Engineering", tasks: 3 },
    { id: 2, title: "Personal Project", tasks: 1 }
  ]);
  const [newTitle, setNewTitle] = useState("");

  const addNotebook = () => {
    if(newTitle) {
      setNotebooks([...notebooks, { id: Date.now(), title: newTitle, tasks: 0 }]);
      setNewTitle("");
      setShowModal(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '30px' }}>
      <Navbar userName="Nadira" />
      
      <div style={{ display: 'flex', gap: '25px', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px', overflowY: 'auto', padding: '10px' }}>
          {notebooks.map((nb) => (
            <FolderCard key={nb.id} title={nb.title} taskCount={nb.tasks} onClick={() => navigate('/notebook')} />
          ))}
        </div>

        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--bg-panel)', padding: '20px', borderRadius: '25px', color: '#333' }}>
            <h3 style={{ fontStyle: 'italic', marginTop: 0 }}>Your Day</h3>
            <TaskCard name="Kuliah Umum" time="10:00" />
          </div>
          <div style={{ background: 'var(--bg-panel)', padding: '20px', borderRadius: '25px', color: '#333', flex: 1 }}>
            <h3 style={{ fontStyle: 'italic', marginTop: 0 }}>Timeline</h3>
            <TaskCard name="Tugas Kalkulus" time="23:59" bhps="9.5" />
          </div>
        </div>
      </div>

      {/* Floating Button untuk memicu Modal */}
      <div onClick={() => setShowModal(true)} style={{ position: 'fixed', bottom: '40px', right: '40px', background: 'var(--accent)', width: '65px', height: '65px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
        <Plus color="white" size={30} />
      </div>

      {/* MODAL TAMBAH NOTEBOOK */}
      {showModal && (
        <div className="modal-overlay">
          <div style={{ background: '#FFF', padding: '30px', borderRadius: '20px', width: '350px', color: '#333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>New Notebook</h2>
              <X onClick={() => setShowModal(false)} cursor="pointer" />
            </div>
            <input 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter title..." 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '20px' }}
            />
            <button onClick={addNotebook} style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Create</button>
          </div>
        </div>
      )}
    </div>
  );
}
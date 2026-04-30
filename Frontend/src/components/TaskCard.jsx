import { Circle } from 'lucide-react';

export default function TaskCard({ name, time, location, bhps }) {
  return (
    <div style={{ background: 'white', color: '#333', padding: '12px', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Circle size={16} color={bhps > 8 ? 'red' : 'gray'} />
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{time}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '10px', color: '#999' }}>{location}</div>
        {bhps && <div style={{ fontSize: '11px', color: 'teal', fontWeight: 'bold', marginTop: '2px' }}>BHPS: {bhps}</div>}
      </div>
    </div>
  );
}
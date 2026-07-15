'use client';

import { useState } from 'react';
import { toggleColleagueActive, deleteColleague } from '@/app/colleagues/actions';
import { Trash2, UserCheck, UserMinus } from 'lucide-react';

interface Props {
  id: number;
  isActive: boolean;
}

export function ColleagueClientButtons({ id, isActive }: Props) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await toggleColleagueActive(id, isActive);
    } catch (error) {
      alert('Chyba při změně stavu zaměstnance.');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Opravdu chcete tohoto zaměstnance smazat? Pokud se již účastnil kampaní, data z kampaní budou zachována, ale zaměstnanec zmizí z tohoto seznamu.')) return;
    
    setIsDeleting(true);
    try {
      await deleteColleague(id);
    } catch (error) {
      alert('Chyba při mazání zaměstnance.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button 
        onClick={handleToggle}
        disabled={isToggling || isDeleting}
        className="btn"
        style={{ 
          backgroundColor: isActive ? 'transparent' : 'rgba(46, 204, 113, 0.1)',
          color: isActive ? 'var(--text-muted)' : '#2ecc71',
          border: `1px solid ${isActive ? 'var(--border)' : '#2ecc71'}`,
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '6px 12px',
          fontSize: '0.85rem'
        }}
      >
        {isActive ? <UserMinus size={14} /> : <UserCheck size={14} />}
        {isToggling ? 'Zpracovávám...' : (isActive ? 'Deaktivovat' : 'Aktivovat')}
      </button>

      <button 
        onClick={handleDelete}
        disabled={isToggling || isDeleting}
        className="btn"
        style={{ 
          backgroundColor: 'transparent', 
          color: '#e74c3c', 
          border: '1px solid #e74c3c', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '6px 12px',
          fontSize: '0.85rem'
        }}
        title="Smazat zaměstnance"
      >
        <Trash2 size={14} />
        {isDeleting ? 'Mažu...' : 'Smazat'}
      </button>
    </div>
  );
}

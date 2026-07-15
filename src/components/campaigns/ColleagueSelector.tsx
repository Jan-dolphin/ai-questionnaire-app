'use client';

import { useState } from 'react';

interface Colleague {
  id: number;
  name: string;
  email: string;
}

interface Props {
  colleagues: Colleague[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function ColleagueSelector({ colleagues, selectedIds, onChange }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredColleagues = colleagues.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allFilteredSelected = filteredColleagues.length > 0 && filteredColleagues.every(c => selectedIds.includes(c.id));

  const handleToggleAll = () => {
    if (allFilteredSelected) {
      // Odeznačit všechny zafiltrované
      const filteredIds = filteredColleagues.map(c => c.id);
      onChange(selectedIds.filter(id => !filteredIds.includes(id)));
    } else {
      // Označit všechny zafiltrované (přidat je k aktuálně vybraným)
      const filteredIds = filteredColleagues.map(c => c.id);
      const newSelected = Array.from(new Set([...selectedIds, ...filteredIds]));
      onChange(newSelected);
    }
  };

  const handleToggleOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span>Cílová skupina</span>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
          Vybráno: {selectedIds.length} / {colleagues.length} zaměstnanců
        </span>
      </h3>
      
      <div style={{ padding: '16px', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        
        {/* Vyhledávání a Vybrat vše */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Hledat podle jména nebo e-mailu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)' }}
          />
          
          <button 
            type="button"
            onClick={handleToggleAll}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '4px', 
              border: '1px solid var(--primary)', 
              backgroundColor: allFilteredSelected ? 'var(--primary)' : 'transparent',
              color: allFilteredSelected ? 'white' : 'var(--primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {allFilteredSelected ? 'Zrušit výběr zobrazených' : 'Vybrat všechny zobrazené'}
          </button>
        </div>

        {/* Seznam zaměstnanců */}
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          border: '1px solid var(--border)', 
          borderRadius: '4px',
          backgroundColor: '#fff'
        }}>
          {filteredColleagues.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Žádní zaměstnanci neodpovídají hledání.
            </div>
          ) : (
            filteredColleagues.map(c => (
              <label 
                key={c.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '10px 16px', 
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  backgroundColor: selectedIds.includes(c.id) ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(c.id)}
                  onChange={() => handleToggleOne(c.id)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--foreground)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.email}</div>
                </div>
              </label>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}

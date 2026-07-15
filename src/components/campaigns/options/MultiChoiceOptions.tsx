'use client';

import { useState } from 'react';

interface Props {
  value: string; // The JSON string of options from db
  onChange: (newValue: string) => void;
}

export function MultiChoiceOptions({ value, onChange }: Props) {
  // Similar logic to SingleChoice but visually represented as checkboxes
  let initialOptions: Record<string, string> = {};
  if (value) {
    try {
      initialOptions = JSON.parse(value);
    } catch (e) {
      console.error("Failed to parse existing options", e);
    }
  }

  const [options, setOptions] = useState<Record<string, string>>(initialOptions);

  const handleAddOption = () => {
    const currentKeys = Object.keys(options);
    const nextKey = String.fromCharCode(65 + currentKeys.length);
    
    const newOptions = { ...options, [nextKey]: `Možnost ${nextKey}` };
    setOptions(newOptions);
    onChange(JSON.stringify(newOptions));
  };

  const handleUpdateOption = (key: string, newText: string) => {
    const newOptions = { ...options, [key]: newText };
    setOptions(newOptions);
    onChange(JSON.stringify(newOptions));
  };

  const handleDeleteOption = (keyToDelete: string) => {
    const newOptions = { ...options };
    delete newOptions[keyToDelete];
    setOptions(newOptions);
    onChange(JSON.stringify(newOptions));
  };

  return (
    <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
      <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Vizuální editor možností (Více odpovědí)</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {Object.entries(options).map(([key, text]) => (
          <div key={key} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '4px', // Square for multi-choice checkbox analogy
              border: '1px solid var(--text-muted)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              backgroundColor: 'white'
            }}>
              {key}
            </div>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => handleUpdateOption(key, e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
            />
            <button 
              type="button" 
              onClick={() => handleDeleteOption(key)}
              style={{ padding: '8px', color: 'var(--warning)', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Smazat možnost"
            >
              ✕
            </button>
          </div>
        ))}
        {Object.keys(options).length === 0 && (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Zatím nejsou přidány žádné možnosti.</div>
        )}
      </div>

      <button type="button" className="btn" onClick={handleAddOption} style={{ fontSize: '0.9rem', backgroundColor: 'transparent', color: 'var(--primary)', border: '1px dashed var(--primary)' }}>
        + Přidat možnost
      </button>
    </div>
  );
}

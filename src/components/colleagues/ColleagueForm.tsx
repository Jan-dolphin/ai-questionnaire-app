'use client';

import { useState } from 'react';
import { createColleague } from '@/app/colleagues/actions';

export function ColleagueForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await createColleague(formData);
      setIsOpen(false);
    } catch (error: any) {
      alert(error.message || "Chyba při ukládání zaměstnance.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button className="btn" onClick={() => setIsOpen(true)}>Přidat zaměstnance</button>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      padding: '40px 20px', overflowY: 'auto'
    }}>
      <div className="card" style={{ 
        width: '100%', maxWidth: '500px', 
        border: '2px solid var(--primary)', 
        backgroundColor: 'var(--background)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Přidat nového zaměstnance</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Jméno a příjmení</label>
              <input 
                type="text" 
                name="name" 
                className="form-control" 
                style={{ width: '100%', padding: '10px', borderRadius: '0px', border: '1px solid var(--border)' }} 
                required 
                placeholder="Např. Jan Novák" 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>E-mail</label>
              <input 
                type="email" 
                name="email" 
                className="form-control" 
                style={{ width: '100%', padding: '10px', borderRadius: '0px', border: '1px solid var(--border)' }} 
                required 
                placeholder="jan.novak@firma.cz" 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={() => setIsOpen(false)} className="btn" style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
              Zrušit
            </button>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? 'Ukládám...' : 'Uložit zaměstnance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

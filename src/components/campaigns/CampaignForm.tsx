'use client';

import { useState } from 'react';
import { QuestionBuilder } from '@/components/campaigns/QuestionBuilder';
import { createCampaign } from '@/app/campaigns/actions';

export function CampaignForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await createCampaign(formData, JSON.stringify(questions));
      setIsOpen(false);
      setQuestions([]); // Reset
    } catch (error) {
      alert("Chyba při ukládání kampaně.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button className="btn" onClick={() => setIsOpen(true)}>Vytvořit kampaň</button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '32px', border: '2px solid var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem' }}>Založit novou kampaň</h2>
        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Název kampaně</label>
            <input type="text" name="name" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} required placeholder="Zadejte název..." />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Unikátní Klíč (bez mezer)</label>
            <input type="text" name="key" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} required placeholder="napr. HR_DOTAZNIK_2026" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Popis / Zadání</label>
            <textarea name="description" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', minHeight: '80px' }} placeholder="Nepovinný popis kampaně pro interní účely..."></textarea>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>n8n Webhook URL (spouštěcí)</label>
            <input type="url" name="webhook_url" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} placeholder="https://n8n.dolphin.cz/webhook/start-campaign" />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Na tuto adresu se odešle POST request při kliknutí na 'Spustit dotazování'.</div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <QuestionBuilder onChange={setQuestions} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
          <button type="button" onClick={() => setIsOpen(false)} className="btn" style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Zrušit</button>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Ukládám...' : 'Uložit kampaň'}
          </button>
        </div>
      </form>
    </div>
  );
}

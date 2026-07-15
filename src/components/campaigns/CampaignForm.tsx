'use client';

import { useState, useEffect } from 'react';
import { QuestionBuilder } from '@/components/campaigns/QuestionBuilder';
import { createCampaign, updateCampaign, getColleaguesForSelect } from '@/app/campaigns/actions';
import { Edit } from 'lucide-react';
import { ColleagueSelector } from './ColleagueSelector';

interface Props {
  initialData?: any;
  isEdit?: boolean;
  webhookUrl?: string;
}

export function CampaignForm({ initialData, isEdit, webhookUrl }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<any[]>(initialData?.questions || []);
  
  // State for colleagues
  const [colleagues, setColleagues] = useState<any[]>([]);
  const [selectedColleagueIds, setSelectedColleagueIds] = useState<number[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Načtení aktivních zaměstnanců ze serveru
      getColleaguesForSelect().then(data => setColleagues(data)).catch(console.error);
      
      // Pokud editujeme, vyextrahujeme IDs zaměstnanců z existujících sessions
      if (isEdit && initialData?.sessions) {
        const preselectedIds = initialData.sessions.map((s: any) => s.colleague_id);
        setSelectedColleagueIds(preselectedIds);
      }
    }
  }, [isOpen, isEdit, initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      if (isEdit && initialData?.id) {
        await updateCampaign(initialData.id, formData, JSON.stringify(questions), JSON.stringify(selectedColleagueIds));
      } else {
        await createCampaign(formData, JSON.stringify(questions), JSON.stringify(selectedColleagueIds));
        setQuestions([]); 
        setSelectedColleagueIds([]);
      }
      setIsOpen(false);
    } catch (error: any) {
      alert(error.message || "Chyba při ukládání kampaně.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    if (isEdit) {
      return (
        <button className="btn" style={{ backgroundColor: 'white', color: 'var(--foreground)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setIsOpen(true)}>
          <Edit size={16} /> Upravit
        </button>
      );
    }
    return (
      <button className="btn" onClick={() => setIsOpen(true)}>Vytvořit kampaň</button>
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
        width: '100%', maxWidth: '800px', 
        border: '2px solid var(--primary)', 
        backgroundColor: 'var(--background)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>{isEdit ? 'Upravit kampaň' : 'Založit novou kampaň'}</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Název kampaně</label>
              <input type="text" name="name" defaultValue={initialData?.name} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '0px', border: '1px solid var(--border)' }} required placeholder="Zadejte název..." />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Popis / Zadání</label>
              <textarea name="description" defaultValue={initialData?.description} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '0px', border: '1px solid var(--border)', minHeight: '80px' }} placeholder="Nepovinný popis kampaně pro interní účely..."></textarea>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>n8n Webhook URL (spouštěcí)</label>
              <input type="url" name="webhook_url" value={webhookUrl || ''} readOnly className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '0px', border: '1px solid var(--border)', backgroundColor: 'var(--border)', color: 'var(--text-muted)' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Automaticky načteno ze serveru (.env). Nelze měnit.</div>
            </div>
          </div>

        {/* --- Nyní vložíme komponentu pro výběr zaměstnanců --- */}
        <ColleagueSelector 
          colleagues={colleagues} 
          selectedIds={selectedColleagueIds} 
          onChange={setSelectedColleagueIds} 
        />

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <QuestionBuilder initialQuestions={questions} onChange={setQuestions} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
          <button type="button" onClick={() => setIsOpen(false)} className="btn" style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Zrušit</button>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Ukládám...' : 'Uložit kampaň'}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

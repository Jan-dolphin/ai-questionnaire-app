'use client';

import { useState } from 'react';
import { stopCampaign, deleteCampaign, triggerN8nWebhook } from '@/app/campaigns/actions';
import { Play, Square, Trash2 } from 'lucide-react';

interface Props {
  campaignId: number;
  status: string;
}

export function CampaignClientButtons({ campaignId, status }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    if (!confirm('Opravdu chcete spustit kampaň a začít odesílat dotazníky zaměstnancům?')) return;
    setIsStarting(true);
    try {
      await triggerN8nWebhook(campaignId);
    } catch (error: any) {
      alert(error.message || 'Chyba při spouštění kampaně.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async () => {
    if (!confirm('Opravdu chcete zastavit kampaň? Zastavenou kampaň již nelze znovu spustit.')) return;
    setIsStopping(true);
    try {
      await stopCampaign(campaignId);
    } catch (error) {
      alert('Chyba při zastavování.');
    } finally {
      setIsStopping(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Opravdu chcete smazat kampaň? Smažou se tím i všechny vytvořené otázky a nasbírané odpovědi!')) return;
    setIsDeleting(true);
    try {
      await deleteCampaign(campaignId);
    } catch (error) {
      alert('Chyba při mazání.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
      {status === 'draft' && (
        <button 
          onClick={handleStart} 
          disabled={isStarting}
          className="btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Play size={16} />
          {isStarting ? 'Spouštím...' : 'Spustit'}
        </button>
      )}

      {status === 'running' && (
        <button 
          onClick={handleStop} 
          disabled={isStopping}
          className="btn" 
          style={{ backgroundColor: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Square size={16} />
          {isStopping ? 'Zastavuji...' : 'Zastavit'}
        </button>
      )}

      {(status === 'draft' || status === 'completed') && (
        <button 
          onClick={handleDelete} 
          disabled={isDeleting}
          className="btn" 
          style={{ backgroundColor: 'transparent', color: 'red', border: '1px solid red', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Trash2 size={16} />
          {isDeleting ? 'Mažu...' : 'Smazat'}
        </button>
      )}
    </div>
  );
}

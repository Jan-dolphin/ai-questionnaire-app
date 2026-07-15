'use client';

import { useState } from 'react';
import { triggerN8nWebhook } from './actions';

export function TriggerCampaignButton({ campaignId }: { campaignId: number }) {
  const [isTriggering, setIsTriggering] = useState(false);

  const handleTrigger = async () => {
    if (!confirm('Opravdu chcete odeslat webhook do n8n a spustit kampaň?')) return;
    
    setIsTriggering(true);
    try {
      await triggerN8nWebhook(campaignId);
      alert('Webhook úspěšně odeslán do n8n!');
    } catch (error: any) {
      alert(error.message || 'Nepodařilo se odeslat webhook.');
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <button className="btn" onClick={handleTrigger} disabled={isTriggering}>
      {isTriggering ? 'Spouštím...' : 'Spustit dotazování'}
    </button>
  );
}

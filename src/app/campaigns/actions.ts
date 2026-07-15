'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCampaign(formData: FormData, questionsJson: string) {
  const name = formData.get('name') as string;
  const key = formData.get('key') as string;
  const description = formData.get('description') as string;
  const webhook_url = formData.get('webhook_url') as string;
  
  if (!name || !key) {
    throw new Error('Název a Klíč jsou povinné.');
  }

  const questions = JSON.parse(questionsJson);

  await prisma.campaign.create({
    data: {
      name,
      key,
      description,
      webhook_url,
      questions: {
        create: questions.map((q: any) => ({
          question_index: q.question_index,
          question_type: q.question_type,
          question_text: q.question_text,
          html_template: q.html_template, // We can auto-generate or leave empty for now
          allowed_options: q.allowed_options,
        }))
      }
    }
  });

  revalidatePath('/campaigns');
}

export async function deleteCampaign(campaignId: number) {
  // Using soft delete
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { archived: true, is_active: false }
  });
  revalidatePath('/campaigns');
}

export async function triggerN8nWebhook(campaignId: number) {
  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign || !campaign.webhook_url) {
    throw new Error('Kampaň nemá nastavený Webhook URL.');
  }

  try {
    const res = await fetch(campaign.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaign_id: campaign.id,
        campaign_key: campaign.key,
        action: 'START_CAMPAIGN'
      })
    });
    if (!res.ok) {
      throw new Error(`Webhook failed with status: ${res.status}`);
    }
  } catch (error) {
    console.error('Failed to trigger n8n:', error);
    throw new Error('Nepodařilo se spustit webhook v n8n.');
  }
}

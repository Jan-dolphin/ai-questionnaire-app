'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCampaign(formData: FormData, questionsJson: string) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const webhook_url = formData.get('webhook_url') as string; // still capturing it since it's passed from form
  
  if (!name) {
    throw new Error('Název je povinný.');
  }

  const questions = JSON.parse(questionsJson);

  // Vytvoříme kampaň s dočasným klíčem
  const campaign = await prisma.campaign.create({
    data: {
      name,
      key: `TEMP-${Date.now()}-${Math.random()}`,
      description,
      webhook_url,
      status: 'draft',
      questions: {
        create: questions.map((q: any) => ({
          question_index: q.question_index,
          question_type: q.question_type,
          question_text: q.question_text,
          html_template: q.html_template, 
          allowed_options: q.allowed_options,
        }))
      }
    }
  });

  // Nyní, když známe její ID, aktualizujeme klíč na čistý formát
  await prisma.campaign.update({
    where: { id: campaign.id },
    data: { key: `CAMP-${campaign.id}` }
  });

  revalidatePath('/campaigns');
}

export async function updateCampaign(campaignId: number, formData: FormData, questionsJson: string) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const webhook_url = formData.get('webhook_url') as string;
  
  if (!name) {
    throw new Error('Název je povinný.');
  }

  const questions = JSON.parse(questionsJson);

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId }});
  if (!campaign || campaign.status !== 'draft') {
    throw new Error('Lze upravovat pouze kampaně ve stavu Příprava.');
  }

  await prisma.$transaction([
    prisma.question.deleteMany({ where: { campaign_id: campaignId } }),
    prisma.campaign.update({
      where: { id: campaignId },
      data: {
        name,
        description,
        webhook_url,
        questions: {
          create: questions.map((q: any) => ({
            question_index: q.question_index,
            question_type: q.question_type,
            question_text: q.question_text,
            html_template: q.html_template, 
            allowed_options: q.allowed_options,
          }))
        }
      }
    })
  ]);

  revalidatePath('/campaigns');
}

export async function deleteCampaign(campaignId: number) {
  await prisma.campaign.delete({
    where: { id: campaignId }
  });
  revalidatePath('/campaigns');
}

export async function stopCampaign(campaignId: number) {
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: 'completed' }
  });
  revalidatePath('/campaigns');
}

export async function triggerN8nWebhook(campaignId: number) {
  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) {
    throw new Error('Kampaň nebyla nalezena.');
  }
  
  if (campaign.status === 'completed') {
    throw new Error('Dokončenou kampaň nelze znovu spustit.');
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL || campaign.webhook_url;
  if (!webhookUrl) {
    throw new Error('Není nastaven n8n Webhook URL v .env souboru.');
  }

  try {
    const res = await fetch(webhookUrl, {
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

    // Po úspěšném volání webhooku změníme stav na running
    if (campaign.status === 'draft') {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'running' }
      });
      revalidatePath('/campaigns');
    }

  } catch (error) {
    console.error('Failed to trigger n8n:', error);
    throw new Error('Nepodařilo se spustit webhook v n8n.');
  }
}

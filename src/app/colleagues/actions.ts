'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleColleagueActive(id: number, currentStatus: boolean) {
  await prisma.colleague.update({
    where: { id },
    data: { active: !currentStatus }
  });
  
  revalidatePath('/colleagues');
  // Also revalidate campaigns page since active colleagues are loaded in CampaignForm
  revalidatePath('/campaigns');
}

export async function deleteColleague(id: number) {
  // 1. Delete sessions tied to 'draft' campaigns
  const draftSessions = await prisma.session.findMany({
    where: {
      colleague_id: id,
      campaign: {
        status: 'draft'
      }
    }
  });

  if (draftSessions.length > 0) {
    await prisma.session.deleteMany({
      where: {
        id: { in: draftSessions.map(s => s.id) }
      }
    });
  }

  // 2. Check remaining sessions
  const remainingSessionsCount = await prisma.session.count({
    where: { colleague_id: id }
  });

  if (remainingSessionsCount === 0) {
    // Varianta A: Zaměstnanec už nefiguruje v žádné další kampani -> Hard Delete
    await prisma.colleague.delete({
      where: { id }
    });
  } else {
    // Varianta B: Zaměstnanec figuruje v probíhající nebo ukončené kampani -> Soft Delete
    await prisma.colleague.update({
      where: { id },
      data: { 
        archived: true, 
        active: false 
      }
    });
  }

  revalidatePath('/colleagues');
  revalidatePath('/campaigns');
}

export async function createColleague(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  
  if (!name || !email) {
    throw new Error('Jméno a email jsou povinné.');
  }

  const existing = await prisma.colleague.findUnique({
    where: { email }
  });
  
  if (existing) {
    if (existing.archived) {
      // Zaměstnanec byl dříve smazán (soft-delete), obnovíme ho
      await prisma.colleague.update({
        where: { id: existing.id },
        data: {
          name, // Aktualizujeme jméno, kdyby se změnilo
          active: true,
          archived: false
        }
      });
      revalidatePath('/colleagues');
      revalidatePath('/campaigns');
      return;
    } else {
      throw new Error('Tento email již existuje a uživatel je aktivní.');
    }
  }

  await prisma.colleague.create({
    data: {
      name,
      email,
      active: true,
      archived: false
    }
  });

  revalidatePath('/colleagues');
  revalidatePath('/campaigns');
}

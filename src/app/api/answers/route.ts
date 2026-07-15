import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { campaign_key, colleague_email, answers } = data;

    if (!campaign_key || !colleague_email || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { key: campaign_key }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const colleague = await prisma.colleague.findUnique({
      where: { email: colleague_email }
    });

    if (!colleague) {
      return NextResponse.json({ error: 'Colleague not found' }, { status: 404 });
    }

    // Upsert the session
    const session = await prisma.session.findFirst({
      where: {
        campaign_id: campaign.id,
        colleague_id: colleague.id
      }
    });

    if (session) {
      await prisma.session.update({
        where: { id: session.id },
        data: {
          answers: JSON.stringify(answers),
          status: 'completed',
        }
      });
    } else {
      await prisma.session.create({
        data: {
          campaign_id: campaign.id,
          colleague_id: colleague.id,
          answers: JSON.stringify(answers),
          status: 'completed'
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Answers saved' });

  } catch (error) {
    console.error('Error saving answers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

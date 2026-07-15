import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Clear old data to prevent duplicates
  await prisma.session.deleteMany();
  await prisma.question.deleteMany();
  await prisma.campaign.deleteMany();
  // colleagues and users can use upsert or deleteMany, but upsert is fine for them.

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@dolphin.cz' },
    update: {},
    create: {
      email: 'admin@dolphin.cz',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin'
    }
  });

  // Colleagues
  const ondrej = await prisma.colleague.upsert({
    where: { email: 'ondrej.bronec@dolphinconsulting.cz' },
    update: {},
    create: {
      name: 'Ondřej Bronec',
      email: 'ondrej.bronec@dolphinconsulting.cz',
      last_notified: new Date('2026-06-23T05:30:33.000Z'),
    },
  })
  
  const janP = await prisma.colleague.upsert({
    where: { email: 'jan.petr@dolphinconsulting.cz' },
    update: {},
    create: {
      name: 'Jan Petr',
      email: 'jan.petr@dolphinconsulting.cz',
      last_notified: new Date('2026-06-30T14:06:38.000Z'),
    },
  })

  const janM = await prisma.colleague.upsert({
    where: { email: 'jan.marusak@dolphinconsulting.cz' },
    update: {},
    create: {
      name: 'Jan Marušák',
      email: 'jan.marusak@dolphinconsulting.cz',
      last_notified: new Date('2026-06-30T16:09:38.000Z'),
    },
  })

  // Campaign
  const campaign = await prisma.campaign.upsert({
    where: { key: 'survey_satisfaction_2026' },
    update: {},
    create: {
      key: 'survey_satisfaction_2026',
      name: 'Spokojenost ve firmě 2026',
      description: 'Základní průzkum spokojenosti a firemní kultury.',
    },
  })

  // Questions
  await prisma.question.createMany({
    data: [
      {
        campaign_id: campaign.id,
        question_index: 1,
        question_type: 'single_choice',
        question_text: 'How satisfied are you overall with working at our company?',
        html_template: '<p>Question 1...</p>',
        allowed_options: JSON.stringify({"A": "Very satisfied", "B": "Satisfied", "C": "Somewhat dissatisfied", "D": "Very dissatisfied"})
      },
      {
        campaign_id: campaign.id,
        question_index: 2,
        question_type: 'multi_choice',
        question_text: 'Which areas of work do you find most fulfilling?',
        html_template: '<p>Question 2...</p>',
        allowed_options: JSON.stringify({"A": "People and a great team", "B": "Interesting work content", "C": "Flexibility", "D": "Compensation", "E": "Technology"})
      },
      {
        campaign_id: campaign.id,
        question_index: 3,
        question_type: 'open',
        question_text: 'Is there anything specific you would change or improve about our company?',
        html_template: '<p>Question 3...</p>',
        allowed_options: null
      }
    ]
  })

  // Sessions
  await prisma.session.create({
    data: {
      colleague_id: janM.id,
      campaign_id: campaign.id,
      status: 'completed',
      current_question_index: 5,
      answers: JSON.stringify({
        "1": "Very satisfied",
        "2": "People and a great team, Flexibility",
        "3": "I would like to have more cookies"
      }),
      started_at: new Date('2026-06-30T14:08:52.000Z'),
      updated_at: new Date('2026-07-01T06:14:56.000Z')
    }
  })

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.colleague.createMany({
    data: [
      { name: 'Jan Petr', email: 'jan.petr@dolphinconsulting.cz' },
      { name: 'Anna Nováková', email: 'anna.novakova@dolphinconsulting.cz' },
      { name: 'Petr Dvořák', email: 'petr.dvorak@dolphinconsulting.cz' }
    ]
  });
  console.log('Seeded 3 colleagues');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

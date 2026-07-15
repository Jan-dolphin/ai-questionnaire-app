const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin', 10);
  await prisma.user.upsert({
    where: { email: 'admin@dolphinconsulting.cz' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@dolphinconsulting.cz',
      password: hashedPassword,
      name: 'Administrátor',
      role: 'admin'
    }
  });
  console.log('Vytvořen uživatel admin@dolphinconsulting.cz s heslem admin');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

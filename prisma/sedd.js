const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Delete all users before inserting new
  // await prisma.user.deleteMany({});

  const users = [
    {
      name: 'Jose Villa',
      email: 'Jose.devs@gmail.com',
    },
    {
      name: 'Jose delgado',
      email: 'Jos.delgado@hotmail.com',
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
    console.log(`Usuario creado: ${user.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

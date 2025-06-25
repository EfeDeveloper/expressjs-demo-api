const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clean the tables in dependencies order
  await prisma.appointment.deleteMany({});
  await prisma.timeBlock.deleteMany({});
  await prisma.user.deleteMany({});

  // Create test users
  const users = [
    {
      name: 'Jose Villa',
      email: 'Jose.devs@gmail.com',
      password: await bcrypt.hash('password123', 10),
      role: 'ADMIN',
    },
    {
      name: 'Jose Delgado',
      email: 'Jos.delgado@hotmail.com',
      password: await bcrypt.hash('password456', 10),
      role: 'USER',
    },
  ];

  const createdUsers = [];
  for (const user of users) {
    const created = await prisma.user.create({ data: user });
    createdUsers.push(created);
    console.log(`Usuario creado: ${created.name}`);
  }

  // Create test time blocks
  const timeBlocks = [
    {
      startTime: new Date('2025-07-01T09:00:00Z'),
      endTime: new Date('2025-07-01T10:00:00Z'),
    },
    {
      startTime: new Date('2025-07-01T10:00:00Z'),
      endTime: new Date('2025-07-01T11:00:00Z'),
    },
  ];

  const createdTimeBlocks = [];
  for (const block of timeBlocks) {
    const created = await prisma.timeBlock.create({ data: block });
    createdTimeBlocks.push(created);
    console.log(`TimeBlock creado: ${created.id}`);
  }

  //Create test quotes
  await prisma.appointment.createMany({
    data: [
      {
        date: new Date('2025-07-01T09:00:00Z'),
        userId: createdUsers[0].id,
        timeBlockId: createdTimeBlocks[0].id,
      },
      {
        date: new Date('2025-07-01T10:00:00Z'),
        userId: createdUsers[1].id,
        timeBlockId: createdTimeBlocks[1].id,
      },
    ],
  });

  console.log('Test data inserted correctly.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

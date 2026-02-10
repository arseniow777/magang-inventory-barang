import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');
  
  // Tambahkan seed data disini nanti
  // Contoh:
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'admin@example.com',
  //     name: 'Admin User',
  //   },
  // });
  
  console.log('✅ Seeding completed');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
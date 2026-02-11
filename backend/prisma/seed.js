import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.users.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      employee_id: "EMP001",
      username: "admin",
      name: "Administrator",
      role: "admin",
      password_hash: passwordHash,
    },
  });

  console.log("1 akun admin dibuat");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
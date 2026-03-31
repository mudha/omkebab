import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = "mudha";
  const password = "Tawakkal09";
  const name = "Mudha (Superadmin)";
  
  const existing = await prisma.user.findUnique({
    where: { username }
  });

  if (existing) {
    console.log(`User ${username} already exists.`);
    return;
  }

  const passwordHash = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      passwordHash,
      role: "ADMIN",
      isActive: true
    }
  });

  console.log("Superadmin user created:", user.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

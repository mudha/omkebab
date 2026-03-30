import { PrismaClient, Role, SalesMethod } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create branches
  const cabang1 = await prisma.branch.upsert({
    where: { id: 'branch-1' },
    update: {},
    create: {
      id: 'branch-1',
      name: 'Cabang 1',
    },
  });

  const cabang2 = await prisma.branch.upsert({
    where: { id: 'branch-2' },
    update: {},
    create: {
      id: 'branch-2',
      name: 'Cabang 2',
    },
  });

  console.log('✅ Branches created:', cabang1.name, cabang2.name);

  // Create users
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Administrator',
      username: 'admin',
      passwordHash: hashSync('admin123', 10),
      role: Role.ADMIN,
      branchId: null,
    },
  });

  const karyawan1 = await prisma.user.upsert({
    where: { username: 'karyawan1' },
    update: {},
    create: {
      name: 'Karyawan Cabang 1',
      username: 'karyawan1',
      passwordHash: hashSync('karyawan123', 10),
      role: Role.EMPLOYEE,
      branchId: cabang1.id,
    },
  });

  const karyawan2 = await prisma.user.upsert({
    where: { username: 'karyawan2' },
    update: {},
    create: {
      name: 'Karyawan Cabang 2',
      username: 'karyawan2',
      passwordHash: hashSync('karyawan123', 10),
      role: Role.EMPLOYEE,
      branchId: cabang2.id,
    },
  });

  console.log('✅ Users created:', admin.name, karyawan1.name, karyawan2.name);

  // Create products
  const products = [
    { name: 'Kebab Original', price: 15000 },
    { name: 'Kebab Spicy', price: 17000 },
    { name: 'Kebab Keju', price: 18000 },
    { name: 'Kebab BBQ', price: 17000 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: `product-${product.name.toLowerCase().replace(/\s/g, '-')}` },
      update: {},
      create: {
        id: `product-${product.name.toLowerCase().replace(/\s/g, '-')}`,
        name: product.name,
        price: product.price,
        isActive: true,
      },
    });
  }

  console.log('✅ Products created:', products.map(p => p.name).join(', '));

  // Create sample transactions
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const trx1 = await prisma.transaction.create({
    data: {
      transactionNumber: `TRX-${formatDate(yesterday)}-0001`,
      branchId: cabang1.id,
      salesMethod: SalesMethod.OFFLINE,
      totalAmount: 50000,
      createdByUserId: karyawan1.id,
      createdAt: yesterday,
      items: {
        create: [
          {
            productId: 'product-kebab-original',
            productNameSnapshot: 'Kebab Original',
            priceSnapshot: 15000,
            quantity: 2,
            subtotal: 30000,
          },
          {
            productId: 'product-kebab-keju',
            productNameSnapshot: 'Kebab Keju',
            priceSnapshot: 18000,
            quantity: 1,
            subtotal: 18000,
          },
        ],
      },
    },
  });

  const trx2 = await prisma.transaction.create({
    data: {
      transactionNumber: `TRX-${formatDate(today)}-0001`,
      branchId: cabang2.id,
      salesMethod: SalesMethod.GRABFOOD,
      totalAmount: 34000,
      createdByUserId: karyawan2.id,
      createdAt: today,
      items: {
        create: [
          {
            productId: 'product-kebab-spicy',
            productNameSnapshot: 'Kebab Spicy',
            priceSnapshot: 17000,
            quantity: 2,
            subtotal: 34000,
          },
        ],
      },
    },
  });

  console.log('✅ Sample transactions created:', trx1.transactionNumber, trx2.transactionNumber);
  console.log('🎉 Seeding completed!');
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create superadmin
  const superadminEmail = 'superadmin@anonymous.io';
  const superadminExists = await prisma.user.findUnique({ where: { email: superadminEmail } });

  if (!superadminExists) {
    const hashed = await bcrypt.hash('super123', 12);
    await prisma.user.create({
      data: {
        username: 'superadmin',
        email: superadminEmail,
        password: hashed,
        role: 'superadmin',
      },
    });
    console.log('[Seed] Superadmin created: superadmin@anonymous.io / super123');
  } else {
    await prisma.user.update({
      where: { email: superadminEmail },
      data: { email: superadminEmail },
    });
    console.log('[Seed] Superadmin already exists');
  }

  // Create regular admin
  const adminEmail = 'admin@anonymous.io';
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
      data: {
        username: 'admin',
        email: adminEmail,
        password: hashed,
        role: 'admin',
      },
    });
    console.log('[Seed] Admin created: admin@anonymous.io / admin123');
  } else {
    console.log('[Seed] Admin already exists');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

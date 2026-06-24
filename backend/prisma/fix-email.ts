import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const u = await p.user.findUnique({ where: { username: 'superadmin' } });
  if (u) {
    await p.user.update({ where: { id: u.id }, data: { email: 'superadmin@anonymous.io' } });
    console.log('Fixed email');
  } else {
    console.log('Not found');
  }
}
main().finally(() => p.$disconnect());

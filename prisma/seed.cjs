const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@mymag.local'
  const adminPassword = 'admin123'
  const passwordHash = bcrypt.hashSync(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      role: 'ADMIN',
      passwordHash,
    },
  })

  const articles = [
    { code: 'ART-001', description: 'Scatola cartone 30x30', price: 2.5, stock: 100 },
    { code: 'ART-002', description: 'Nastro adesivo trasparente', price: 1.2, stock: 250 },
  ]

  for (const a of articles) {
    await prisma.article.upsert({
      where: { code: a.code },
      update: { description: a.description, price: a.price, stock: a.stock },
      create: a,
    })
  }

  const customerEmail = 'acme@example.com'
  await prisma.customer.upsert({
    where: { email: customerEmail },
    update: { name: 'Acme S.p.A.' },
    create: { name: 'Acme S.p.A.', email: customerEmail, phone: '02 1234567' },
  })

  console.log('\nSeed completato:')
  console.log(`- Utente admin: ${adminEmail} / ${adminPassword}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

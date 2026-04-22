import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 1. Création des catégories par défaut
  const categories = [
    { slug: 'mecanique-generale', nameFr: 'Mécanique Générale', nameAr: 'ميكانيك عام', icon: 'Wrench' },
    { slug: 'electricite-auto', nameFr: 'Électricité Automobile', nameAr: 'كهربائي السيارات', icon: 'Zap' },
    { slug: 'depannage-remorquage', nameFr: 'Dépannage & Remorquage', nameAr: 'سحب ونجدة', icon: 'Truck' },
    { slug: 'toles-et-peinture', nameFr: 'Tôlerie & Peinture', nameAr: 'صباغة وسمكرة', icon: 'PaintRoller' },
    { slug: 'climatisation', nameFr: 'Climatisation', nameAr: 'تكييف الهواء', icon: 'ThermometerSnowflake' },
    { slug: 'diagnostic-electronique', nameFr: 'Diagnostic Électronique', nameAr: 'فحص إلكتروني', icon: 'Activity' },
    { slug: 'pneus-et-jantes', nameFr: 'Pneus & Jantes', nameAr: 'إطارات وجنوط', icon: 'Circle' },
    { slug: 'vidange-et-filtres', nameFr: 'Vidange & Filtres', nameAr: 'تغيير الزيت والفلاتر', icon: 'Droplet' },
    { slug: 'pieces-de-rechange', nameFr: 'Pièces de Rechange', nameAr: 'قطع غيار', icon: 'Package' },
    { slug: 'lavage-auto', nameFr: 'Lavage Auto', nameAr: 'غسيل سيارات', icon: 'Sparkles' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // 2. Création de l'Admin par défaut
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)
  await prisma.user.upsert({
    where: { phone: process.env.ADMIN_PHONE || '0600000000' },
    update: {},
    create: {
      phone: process.env.ADMIN_PHONE || '0600000000',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  })

  console.log('✅ Seed terminé : Catégories et Admin créés.')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())

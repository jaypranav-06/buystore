import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing broken image URL...');

  // Update the Satin Blouse image URL
  const updated = await prisma.product.updateMany({
    where: {
      image_url: 'https://images.unsplash.com/photo-1564257577-7fd7d28c68b7?w=800',
    },
    data: {
      image_url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800',
    },
  });

  console.log(`✅ Updated ${updated.count} product(s) with new image URL`);
}

main()
  .catch((e) => {
    console.error('❌ Error fixing image:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

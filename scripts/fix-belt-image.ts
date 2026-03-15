import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing broken Leather Belt image URL...');

  // Update the Leather Belt image URL
  const updated = await prisma.product.updateMany({
    where: {
      image_url: 'https://images.unsplash.com/photo-1624222247344-550fb60583e2?w=800',
    },
    data: {
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
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

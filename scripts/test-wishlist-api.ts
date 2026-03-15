import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Testing wishlist API logic...\n');

  const userId = 1; // Test customer

  console.log(`Testing for user ID: ${userId}`);

  // Simulate the exact query from the API
  const wishlistItems = await prisma.cartItem.findMany({
    where: {
      user_id: userId,
      item_type: 'wishlist',
    },
    include: {
      product: {
        include: {
          category: true,
          reviews: {
            where: { is_approved: true },
            select: { rating: true },
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  console.log(`\n📊 Found ${wishlistItems.length} wishlist items\n`);

  // Process like the API does
  const wishlistWithRating = wishlistItems.map((item) => {
    const reviews = item.product?.reviews || [];
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      ...item,
      product: item.product ? {
        ...item.product,
        price: Number(item.product.price),
        discount_price: item.product.discount_price ? Number(item.product.discount_price) : null,
        avgRating,
        reviewCount: reviews.length,
      } : null,
    };
  });

  console.log('📦 Processed wishlist data:');
  console.log(JSON.stringify(wishlistWithRating, null, 2));
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

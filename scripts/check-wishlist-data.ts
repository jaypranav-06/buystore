import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking wishlist data...\n');

  // Check all users
  const users = await prisma.user.findMany({
    select: {
      user_id: true,
      email: true,
      first_name: true,
      last_name: true,
    },
  });

  console.log('📋 Users in database:');
  users.forEach(user => {
    console.log(`  - ID: ${user.user_id}, Email: ${user.email}, Name: ${user.first_name} ${user.last_name}`);
  });

  // Check all wishlist items
  const wishlistItems = await prisma.cartItem.findMany({
    where: {
      item_type: 'wishlist',
    },
    include: {
      product: {
        select: {
          product_name: true,
        },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  console.log('\n💝 Wishlist items in database:');
  if (wishlistItems.length === 0) {
    console.log('  No wishlist items found!');
  } else {
    wishlistItems.forEach(item => {
      console.log(`  - User: ${item.user.email}, Product: ${item.product?.product_name}, Qty: ${item.quantity}`);
    });
  }

  // Check all cart items (for comparison)
  const allCartItems = await prisma.cartItem.findMany({
    select: {
      id: true,
      user_id: true,
      product_id: true,
      item_type: true,
    },
  });

  console.log('\n🛒 All cart_items records:');
  if (allCartItems.length === 0) {
    console.log('  No cart items found!');
  } else {
    allCartItems.forEach(item => {
      console.log(`  - ID: ${item.id}, User ID: ${item.user_id}, Product ID: ${item.product_id}, Type: ${item.item_type}`);
    });
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    console.log('🔍 Fetching all products from Supabase database...\n');

    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        product_id: 'asc',
      },
    });

    console.log(`📦 Total Products: ${products.length}\n`);
    console.log('=' .repeat(100));

    if (products.length === 0) {
      console.log('❌ No products found in the database!');
      return;
    }

    products.forEach((product, index) => {
      console.log(`\n${index + 1}. Product ID: ${product.product_id}`);
      console.log(`   Name: ${product.product_name}`);
      console.log(`   Category: ${product.category?.category_name || 'No Category'}`);
      console.log(`   Price: Rs ${product.price.toFixed(2)}`);
      console.log(`   Discount Price: ${product.discount_price ? `Rs ${product.discount_price.toFixed(2)}` : 'None'}`);
      console.log(`   Stock: ${product.stock_quantity} units`);
      console.log(`   Status: ${product.is_active ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   Image: ${product.image_url ? '✅ Has Image' : '❌ No Image'}`);
      console.log(`   Created: ${product.created_at.toISOString().split('T')[0]}`);
    });

    console.log('\n' + '='.repeat(100));
    console.log('\n📊 Summary:');
    console.log(`   Total Products: ${products.length}`);
    console.log(`   Active Products: ${products.filter(p => p.is_active).length}`);
    console.log(`   Inactive Products: ${products.filter(p => !p.is_active).length}`);
    console.log(`   In Stock: ${products.filter(p => p.stock_quantity > 0).length}`);
    console.log(`   Out of Stock: ${products.filter(p => p.stock_quantity === 0).length}`);
    console.log(`   With Images: ${products.filter(p => p.image_url).length}`);
    console.log(`   Without Images: ${products.filter(p => !p.image_url).length}`);
    console.log(`   With Discounts: ${products.filter(p => p.discount_price).length}`);

    // Category breakdown
    const categoryCounts = products.reduce((acc, p) => {
      const catName = p.category?.category_name || 'Uncategorized';
      acc[catName] = (acc[catName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📂 Products by Category:');
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} products`);
    });

  } catch (error) {
    console.error('❌ Error fetching products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();

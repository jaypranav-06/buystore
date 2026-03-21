import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addKeywordsToProducts() {
  try {
    console.log('🔍 Fetching all products...');

    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    console.log(`📦 Found ${products.length} products\n`);

    for (const product of products) {
      // Generate keywords based on product name, description, and category
      const keywords = generateKeywords(
        product.product_name,
        product.description,
        product.category?.category_name
      );

      console.log(`\n📝 Product: ${product.product_name}`);
      console.log(`   Category: ${product.category?.category_name || 'N/A'}`);
      console.log(`   Keywords: ${keywords}`);

      // Update product with keywords
      await prisma.product.update({
        where: { product_id: product.product_id },
        data: { keywords },
      });

      console.log(`   ✅ Updated!`);
    }

    console.log('\n\n🎉 All products updated with keywords!');
  } catch (error) {
    console.error('❌ Error adding keywords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function generateKeywords(
  productName: string,
  description: string | null,
  categoryName: string | undefined
): string {
  const keywords: string[] = [];

  // Extract words from product name
  const nameWords = productName.toLowerCase().split(/[\s-]+/);
  keywords.push(...nameWords);

  // Add category-based keywords
  if (categoryName) {
    const categoryLower = categoryName.toLowerCase();
    keywords.push(categoryLower);

    // Add category-specific keywords
    if (categoryLower.includes('men')) {
      keywords.push('mens', 'male', 'guys', 'gents');
    }
    if (categoryLower.includes('women')) {
      keywords.push('womens', 'female', 'ladies', 'girls');
    }
    if (categoryLower.includes('clothing')) {
      keywords.push('clothes', 'apparel', 'wear', 'fashion', 'outfit');
    }
    if (categoryLower.includes('accessories')) {
      keywords.push('accessory', 'add-ons');
    }
    if (categoryLower.includes('shoes') || categoryLower.includes('footwear')) {
      keywords.push('shoes', 'footwear', 'kicks');
    }
    if (categoryLower.includes('kids')) {
      keywords.push('children', 'child', 'youth');
    }
    if (categoryLower.includes('electronics')) {
      keywords.push('electronic', 'tech', 'gadget', 'device');
    }
    if (categoryLower.includes('home')) {
      keywords.push('household', 'decor', 'interior');
    }
    if (categoryLower.includes('sports')) {
      keywords.push('athletic', 'fitness', 'workout', 'exercise');
    }
  }

  // Add product-type specific keywords based on common patterns
  const nameLower = productName.toLowerCase();

  // Clothing types
  if (nameLower.includes('shirt') || nameLower.includes('t-shirt') || nameLower.includes('tshirt')) {
    keywords.push('tshirt', 'tee', 'top', 'casual', 'comfortable', 'everyday');
  }
  if (nameLower.includes('jean') || nameLower.includes('denim')) {
    keywords.push('jeans', 'denim', 'pants', 'trousers', 'casual', 'bottom', 'streetwear');
  }
  if (nameLower.includes('dress')) {
    keywords.push('frock', 'gown', 'formal', 'party', 'elegant', 'occasion');
  }
  if (nameLower.includes('jacket') || nameLower.includes('coat')) {
    keywords.push('outerwear', 'layering', 'winter', 'warm');
  }
  if (nameLower.includes('shoe') || nameLower.includes('sneaker')) {
    keywords.push('shoes', 'footwear', 'sneakers', 'kicks', 'trainers', 'comfortable');
  }
  if (nameLower.includes('bag') || nameLower.includes('backpack')) {
    keywords.push('bag', 'carry', 'storage', 'travel', 'accessory');
  }
  if (nameLower.includes('watch')) {
    keywords.push('timepiece', 'wristwatch', 'accessory', 'jewelry');
  }
  if (nameLower.includes('cap') || nameLower.includes('hat')) {
    keywords.push('headwear', 'accessory', 'casual');
  }

  // Material keywords
  if (nameLower.includes('cotton')) {
    keywords.push('cotton', 'soft', 'breathable', 'natural', 'comfortable');
  }
  if (nameLower.includes('leather')) {
    keywords.push('leather', 'premium', 'durable', 'classic');
  }
  if (nameLower.includes('denim')) {
    keywords.push('denim', 'sturdy', 'casual');
  }
  if (nameLower.includes('silk')) {
    keywords.push('silk', 'smooth', 'elegant', 'luxurious');
  }

  // Style keywords
  if (nameLower.includes('casual')) {
    keywords.push('casual', 'everyday', 'relaxed', 'comfortable', 'informal');
  }
  if (nameLower.includes('formal')) {
    keywords.push('formal', 'dressy', 'professional', 'office', 'business');
  }
  if (nameLower.includes('sport') || nameLower.includes('athletic')) {
    keywords.push('sporty', 'athletic', 'active', 'fitness', 'gym');
  }
  if (nameLower.includes('vintage') || nameLower.includes('retro')) {
    keywords.push('vintage', 'retro', 'classic', 'timeless');
  }

  // Color keywords from description or name
  const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'pink', 'purple', 'gray', 'brown'];
  colors.forEach(color => {
    if (nameLower.includes(color) || description?.toLowerCase().includes(color)) {
      keywords.push(color);
    }
  });

  // Season keywords
  if (nameLower.includes('summer') || description?.toLowerCase().includes('summer')) {
    keywords.push('summer', 'warm', 'light', 'breathable');
  }
  if (nameLower.includes('winter') || description?.toLowerCase().includes('winter')) {
    keywords.push('winter', 'cold', 'warm', 'cozy');
  }

  // Remove duplicates and empty strings
  const uniqueKeywords = [...new Set(keywords)].filter(k => k && k.length > 0);

  return uniqueKeywords.join(', ');
}

// Run the script
addKeywordsToProducts();

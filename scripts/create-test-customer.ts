import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🛍️  Creating test customer user...');

  const testEmail = 'customer@test.com';

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (existingUser) {
    console.log('⏭  Test customer already exists');
    console.log('\n📧 Email: customer@test.com');
    console.log('🔑 Password: password123');
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create test customer
  const customer = await prisma.user.create({
    data: {
      first_name: 'Test',
      last_name: 'Customer',
      email: testEmail,
      password_hash: hashedPassword,
      phone: '555-1234',
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zip_code: '12345',
      country: 'Test Country',
    },
  });

  console.log('✅ Test customer created successfully!');
  console.log('\n👤 Customer Details:');
  console.log('📧 Email: customer@test.com');
  console.log('🔑 Password: password123');
  console.log(`🆔 User ID: ${customer.user_id}`);
  console.log('\n🛒 You can now:');
  console.log('1. Sign in at http://localhost:3000/signin');
  console.log('2. Browse products and add to wishlist');
  console.log('3. Add items to cart and checkout');
}

main()
  .catch((e) => {
    console.error('❌ Error creating test customer:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

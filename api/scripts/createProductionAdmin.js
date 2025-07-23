const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

async function createProductionAdmin() {
  try {
    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
      console.log('Set them using:');
      console.log('ADMIN_EMAIL=your-admin@email.com');
      console.log('ADMIN_PASSWORD=your-secure-password');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await prisma.users.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists`);
      
      // Update to admin role if not already admin
      if (existingAdmin.role !== 'admin') {
        await prisma.users.update({
          where: { email: adminEmail },
          data: { role: 'admin' }
        });
        console.log(`User ${adminEmail} role updated to admin`);
      }
      return;
    }

    // Validate password
    if (adminPassword.length < 8) {
      console.error('Error: Admin password must be at least 8 characters long');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const adminUser = await prisma.users.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log(`✅ Production admin user created successfully!`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`ID: ${adminUser.id}`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`Created at: ${adminUser.created_at}`);

  } catch (error) {
    console.error('❌ Error creating production admin:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run only if called directly (not imported)
if (require.main === module) {
  createProductionAdmin();
}

module.exports = createProductionAdmin;

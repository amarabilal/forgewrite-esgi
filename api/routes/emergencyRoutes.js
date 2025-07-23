const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

const router = express.Router();

// Emergency admin creation route - ONLY for production setup
// Should be disabled after initial admin is created
router.post('/emergency-admin', async (req, res) => {
  try {
    // Check if emergency admin creation is enabled
    if (process.env.ENABLE_EMERGENCY_ADMIN !== 'true') {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Check if any admin exists
    const existingAdmin = await prisma.users.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      return res.status(403).json({ 
        message: 'Admin already exists. Emergency admin creation is disabled.' 
      });
    }

    const { email, password, emergencyKey } = req.body;

    // Verify emergency key
    if (emergencyKey !== process.env.EMERGENCY_ADMIN_KEY) {
      return res.status(403).json({ message: 'Invalid emergency key' });
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const adminUser = await prisma.users.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'admin'
      },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true
      }
    });

    res.status(201).json({
      message: 'Emergency admin created successfully',
      user: adminUser
    });

  } catch (error) {
    console.error('Emergency admin creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

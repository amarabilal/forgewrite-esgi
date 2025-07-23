const prisma = require('../../config/db');

// Admin: CRUD for Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        // Don't include password and sensitive data
        _count: {
          select: {
            books: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json({ message: 'All users fetched successfully.', data: users });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid user ID.' });
  
  try {
    const user = await prisma.users.findUnique({ 
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            books: true
          }
        },
        books: {
          select: {
            id: true,
            title: true,
            genre: true,
            status: true,
            created_at: true
          }
        }
      }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User fetched successfully.', data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, role = 'member' } = req.body;
  
  if (!email || !email.trim()) return res.status(400).json({ message: 'Email is required.' });
  if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  
  try {
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({ 
      data: { 
        email: email.trim().toLowerCase(), 
        password: hashedPassword,
        role: role
      },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true
      }
    });
    
    res.status(201).json({ message: 'User created successfully.', data: user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid user ID.' });
  
  const { email, role, password } = req.body;
  
  try {
    // Check if user exists
    const existingUser = await prisma.users.findUnique({ where: { id } });
    if (!existingUser) return res.status(404).json({ message: 'User not found.' });

    // Check if email is already used by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.users.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (emailExists) {
        return res.status(409).json({ message: 'Email already in use by another user.' });
      }
    }

    // Prepare update data
    const updateData = {};
    if (email) updateData.email = email.trim().toLowerCase();
    if (role) updateData.role = role;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(password, 12);
    }
    updateData.updated_at = new Date();

    const user = await prisma.users.update({ 
      where: { id }, 
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true
      }
    });
    
    res.json({ message: 'User updated successfully.', data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid user ID.' });
  
  try {
    // Check if user exists
    const existingUser = await prisma.users.findUnique({ where: { id } });
    if (!existingUser) return res.status(404).json({ message: 'User not found.' });

    // Prevent deleting admin users (self-protection)
    if (existingUser.role === 'admin' && existingUser.id === req.user.userId) {
      return res.status(403).json({ message: 'Cannot delete your own admin account.' });
    }

    // Delete user and cascade delete all related data
    // Prisma will handle the cascade deletion for books and their related data
    // based on the onDelete: Cascade settings in the schema
    await prisma.users.delete({ where: { id } });
    
    res.json({ message: 'User and all associated data deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.code === 'P2003') {
      res.status(400).json({ message: 'Cannot delete user with existing dependencies.' });
    } else {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await prisma.users.count();
    const adminUsers = await prisma.users.count({ where: { role: 'admin' } });
    const memberUsers = await prisma.users.count({ where: { role: 'member' } });
    
    // Users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await prisma.users.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo
        }
      }
    });

    const stats = {
      total: totalUsers,
      admins: adminUsers,
      members: memberUsers,
      recentlyCreated: recentUsers
    };

    res.json({ message: 'User statistics fetched successfully.', data: stats });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const chapterRoutes = require('./src/routes/chapterRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const characterRoutes = require('./src/routes/characterRoutes');
const mapItemRoutes = require('./src/routes/mapItemRoutes');
const statRoutes = require('./src/routes/statRoutes');

// Admin routes
const adminUserRoutes = require('./src/routes/adminUserRoutes');
const adminBookRoutes = require('./src/routes/adminBookRoutes');
const adminChapterRoutes = require('./src/routes/adminChapterRoutes');
const adminCharacterRoutes = require('./src/routes/adminCharacterRoutes');
const adminCommentRoutes = require('./src/routes/adminCommentRoutes');
const adminMapItemRoutes = require('./src/routes/adminMapItemRoutes');
const adminNoteRoutes = require('./src/routes/adminNoteRoutes');
const adminStatRoutes = require('./src/routes/adminStatRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'https://www.forgewrite.fr',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/map-items', mapItemRoutes);
app.use('/api/stats', statRoutes);

// Admin routes
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/books', adminBookRoutes);
app.use('/api/admin/chapters', adminChapterRoutes);
app.use('/api/admin/characters', adminCharacterRoutes);
app.use('/api/admin/comments', adminCommentRoutes);
app.use('/api/admin/map-items', adminMapItemRoutes);
app.use('/api/admin/notes', adminNoteRoutes);
app.use('/api/admin/stats', adminStatRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Auth API is running!');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

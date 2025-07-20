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

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://www.forgewrite.fr'],
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

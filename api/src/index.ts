import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testRoutes from './routes/test.routes';
import userRoutes from './routes/user';
import bookRoutes from './routes/book';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

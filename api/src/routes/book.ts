import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const books = await prisma.fw_books.findMany({
    include: {
      user: true, // relation auteur
    },
  });
  res.json(books);
});

export default router;

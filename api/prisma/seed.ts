import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crée un utilisateur
  const user = await prisma.fw_users.create({
    data: {
      email: 'demo@forgewrite.fr',
      password_hash: 'hashedpassword',
      username: 'demoUser',
    },
  });

  // Crée un livre
  const book = await prisma.fw_books.create({
    data: {
      user_id: user.id,
      title: 'The Forgotten Kingdom',
      description: 'A fantasy journey through a lost world',
      genre: 'Fantasy',
      status: 'draft',
    },
  });

  // Ajoute un chapitre
  const chapter = await prisma.fw_chapters.create({
    data: {
      book_id: book.id,
      title: 'Chapter 1: Awakening',
      content: 'It was a cold morning when Elara opened her eyes...',
      order_index: 1,
    },
  });

  // Note dans le chapitre
  await prisma.fw_notes.create({
    data: {
      chapter_id: chapter.id,
      content: 'Consider expanding on Elara’s background here.',
      line_position: 5,
    },
  });

  // Commentaire
  await prisma.fw_comments.create({
    data: {
      chapter_id: chapter.id,
      content: 'Really like the imagery in this opening!',
    },
  });

  // Un personnage
  await prisma.fw_characters.create({
    data: {
      book_id: book.id,
      name: 'Elara',
      gender: 'Female',
      age: 22,
      physical_description: 'Slender build, emerald eyes, shoulder-length hair.',
      backstory: 'Last heir of a fallen kingdom, now in exile.',
      role: 'Protagonist',
    },
  });

  // Une statistique
  await prisma.fw_stats.create({
    data: {
      book_id: book.id,
      word_count: 543,
      letter_count: 3120,
      total_goal: 50000,
      weekly_goal: 2500,
    },
  });

  // Un élément de carte
  await prisma.fw_map_items.create({
    data: {
      book_id: book.id,
      type: 'city',
      name: 'Verelith',
      x: 132.5,
      y: 89.2,
      description: 'Ancient capital surrounded by mist.',
    },
  });

  console.log('✅ Base de données initialisée avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Une erreur est survenue :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

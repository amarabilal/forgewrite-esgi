/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "fw_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "two_fa_secret" TEXT,

    CONSTRAINT "fw_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fw_books" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "genre" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fw_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fw_chapters" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fw_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fw_notes" (
    "id" SERIAL NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "line_position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fw_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fw_comments" (
    "id" SERIAL NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fw_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fw_characters" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "alias" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "physical_description" TEXT,
    "backstory" TEXT,
    "role" TEXT,
    "relations" TEXT,

    CONSTRAINT "fw_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fw_stats" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "word_count" INTEGER NOT NULL,
    "letter_count" INTEGER NOT NULL,
    "total_goal" INTEGER,
    "weekly_goal" INTEGER,
    "deadline" TIMESTAMP(3),

    CONSTRAINT "fw_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fw_map_items" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "fw_map_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fw_users_email_key" ON "fw_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "fw_users_username_key" ON "fw_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "fw_stats_book_id_key" ON "fw_stats"("book_id");

-- AddForeignKey
ALTER TABLE "fw_books" ADD CONSTRAINT "fw_books_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "fw_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fw_chapters" ADD CONSTRAINT "fw_chapters_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "fw_books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fw_notes" ADD CONSTRAINT "fw_notes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "fw_chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fw_comments" ADD CONSTRAINT "fw_comments_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "fw_chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fw_characters" ADD CONSTRAINT "fw_characters_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "fw_books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fw_stats" ADD CONSTRAINT "fw_stats_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "fw_books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fw_map_items" ADD CONSTRAINT "fw_map_items_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "fw_books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

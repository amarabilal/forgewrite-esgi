/*
  Warnings:

  - You are about to alter the column `title` on the `book` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `genre` on the `book` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `title` on the `chapter` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `name` on the `character` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `alias` on the `character` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `name` on the `mapitem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - Made the column `created_at` on table `book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_index` on table `chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `note` required. This step will fail if there are existing NULL values in that column.
  - Made the column `word_count` on table `stat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `letter_count` on table `stat` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `chapter` DROP FOREIGN KEY `Chapter_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `character` DROP FOREIGN KEY `Character_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `mapitem` DROP FOREIGN KEY `MapItem_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `note` DROP FOREIGN KEY `Note_chapter_id_fkey`;

-- DropForeignKey
ALTER TABLE `stat` DROP FOREIGN KEY `Stat_book_id_fkey`;

-- AlterTable
ALTER TABLE `book` MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `genre` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `chapter` MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `content` VARCHAR(191) NULL,
    MODIFY `order_index` INTEGER NOT NULL DEFAULT 0,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `character` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `alias` VARCHAR(191) NULL,
    MODIFY `gender` VARCHAR(191) NULL,
    MODIFY `physical_description` VARCHAR(191) NULL,
    MODIFY `backstory` VARCHAR(191) NULL,
    MODIFY `role` VARCHAR(191) NULL,
    MODIFY `relations` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `comment` MODIFY `content` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `mapitem` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `x` DOUBLE NOT NULL,
    MODIFY `y` DOUBLE NOT NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `note` MODIFY `content` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `stat` MODIFY `word_count` INTEGER NOT NULL DEFAULT 0,
    MODIFY `letter_count` INTEGER NOT NULL DEFAULT 0,
    MODIFY `deadline` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `refresh_token` VARCHAR(191) NULL,
    MODIFY `two_factor_secret` VARCHAR(191) NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'member',
    MODIFY `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `book` ADD CONSTRAINT `book_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter` ADD CONSTRAINT `chapter_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `note_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character` ADD CONSTRAINT `character_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mapitem` ADD CONSTRAINT `mapitem_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stat` ADD CONSTRAINT `stat_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `stat` RENAME INDEX `book_id` TO `stat_book_id_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `email` TO `users_email_key`;

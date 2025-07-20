-- 1. Table users
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `refresh_token` TEXT,
  `two_factor_secret` TEXT,
  `role` VARCHAR(50) NOT NULL DEFAULT 'member',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table book
CREATE TABLE `book` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `genre` VARCHAR(255),
  `status` VARCHAR(100),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Book_user_id_fkey` (`user_id`),
  CONSTRAINT `Book_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table chapter
CREATE TABLE `chapter` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `book_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` LONGTEXT,
  `order_index` INT DEFAULT 0,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Chapter_book_id_fkey` (`book_id`),
  CONSTRAINT `Chapter_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table comment
CREATE TABLE `comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `book_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Comment_book_id_fkey` (`book_id`),
  CONSTRAINT `Comment_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 5. Table note
CREATE TABLE `note` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chapter_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `line_position` INT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Note_chapter_id_fkey` (`chapter_id`),
  CONSTRAINT `Note_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Table character
CREATE TABLE `character` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `book_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `alias` VARCHAR(255),
  `gender` VARCHAR(50),
  `age` INT,
  `physical_description` TEXT,
  `backstory` TEXT,
  `role` VARCHAR(100),
  `relations` TEXT,
  PRIMARY KEY (`id`),
  KEY `Character_book_id_fkey` (`book_id`),
  CONSTRAINT `Character_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Table mapitem
CREATE TABLE `mapitem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `book_id` INT NOT NULL,
  `type` ENUM('city', 'place', 'route') NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `x` FLOAT NOT NULL,
  `y` FLOAT NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`id`),
  KEY `MapItem_book_id_fkey` (`book_id`),
  CONSTRAINT `MapItem_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Table stat
CREATE TABLE `stat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `book_id` INT NOT NULL UNIQUE,
  `word_count` INT DEFAULT 0,
  `letter_count` INT DEFAULT 0,
  `total_goal` INT,
  `weekly_goal` INT,
  `deadline` DATETIME,
  PRIMARY KEY (`id`),
  CONSTRAINT `Stat_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

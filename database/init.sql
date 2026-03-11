-- Create database
CREATE DATABASE IF NOT EXISTS campusbook DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE campusbook;

-- User table
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'User ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Username',
    `password` VARCHAR(255) NOT NULL COMMENT 'Password',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT 'Nickname',
    `avatar` VARCHAR(255) DEFAULT NULL COMMENT 'Avatar URL',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT 'Phone',
    `email` VARCHAR(100) DEFAULT NULL COMMENT 'Email',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    INDEX idx_username (`username`),
    INDEX idx_email (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User table';

-- Book table
CREATE TABLE IF NOT EXISTS `book` (
    `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Book ID',
    `title` VARCHAR(200) NOT NULL COMMENT 'Book title',
    `author` VARCHAR(100) DEFAULT NULL COMMENT 'Author',
    `isbn` VARCHAR(20) DEFAULT NULL COMMENT 'ISBN',
    `category` VARCHAR(50) NOT NULL COMMENT 'Category',
    `condition` VARCHAR(20) NOT NULL COMMENT 'Condition',
    `price` DECIMAL(10, 2) NOT NULL COMMENT 'Price',
    `description` TEXT DEFAULT NULL COMMENT 'Description',
    `stock` INT NOT NULL DEFAULT 1 COMMENT 'Stock',
    `delivery_type` VARCHAR(20) NOT NULL COMMENT 'Delivery type',
    `images` TEXT DEFAULT NULL COMMENT 'Images JSON',
    `user_id` INT NOT NULL COMMENT 'Seller ID',
    `status` INT NOT NULL DEFAULT 1 COMMENT 'Status (1:online 0:offline)',
    `view_count` INT NOT NULL DEFAULT 0 COMMENT 'View count',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    INDEX idx_user_id (`user_id`),
    INDEX idx_category (`category`),
    INDEX idx_status (`status`),
    INDEX idx_created_at (`created_at`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Book table';

-- Order table
CREATE TABLE IF NOT EXISTS `order_table` (
    `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Order ID',
    `order_no` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Order number',
    `user_id` INT NOT NULL COMMENT 'Buyer ID',
    `book_id` INT NOT NULL COMMENT 'Book ID',
    `address_id` INT NOT NULL COMMENT 'Address ID',
    `total_price` DECIMAL(10, 2) NOT NULL COMMENT 'Total price',
    `status` INT NOT NULL DEFAULT 0 COMMENT 'Order status (0:pending 1:paid 2:shipped 3:completed 4:cancelled)',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated at',
    INDEX idx_user_id (`user_id`),
    INDEX idx_book_id (`book_id`),
    INDEX idx_order_no (`order_no`),
    INDEX idx_status (`status`),
    INDEX idx_created_at (`created_at`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Order table';

-- Address table
CREATE TABLE IF NOT EXISTS `address` (
    `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Address ID',
    `user_id` INT NOT NULL COMMENT 'User ID',
    `receiver` VARCHAR(50) NOT NULL COMMENT 'Receiver',
    `phone` VARCHAR(20) NOT NULL COMMENT 'Phone',
    `address` VARCHAR(255) NOT NULL COMMENT 'Address',
    `is_default` INT NOT NULL DEFAULT 0 COMMENT 'Is default (1:yes 0:no)',
    INDEX idx_user_id (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Address table';

-- Insert test data
INSERT INTO `user` (`username`, `password`, `nickname`, `email`, `phone`) VALUES
('testuser', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Test User', 'test@example.com', '13800138000');

INSERT INTO `book` (`title`, `author`, `isbn`, `category`, `condition`, `price`, `description`, `stock`, `delivery_type`, `user_id`, `status`) VALUES
('Advanced Mathematics', 'Tongji University', '9787040456906', 'Textbook', 'Like New', 45.00, 'Advanced Mathematics 7th Edition, no notes', 1, 'Pickup+Delivery', 1, 1),
('Linear Algebra', 'Tongji University', '9787040396616', 'Textbook', 'Very Good', 30.00, 'Linear Algebra 6th Edition, some notes', 1, 'Pickup Only', 1, 1),
('English Vocabulary', 'Zhu Wei', '9787519302887', 'Exam Prep', 'New', 55.00, 'English Vocabulary 2025, brand new', 2, 'Pickup+Delivery', 1, 1);

INSERT INTO `address` (`user_id`, `receiver`, `phone`, `address`, `is_default`) VALUES
(1, 'Zhang San', '13800138000', 'Guangdong Province Guangzhou City Tianhe District XX Road XX No.', 1);

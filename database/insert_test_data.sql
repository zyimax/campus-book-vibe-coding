USE campusbook;

INSERT INTO book (title, author, isbn, category, `condition`, price, description, stock, delivery_type, user_id, status) VALUES 
('Advanced Mathematics', 'Tongji University', '9787040456906', 'Textbook', 'Like New', 45.00, 'Advanced Mathematics 7th Edition, no notes', 1, 'Pickup+Delivery', 1, 1),
('Linear Algebra', 'Tongji University', '9787040396616', 'Textbook', 'Very Good', 30.00, 'Linear Algebra 6th Edition, some notes', 1, 'Pickup Only', 1, 1),
('English Vocabulary', 'Zhu Wei', '9787519302887', 'Exam Prep', 'New', 55.00, 'English Vocabulary 2025, brand new', 2, 'Pickup+Delivery', 1, 1);

INSERT INTO address (user_id, receiver, phone, address, is_default) VALUES 
(1, 'Zhang San', '13800138000', 'Guangdong Province Guangzhou City Tianhe District XX Road XX No.', 1);

package com.campusbook.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campusbook.entity.Book;
import com.baomidou.mybatisplus.core.metadata.IPage;

public interface BookService extends IService<Book> {

    IPage<Book> getBookList(Integer page, Integer size);

    Book getBookDetail(Integer id);

    void publishBook(Book book);

    void updateBook(Integer id, Book book);

    void deleteBook(Integer id);

    IPage<Book> searchBooks(String keyword, String category, String condition, Integer page, Integer size);

    IPage<Book> getBooksByCategory(String category, Integer page, Integer size);
}

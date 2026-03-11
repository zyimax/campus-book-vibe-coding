package com.campusbook.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campusbook.entity.Book;
import com.campusbook.entity.User;
import com.campusbook.mapper.BookMapper;
import com.campusbook.service.BookService;
import com.campusbook.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookServiceImpl extends ServiceImpl<BookMapper, Book> implements BookService {

    private final UserService userService;

    public BookServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public IPage<Book> getBookList(Integer page, Integer size) {
        Page<Book> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Book> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Book::getStatus, 1);
        wrapper.orderByDesc(Book::getCreatedAt);
        return page(pageParam, wrapper);
    }

    @Override
    public Book getBookDetail(Integer id) {
        Book book = getById(id);
        if (book != null) {
            book.setViewCount(book.getViewCount() + 1);
            updateById(book);
            User seller = userService.getById(book.getUserId());
            book.setSeller(seller);
        }
        return book;
    }

    @Override
    @Transactional
    public void publishBook(Book book) {
        book.setStatus(1);
        book.setViewCount(0);
        save(book);
    }

    @Override
    public void updateBook(Integer id, Book book) {
        book.setId(id);
        updateById(book);
    }

    @Override
    public void deleteBook(Integer id) {
        removeById(id);
    }

    @Override
    public IPage<Book> searchBooks(String keyword, String category, String condition, Integer page, Integer size) {
        Page<Book> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Book> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Book::getStatus, 1);
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Book::getTitle, keyword);
        }
        if (category != null && !category.isEmpty()) {
            wrapper.eq(Book::getCategory, category);
        }
        if (condition != null && !condition.isEmpty()) {
            wrapper.eq(Book::getCondition, condition);
        }
        wrapper.orderByDesc(Book::getCreatedAt);
        return page(pageParam, wrapper);
    }

    @Override
    public IPage<Book> getBooksByCategory(String category, Integer page, Integer size) {
        Page<Book> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Book> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Book::getStatus, 1);
        wrapper.eq(Book::getCategory, category);
        wrapper.orderByDesc(Book::getCreatedAt);
        return page(pageParam, wrapper);
    }
}

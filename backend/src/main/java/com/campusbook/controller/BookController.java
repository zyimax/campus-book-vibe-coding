package com.campusbook.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campusbook.dto.BookRequest;
import com.campusbook.dto.Result;
import com.campusbook.entity.Book;
import com.campusbook.service.BookService;
import com.campusbook.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;
    private final JwtUtil jwtUtil;

    public BookController(BookService bookService, JwtUtil jwtUtil) {
        this.bookService = bookService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public Result<IPage<Book>> getBookList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        IPage<Book> books = bookService.getBookList(page, size);
        return Result.success(books);
    }

    @GetMapping("/{id}")
    public Result<Book> getBookDetail(@PathVariable Integer id) {
        Book book = bookService.getBookDetail(id);
        return Result.success(book);
    }

    @PostMapping
    public Result<String> publishBook(HttpServletRequest request, @Validated @RequestBody BookRequest bookRequest) {
        Integer userId = jwtUtil.getUserIdFromToken(request.getHeader("Authorization"));
        Book book = new Book();
        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setIsbn(bookRequest.getIsbn());
        book.setCategory(bookRequest.getCategory());
        book.setCondition(bookRequest.getCondition());
        book.setPrice(bookRequest.getPrice());
        book.setDescription(bookRequest.getDescription());
        book.setStock(bookRequest.getStock());
        book.setDeliveryType(bookRequest.getDeliveryType());
        book.setImages(bookRequest.getImages());
        book.setUserId(userId);
        bookService.publishBook(book);
        return Result.success("发布成功");
    }

    @PutMapping("/{id}")
    public Result<String> updateBook(@PathVariable Integer id, @Validated @RequestBody BookRequest bookRequest) {
        Book book = new Book();
        book.setId(id);
        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setIsbn(bookRequest.getIsbn());
        book.setCategory(bookRequest.getCategory());
        book.setCondition(bookRequest.getCondition());
        book.setPrice(bookRequest.getPrice());
        book.setDescription(bookRequest.getDescription());
        book.setStock(bookRequest.getStock());
        book.setDeliveryType(bookRequest.getDeliveryType());
        book.setImages(bookRequest.getImages());
        bookService.updateBook(id, book);
        return Result.success("更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
        return Result.success("删除成功");
    }

    @GetMapping("/search")
    public Result<IPage<Book>> searchBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        IPage<Book> books = bookService.searchBooks(keyword, category, condition, page, size);
        return Result.success(books);
    }

    @GetMapping("/category/{type}")
    public Result<IPage<Book>> getBooksByCategory(
            @PathVariable String type,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        IPage<Book> books = bookService.getBooksByCategory(type, page, size);
        return Result.success(books);
    }
}

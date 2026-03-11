package com.campusbook.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campusbook.entity.Address;
import com.campusbook.entity.Book;
import com.campusbook.entity.Order;
import com.campusbook.mapper.OrderMapper;
import com.campusbook.service.AddressService;
import com.campusbook.service.BookService;
import com.campusbook.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    private final BookService bookService;
    private final AddressService addressService;

    public OrderServiceImpl(BookService bookService, AddressService addressService) {
        this.bookService = bookService;
        this.addressService = addressService;
    }

    @Override
    @Transactional
    public Order createOrder(Integer userId, Integer bookId, Integer addressId) {
        Book book = bookService.getById(bookId);
        if (book == null || book.getStock() <= 0) {
            throw new RuntimeException("书籍不存在或库存不足");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setBookId(bookId);
        order.setAddressId(addressId);
        order.setTotalPrice(book.getPrice());
        order.setStatus(0);
        order.setOrderNo(generateOrderNo());
        save(order);

        book.setStock(book.getStock() - 1);
        bookService.updateById(book);

        return order;
    }

    @Override
    public IPage<Order> getOrderList(Integer userId, Integer status, Integer page, Integer size) {
        Page<Order> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId);
        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }
        wrapper.orderByDesc(Order::getCreatedAt);
        IPage<Order> orderPage = page(pageParam, wrapper);
        
        orderPage.getRecords().forEach(order -> {
            order.setBook(bookService.getById(order.getBookId()));
            order.setAddress(addressService.getById(order.getAddressId()));
        });
        
        return orderPage;
    }

    @Override
    public Order getOrderDetail(Integer id) {
        Order order = getById(id);
        if (order != null) {
            order.setBook(bookService.getById(order.getBookId()));
            order.setAddress(addressService.getById(order.getAddressId()));
        }
        return order;
    }

    @Override
    @Transactional
    public void cancelOrder(Integer id) {
        Order order = getById(id);
        if (order == null || order.getStatus() != 0) {
            throw new RuntimeException("订单状态不允许取消");
        }
        order.setStatus(4);
        updateById(order);

        Book book = bookService.getById(order.getBookId());
        book.setStock(book.getStock() + 1);
        bookService.updateById(book);
    }

    @Override
    @Transactional
    public void confirmOrder(Integer id) {
        Order order = getById(id);
        if (order == null || order.getStatus() != 2) {
            throw new RuntimeException("订单状态不允许确认收货");
        }
        order.setStatus(3);
        updateById(order);
    }

    private String generateOrderNo() {
        return "ORD" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }
}

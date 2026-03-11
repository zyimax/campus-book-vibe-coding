package com.campusbook.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campusbook.entity.Order;
import com.baomidou.mybatisplus.core.metadata.IPage;

public interface OrderService extends IService<Order> {

    Order createOrder(Integer userId, Integer bookId, Integer addressId);

    IPage<Order> getOrderList(Integer userId, Integer status, Integer page, Integer size);

    Order getOrderDetail(Integer id);

    void cancelOrder(Integer id);

    void confirmOrder(Integer id);
}

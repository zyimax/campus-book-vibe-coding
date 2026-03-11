package com.campusbook.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campusbook.dto.Result;
import com.campusbook.entity.Order;
import com.campusbook.service.OrderService;
import com.campusbook.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    public OrderController(OrderService orderService, JwtUtil jwtUtil) {
        this.orderService = orderService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public Result<Order> createOrder(HttpServletRequest request, @RequestBody Order order) {
        Integer userId = jwtUtil.getUserIdFromToken(request.getHeader("Authorization"));
        Order createdOrder = orderService.createOrder(userId, order.getBookId(), order.getAddressId());
        return Result.success(createdOrder);
    }

    @GetMapping
    public Result<IPage<Order>> getOrderList(
            HttpServletRequest request,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        Integer userId = jwtUtil.getUserIdFromToken(request.getHeader("Authorization"));
        IPage<Order> orders = orderService.getOrderList(userId, status, page, size);
        return Result.success(orders);
    }

    @GetMapping("/{id}")
    public Result<Order> getOrderDetail(@PathVariable Integer id) {
        Order order = orderService.getOrderDetail(id);
        return Result.success(order);
    }

    @PutMapping("/{id}/cancel")
    public Result<String> cancelOrder(@PathVariable Integer id) {
        orderService.cancelOrder(id);
        return Result.success("订单已取消");
    }

    @PutMapping("/{id}/pay")
    public Result<String> payOrder(@PathVariable Integer id) {
        orderService.payOrder(id);
        return Result.success("支付成功");
    }

    @PutMapping("/{id}/ship")
    public Result<String> shipOrder(@PathVariable Integer id) {
        orderService.shipOrder(id);
        return Result.success("已发货");
    }

    @PutMapping("/{id}/confirm")
    public Result<String> confirmOrder(@PathVariable Integer id) {
        orderService.confirmOrder(id);
        return Result.success("已确认收货");
    }
}

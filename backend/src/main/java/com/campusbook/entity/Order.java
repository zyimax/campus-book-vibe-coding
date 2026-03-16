package com.campusbook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("order_table")
public class Order {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String orderNo;

    private Integer userId;

    private Integer bookId;

    private Integer addressId;

    private BigDecimal totalPrice;

    @TableField("`status`")
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableField(exist = false)
    private Book book;

    @TableField(exist = false)
    private Address address;
}

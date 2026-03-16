package com.campusbook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("book")
public class Book {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String title;

    private String author;

    private String isbn;

    private String category;

    @TableField("`condition`")
    private String condition;

    private BigDecimal price;

    private String description;

    private Integer stock;

    private String deliveryType;

    private String images;

    private Integer userId;

    @TableField("`status`")
    private Integer status;

    private Integer viewCount;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(exist = false)
    private User seller;
}

package com.campusbook.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Data
public class BookRequest {
    @NotBlank(message = "书名不能为空")
    @Size(max = 200, message = "书名长度不能超过200个字符")
    private String title;

    @Size(max = 100, message = "作者长度不能超过100个字符")
    private String author;

    @Size(max = 20, message = "ISBN长度不能超过20个字符")
    private String isbn;

    @NotBlank(message = "分类不能为空")
    @Size(max = 50, message = "分类长度不能超过50个字符")
    private String category;

    @NotBlank(message = "成色不能为空")
    @Size(max = 20, message = "成色长度不能超过20个字符")
    private String condition;

    @NotNull(message = "价格不能为空")
    @DecimalMin(value = "0.01", message = "价格必须大于0")
    @DecimalMax(value = "9999.99", message = "价格不能超过9999.99")
    private BigDecimal price;

    @Size(max = 1000, message = "描述长度不能超过1000个字符")
    private String description;

    @NotNull(message = "库存不能为空")
    @Min(value = 1, message = "库存至少为1")
    @Max(value = 999, message = "库存不能超过999")
    private Integer stock;

    @NotBlank(message = "交易方式不能为空")
    @Size(max = 20, message = "交易方式长度不能超过20个字符")
    private String deliveryType;

    private String images;
}

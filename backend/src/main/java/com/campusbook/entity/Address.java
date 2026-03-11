package com.campusbook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("address")
public class Address {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer userId;

    private String receiver;

    private String phone;

    private String address;

    private Integer isDefault;
}

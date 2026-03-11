package com.campusbook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String username;

    private String password;

    private String nickname;

    private String avatar;

    private String phone;

    private String email;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}

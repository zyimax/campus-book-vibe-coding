package com.campusbook.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campusbook.entity.User;

public interface UserService extends IService<User> {

    User register(String username, String password, String email, String phone);

    String login(String username, String password);

    User getProfile(Integer userId);

    void updateProfile(Integer userId, User user);
}

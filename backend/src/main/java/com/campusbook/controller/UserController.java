package com.campusbook.controller;

import com.campusbook.dto.LoginRequest;
import com.campusbook.dto.RefreshTokenRequest;
import com.campusbook.dto.RegisterRequest;
import com.campusbook.dto.Result;
import com.campusbook.entity.User;
import com.campusbook.service.UserService;
import com.campusbook.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public Result<String> register(@Validated @RequestBody RegisterRequest request) {
        userService.register(request.getUsername(), request.getPassword(), request.getEmail(), request.getPhone());
        return Result.success("注册成功");
    }

    @PostMapping("/login")
    public Result<String> login(@Validated @RequestBody LoginRequest request) {
        String token = userService.login(request.getUsername(), request.getPassword());
        return Result.success(token);
    }

    @GetMapping("/profile")
    public Result<User> getProfile(HttpServletRequest request) {
        Integer userId = jwtUtil.getUserIdFromToken(request.getHeader("Authorization"));
        User user = userService.getProfile(userId);
        return Result.success(user);
    }

    @PutMapping("/profile")
    public Result<String> updateProfile(HttpServletRequest request, @RequestBody User user) {
        Integer userId = jwtUtil.getUserIdFromToken(request.getHeader("Authorization"));
        userService.updateProfile(userId, user);
        return Result.success("更新成功");
    }

    @PostMapping("/logout")
    public Result<String> logout() {
        return Result.success("退出成功");
    }

    @PostMapping("/refresh-token")
    public Result<String> refreshToken(@Validated @RequestBody RefreshTokenRequest request) {
        try {
            Integer userId = jwtUtil.getUserIdFromToken(request.getToken());
            String newToken = jwtUtil.generateToken(userId);
            return Result.success(newToken);
        } catch (Exception e) {
            return Result.error("令牌刷新失败: " + e.getMessage());
        }
    }
}

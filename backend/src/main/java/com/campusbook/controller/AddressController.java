package com.campusbook.controller;

import com.campusbook.dto.Result;
import com.campusbook.entity.Address;
import com.campusbook.service.AddressService;
import com.campusbook.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
public class AddressController {

    private final AddressService addressService;
    private final JwtUtil jwtUtil;

    public AddressController(AddressService addressService, JwtUtil jwtUtil) {
        this.addressService = addressService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public Result<List<Address>> getAddressList(HttpServletRequest request) {
        Integer userId = jwtUtil.getUserIdFromToken(request.getHeader("Authorization"));
        List<Address> addresses = addressService.getAddressList(userId);
        return Result.success(addresses);
    }

    @PostMapping
    public Result<String> addAddress(HttpServletRequest request, @RequestBody Address address) {
        Integer userId = jwtUtil.getUserIdFromToken(request.getHeader("Authorization"));
        address.setUserId(userId);
        addressService.addAddress(address);
        return Result.success("添加成功");
    }

    @PutMapping("/{id}")
    public Result<String> updateAddress(@PathVariable Integer id, @RequestBody Address address) {
        addressService.updateAddress(id, address);
        return Result.success("更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteAddress(@PathVariable Integer id) {
        addressService.deleteAddress(id);
        return Result.success("删除成功");
    }

    @PutMapping("/{id}/default")
    public Result<String> setDefaultAddress(HttpServletRequest request, @PathVariable Integer id) {
        Integer userId = jwtUtil.getUserIdFromToken(request.getHeader("Authorization"));
        addressService.setDefaultAddress(userId, id);
        return Result.success("设置成功");
    }
}

package com.campusbook.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campusbook.entity.Address;

import java.util.List;

public interface AddressService extends IService<Address> {

    List<Address> getAddressList(Integer userId);

    void addAddress(Address address);

    void updateAddress(Integer id, Address address);

    void deleteAddress(Integer id);

    void setDefaultAddress(Integer userId, Integer id);
}

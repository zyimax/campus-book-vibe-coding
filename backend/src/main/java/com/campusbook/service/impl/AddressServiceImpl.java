package com.campusbook.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campusbook.entity.Address;
import com.campusbook.mapper.AddressMapper;
import com.campusbook.service.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressServiceImpl extends ServiceImpl<AddressMapper, Address> implements AddressService {

    @Override
    public List<Address> getAddressList(Integer userId) {
        LambdaQueryWrapper<Address> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Address::getUserId, userId);
        wrapper.orderByDesc(Address::getIsDefault);
        return list(wrapper);
    }

    @Override
    @Transactional
    public void addAddress(Address address) {
        if (address.getIsDefault() != null && address.getIsDefault() == 1) {
            LambdaQueryWrapper<Address> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Address::getUserId, address.getUserId());
            wrapper.eq(Address::getIsDefault, 1);
            Address defaultAddress = getOne(wrapper);
            if (defaultAddress != null) {
                defaultAddress.setIsDefault(0);
                updateById(defaultAddress);
            }
        }
        if (address.getIsDefault() == null) {
            address.setIsDefault(0);
        }
        save(address);
    }

    @Override
    public void updateAddress(Integer id, Address address) {
        address.setId(id);
        updateById(address);
    }

    @Override
    public void deleteAddress(Integer id) {
        removeById(id);
    }

    @Override
    @Transactional
    public void setDefaultAddress(Integer userId, Integer id) {
        LambdaQueryWrapper<Address> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Address::getUserId, userId);
        wrapper.eq(Address::getIsDefault, 1);
        Address defaultAddress = getOne(wrapper);
        if (defaultAddress != null) {
            defaultAddress.setIsDefault(0);
            updateById(defaultAddress);
        }

        Address address = getById(id);
        if (address != null) {
            address.setIsDefault(1);
            updateById(address);
        }
    }
}

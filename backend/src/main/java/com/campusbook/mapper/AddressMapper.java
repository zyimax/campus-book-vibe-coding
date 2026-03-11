package com.campusbook.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campusbook.entity.Address;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AddressMapper extends BaseMapper<Address> {
}

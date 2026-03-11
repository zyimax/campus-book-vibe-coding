package com.campusbook;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.campusbook.mapper")
public class CampusBookApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusBookApplication.class, args);
    }
}

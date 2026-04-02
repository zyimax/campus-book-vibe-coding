#!/bin/bash

# 进入后端目录
cd backend

# 构建项目
echo "Building Spring Boot application..."
mvn clean package -DskipTests

# 启动应用
echo "Starting Spring Boot application..."
java -jar target/campusbook-backend-1.0.0.jar
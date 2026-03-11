# 校园二手书交易平台

## 项目简介

校园二手书交易平台是一个为在校学生提供二手书买卖服务的Web应用，帮助学生降低购书成本，促进书籍资源的循环利用。

## 技术栈

### 前端

- React 18
- React Router 6
- Ant Design 5
- Axios
- Vite

### 后端

- Java 17
- Spring Boot 3.2.0
- MyBatis Plus 3.5.5
- Spring Security
- JWT
- MySQL 8.0

## 项目结构

```c
CampusBook/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── api/          # API接口
│   │   ├── components/   # 公共组件
│   │   ├── utils/        # 工具函数
│   │   ├── views/        # 页面组件
│   │   ├── App.jsx       # 应用入口
│   │   └── main.jsx      # 主文件
│   ├── package.json
│   └── vite.config.js
├── backend/              # 后端项目
│   ├── src/main/java/com/campusbook/
│   │   ├── config/       # 配置类
│   │   ├── controller/   # 控制器
│   │   ├── dto/          # 数据传输对象
│   │   ├── entity/       # 实体类
│   │   ├── mapper/       # 数据访问层
│   │   ├── service/      # 服务层
│   │   └── util/         # 工具类
│   └── pom.xml
├── database/             # 数据库脚本
│   └── init.sql
└── docs/                 # 文档
    └── 需求文档.md
```

## 快速开始

### 环境要求

- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8.0+

### 数据库配置

1. 创建数据库：

```bash
mysql -u root -p < database/init.sql
```

1. 修改后端配置文件 `backend/src/main/resources/application.yml` 中的数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/campusbook
    username: root
    password: your_password
```

### 后端启动

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 `http://localhost:3000` 启动

## 功能特性

### v1.0 核心功能

- 用户注册登录
- 书籍发布和浏览
- 书籍搜索和筛选
- 订单管理
- 收货地址管理
- 个人中心

## API文档

### 用户相关

- POST /api/user/register - 用户注册
- POST /api/user/login - 用户登录
- GET /api/user/profile - 获取用户信息
- PUT /api/user/profile - 更新用户信息

### 书籍相关

- GET /api/books - 获取书籍列表
- GET /api/books/:id - 获取书籍详情
- POST /api/books - 发布书籍
- PUT /api/books/:id - 更新书籍
- DELETE /api/books/:id - 删除书籍
- GET /api/books/search - 搜索书籍
- GET /api/books/category/:type - 按分类获取书籍

### 订单相关

- POST /api/orders - 创建订单
- GET /api/orders - 获取订单列表
- GET /api/orders/:id - 获取订单详情
- PUT /api/orders/:id/cancel - 取消订单
- PUT /api/orders/:id/confirm - 确认收货

### 地址相关

- GET /api/addresses - 获取地址列表
- POST /api/addresses - 新增地址
- PUT /api/addresses/:id - 更新地址
- DELETE /api/addresses/:id - 删除地址
- PUT /api/addresses/:id/default - 设置默认地址

## 开发规范

### 代码风格

- 前端：遵循 ESLint 规则
- 后端：遵循阿里巴巴 Java 开发手册

### 提交规范

- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建/工具链相关

## 许可证

MIT License

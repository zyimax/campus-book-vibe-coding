# 📚 校园书市 - 校园二手书交易平台

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React 18">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot" alt="Spring Boot">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/Java-17-007396?logo=java" alt="Java 17">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

<p align="center">
  <b>让闲置书籍流转起来，与志同道合的书友相遇</b>
</p>

---

## 📖 项目概述

**校园书市**是一个专为高校学生打造的二手书交易平台，旨在解决学生购书成本高、闲置书籍处理难的问题。平台提供完整的书籍发布、浏览、搜索、交易流程，支持多种交易方式，让校园内的书籍资源得到充分利用。

### ✨ 核心特性

- 🔐 **安全可靠** - JWT认证 + Spring Security权限控制
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎨 **现代UI** - 渐变色彩 + 流畅动画 + 毛玻璃效果
- 🔍 **智能搜索** - 支持关键词、分类、价格区间筛选
- 📦 **订单管理** - 完整的订单生命周期管理
- 📍 **地址管理** - 多地址支持，一键设置默认地址
- 🖼️ **图片上传** - 支持书籍封面和头像上传

---

## 🛠️ 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI框架 |
| React Router | 6.x | 路由管理 |
| Ant Design | 5.x | UI组件库 |
| Axios | 1.x | HTTP客户端 |
| Vite | 5.x | 构建工具 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Java | 17+ | 编程语言 |
| Spring Boot | 3.2.x | 应用框架 |
| Spring Security | 6.x | 安全认证 |
| MyBatis Plus | 3.5.x | ORM框架 |
| JWT | 0.12.x | 令牌认证 |
| MySQL | 8.0+ | 数据库 |

---

## 📁 项目结构

```
CampusBook/
├── 📂 frontend/                 # 前端项目
│   ├── src/
│   │   ├── api/                # API接口封装
│   │   ├── components/         # 公共组件
│   │   │   ├── ErrorBoundary.jsx   # 错误边界
│   │   │   └── Layout.jsx          # 布局组件
│   │   ├── utils/              # 工具函数
│   │   │   ├── auth.js             # 认证工具
│   │   │   └── request.js          # 请求拦截器
│   │   ├── views/              # 页面组件
│   │   │   ├── Home.jsx            # 首页
│   │   │   ├── Login.jsx           # 登录页
│   │   │   ├── Register.jsx        # 注册页
│   │   │   ├── BookDetail.jsx      # 书籍详情
│   │   │   ├── Publish.jsx         # 发布书籍
│   │   │   ├── Orders.jsx          # 订单列表
│   │   │   ├── OrderCreate.jsx     # 创建订单
│   │   │   ├── OrderDetail.jsx     # 订单详情
│   │   │   ├── Address.jsx         # 地址管理
│   │   │   ├── Profile.jsx         # 个人中心
│   │   │   ├── Search.jsx          # 搜索页
│   │   │   └── Category.jsx        # 分类浏览
│   │   ├── App.jsx             # 应用入口
│   │   ├── main.jsx            # 主文件
│   │   └── index.css           # 全局样式
│   ├── package.json
│   └── vite.config.js
│
├── 📂 backend/                  # 后端项目
│   ├── src/main/java/com/campusbook/
│   │   ├── config/             # 配置类
│   │   │   ├── SecurityConfig.java       # 安全配置
│   │   │   ├── JwtAuthenticationFilter.java  # JWT过滤器
│   │   │   ├── WebConfig.java            # Web配置
│   │   │   └── MyMetaObjectHandler.java  # 自动填充
│   │   ├── controller/         # 控制器层
│   │   │   ├── UserController.java
│   │   │   ├── BookController.java
│   │   │   ├── OrderController.java
│   │   │   ├── AddressController.java
│   │   │   └── FileController.java
│   │   ├── service/            # 服务层
│   │   │   ├── impl/           # 实现类
│   │   │   ├── UserService.java
│   │   │   ├── BookService.java
│   │   │   ├── OrderService.java
│   │   │   └── AddressService.java
│   │   ├── mapper/             # 数据访问层
│   │   ├── entity/             # 实体类
│   │   ├── dto/                # 数据传输对象
│   │   ├── exception/          # 异常处理
│   │   └── util/               # 工具类
│   │       └── JwtUtil.java    # JWT工具
│   ├── src/main/resources/
│   │   ├── application.yml     # 配置文件
│   │   └── data.sql            # 测试数据
│   └── pom.xml
│
├── 📂 database/                 # 数据库脚本
│   ├── init.sql                # 初始化脚本
│   └── insert_test_data.sql    # 测试数据
│
├── 📂 docs/                     # 文档
│   ├── 需求文档.md
│   ├── 系统架构文档.md
│   ├── JWT令牌问题解决方案.md
│   └── 需求与代码实现对应关系.md
│
├── 📄 README.md                 # 项目说明
├── 📄 .gitignore
└── 📄 start-backend.bat         # 后端启动脚本
```

---

## 🚀 快速开始

### 环境要求

| 环境 | 版本要求 |
|------|----------|
| Node.js | 18+ |
| Java | 17+ |
| Maven | 3.8+ |
| MySQL | 8.0+ |

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/CampusBook.git
cd CampusBook
```

### 2. 数据库配置

#### 2.1 创建数据库

```bash
# 登录MySQL
mysql -u root -p

# 执行初始化脚本
source database/init.sql
```

#### 2.2 配置数据库连接

编辑 `backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/campusbook?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: your_username      # 修改为你的MySQL用户名
    password: your_password      # 修改为你的MySQL密码
```

### 3. 启动后端服务

```bash
cd backend

# 方式一：使用Maven
mvn clean install
mvn spring-boot:run

# 方式二：使用启动脚本（Windows）
start-backend.bat
```

后端服务将在 `http://localhost:8080/api` 启动

### 4. 启动前端服务

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将在 `http://localhost:3002` 启动（端口可能因环境而异）

### 5. 访问应用

打开浏览器访问：`http://localhost:3002`

---

## 📋 功能模块

### 🔐 用户模块

| 功能 | 说明 |
|------|------|
| 用户注册 | 支持用户名、邮箱、手机号注册 |
| 用户登录 | JWT令牌认证，支持记住登录状态 |
| 个人中心 | 查看和修改个人信息、上传头像 |
| 密码管理 | 安全密码加密存储（BCrypt） |

### 📚 书籍模块

| 功能 | 说明 |
|------|------|
| 书籍发布 | 填写书名、作者、ISBN、分类、成色、价格等信息 |
| 书籍浏览 | 首页展示最新书籍，支持分页加载 |
| 书籍搜索 | 支持关键词搜索，可按分类筛选 |
| 书籍详情 | 展示书籍完整信息、卖家信息 |
| 图片上传 | 支持多图上传，自动压缩处理 |

### 📦 订单模块

| 功能 | 说明 |
|------|------|
| 创建订单 | 选择收货地址，生成订单 |
| 订单列表 | 查看所有订单，按状态筛选 |
| 订单详情 | 查看订单完整信息 |
| 订单状态 | 待付款 → 待发货 → 待收货 → 已完成 |
| 取消订单 | 支持取消未发货订单 |

### 📍 地址模块

| 功能 | 说明 |
|------|------|
| 地址列表 | 管理多个收货地址 |
| 新增地址 | 添加新收货地址 |
| 编辑地址 | 修改已有地址信息 |
| 删除地址 | 删除不需要的地址 |
| 默认地址 | 设置默认收货地址 |

---

## 🔌 API 接口文档

### 基础信息

- **Base URL**: `http://localhost:8080/api`
- **认证方式**: Bearer Token (JWT)
- **Content-Type**: `application/json`

### 接口列表

#### 用户相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/user/register` | 用户注册 | 否 |
| POST | `/user/login` | 用户登录 | 否 |
| GET | `/user/profile` | 获取用户信息 | 是 |
| PUT | `/user/profile` | 更新用户信息 | 是 |

**登录请求示例：**

```json
{
  "username": "student001",
  "password": "yourpassword"
}
```

**登录响应示例：**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": "eyJhbGciOiJIUzI1NiJ9..."
}
```

#### 书籍相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/books` | 获取书籍列表 | 否 |
| GET | `/books/:id` | 获取书籍详情 | 否 |
| POST | `/books` | 发布书籍 | 是 |
| PUT | `/books/:id` | 更新书籍 | 是 |
| DELETE | `/books/:id` | 删除书籍 | 是 |
| GET | `/books/search` | 搜索书籍 | 否 |

**发布书籍请求示例：**

```json
{
  "title": "高等数学（上册）",
  "author": "同济大学数学系",
  "isbn": "9787040589818",
  "category": "Textbook",
  "condition": "Like New",
  "price": 25.00,
  "description": "九成新，有少量笔记",
  "stock": 1,
  "deliveryType": "campus_pickup",
  "images": ["uploads/book_001.jpg"]
}
```

#### 订单相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/orders` | 创建订单 | 是 |
| GET | `/orders` | 获取订单列表 | 是 |
| GET | `/orders/:id` | 获取订单详情 | 是 |
| PUT | `/orders/:id/cancel` | 取消订单 | 是 |
| PUT | `/orders/:id/confirm` | 确认收货 | 是 |

#### 地址相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/addresses` | 获取地址列表 | 是 |
| POST | `/addresses` | 新增地址 | 是 |
| PUT | `/addresses/:id` | 更新地址 | 是 |
| DELETE | `/addresses/:id` | 删除地址 | 是 |
| PUT | `/addresses/:id/default` | 设置默认地址 | 是 |

#### 文件上传

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/upload/image` | 上传图片 | 是 |

---

## 📊 数据模型

### 用户表 (user)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(255) | 密码（BCrypt加密） |
| nickname | VARCHAR(50) | 昵称 |
| avatar | VARCHAR(255) | 头像URL |
| phone | VARCHAR(20) | 手机号 |
| email | VARCHAR(100) | 邮箱 |
| created_at | DATETIME | 注册时间 |

### 书籍表 (book)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| title | VARCHAR(200) | 书名 |
| author | VARCHAR(100) | 作者 |
| isbn | VARCHAR(20) | ISBN |
| category | VARCHAR(50) | 分类 |
| condition | VARCHAR(20) | 成色 |
| price | DECIMAL(10,2) | 价格 |
| description | TEXT | 描述 |
| stock | INT | 库存 |
| delivery_type | VARCHAR(20) | 交易方式 |
| images | TEXT | 图片JSON数组 |
| user_id | INT | 卖家ID |
| status | INT | 状态（1:上架 0:下架） |
| view_count | INT | 浏览量 |
| created_at | DATETIME | 发布时间 |

### 订单表 (order_table)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| order_no | VARCHAR(50) | 订单号，唯一 |
| user_id | INT | 买家ID |
| book_id | INT | 书籍ID |
| address_id | INT | 地址ID |
| total_price | DECIMAL(10,2) | 总价 |
| status | INT | 订单状态 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 地址表 (address)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| user_id | INT | 用户ID |
| receiver | VARCHAR(50) | 收货人 |
| phone | VARCHAR(20) | 电话 |
| address | VARCHAR(255) | 详细地址 |
| is_default | INT | 是否默认（1:是 0:否） |

---

## 🔧 配置说明

### 后端配置 (application.yml)

```yaml
server:
  port: 8080                    # 服务端口号
  servlet:
    context-path: /api          # API前缀

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/campusbook?...
    username: root
    password: your_password

jwt:
  secret: your-secret-key       # JWT密钥（至少32字符）
  expiration: 86400000          # Token过期时间（毫秒）

upload:
  path: uploads                 # 文件上传路径
```

### 前端配置 (vite.config.js)

```javascript
export default defineConfig({
  server: {
    port: 3002,                 # 前端端口号
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  # 后端地址
        changeOrigin: true
      }
    }
  }
})
```

---

## 🐛 常见问题

### Q1: 登录时提示 "401 Unauthorized"

**原因**：JWT令牌验证失败

**解决方案**：
1. 检查 `application.yml` 中的 `jwt.secret` 是否至少32个字符
2. 清除浏览器缓存和LocalStorage中的token
3. 重新登录获取新token

### Q2: 数据库连接失败

**原因**：MySQL配置不正确

**解决方案**：
1. 确认MySQL服务已启动
2. 检查 `application.yml` 中的数据库连接信息
3. 确认数据库 `campusbook` 已创建
4. 检查MySQL用户权限

### Q3: 图片上传失败

**原因**：上传目录不存在或无写入权限

**解决方案**：
1. 在项目根目录创建 `uploads` 文件夹
2. 确保应用有该目录的写入权限
3. 检查 `application.yml` 中的 `upload.path` 配置

### Q4: 前端请求跨域错误

**原因**：CORS配置问题

**解决方案**：
1. 检查 `WebConfig.java` 中的CORS配置
2. 确认前端端口已添加到允许列表
3. 确保后端服务已重启

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 提交Issue

- 使用清晰的标题描述问题
- 提供详细的复现步骤
- 附上相关的错误日志
- 标注问题类型（bug/feature/question）

### 提交PR

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范

**前端**：
- 使用 ESLint 进行代码检查
- 遵循 React 最佳实践
- 组件使用函数式组件 + Hooks

**后端**：
- 遵循阿里巴巴 Java 开发手册
- 使用统一的代码格式化工具
- 添加必要的注释说明

### 提交信息规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

---

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

```
MIT License

Copyright (c) 2024 CampusBook Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 联系方式

- **项目主页**: https://github.com/yourusername/CampusBook
- **问题反馈**: https://github.com/yourusername/CampusBook/issues
- **邮箱**: campusbook@example.com

---

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

<p align="center">
  Made with ❤️ by CampusBook Team
</p>

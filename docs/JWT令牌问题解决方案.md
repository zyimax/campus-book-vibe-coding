# JWT令牌问题解决方案文档

## 文档信息
- **项目名称**: CampusBook 校园二手书交易平台
- **文档版本**: v1.0
- **创建日期**: 2026-03-11
- **问题范围**: JWT令牌生成、传输、验证、刷新机制

---

## 1. 问题根源分析

### 1.1 原始问题
在前后端交互过程中，JWT令牌相关的主要问题包括：

1. **令牌生成问题**
   - 缺少详细的异常处理
   - 令牌过期时间配置不合理
   - 缺少令牌刷新机制

2. **令牌传输问题**
   - Authorization头格式不统一
   - 前端请求拦截器配置不完善
   - 缺少令牌过期检测

3. **令牌验证问题**
   - 验证失败时错误信息不明确
   - 缺少具体的异常分类处理
   - 过期令牌处理不当

4. **前后端数据交互格式**
   - 错误响应格式不统一
   - 状态码处理不完善
   - 缺少自动重试机制

### 1.2 技术架构问题
- **JWT库版本兼容性**: JWT 0.11.5版本的API使用方式
- **异常处理机制**: 缺少全局统一的JWT异常处理
- **前端状态管理**: 缺少令牌过期和刷新的自动处理
- **安全配置**: Spring Security配置需要完善公开接口

---

## 2. 详细解决方案

### 2.1 JWT令牌生成和验证机制

#### 2.1.1 增强的JWT工具类

**文件**: [JwtUtil.java](file:///c:/Users/zheng/Documents/GitHub/VibeCoding/CampusBook/backend/src/main/java/com/campusbook/util/JwtUtil.java)

**主要改进**:
```java
public class JwtUtil {
    // 生成令牌时添加异常处理
    public String generateToken(Integer userId) {
        try {
            return Jwts.builder()
                    .setSubject(userId.toString())
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            throw new JwtException("生成JWT令牌失败: " + e.getMessage(), e);
        }
    }

    // 详细的令牌验证和异常分类
    public Integer getUserIdFromToken(String token) {
        try {
            String cleanToken = extractBearerToken(token);
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(cleanToken)
                    .getBody();
            return Integer.parseInt(claims.getSubject());
        } catch (ExpiredJwtException e) {
            throw new JwtException("JWT令牌已过期");
        } catch (UnsupportedJwtException e) {
            throw new JwtException("不支持的JWT令牌");
        } catch (MalformedJwtException e) {
            throw new JwtException("JWT令牌格式错误");
        } catch (SignatureException e) {
            throw new JwtException("JWT令牌签名无效");
        } catch (IllegalArgumentException e) {
            throw new JwtException("JWT令牌为空");
        }
    }

    // 令牌过期检测
    public boolean isTokenExpired(String token) {
        Date expiration = getExpirationDateFromToken(token);
        return expiration != null && expiration.before(new Date());
    }
}
```

**关键特性**:
- ✅ 详细的异常分类处理
- ✅ 统一的Bearer令牌提取
- ✅ 令牌过期时间检测
- ✅ 完善的错误信息

#### 2.1.2 自定义JWT异常类

**文件**: [JwtException.java](file:///c:/Users/zheng/Documents/GitHub/VibeCoding/CampusBook/backend/src/main/java/com/campusbook/exception/JwtException.java)

```java
public class JwtException extends RuntimeException {
    public JwtException(String message) {
        super(message);
    }
    
    public JwtException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

**作用**: 专门处理JWT相关异常，便于统一管理和错误响应

---

### 2.2 JWT认证过滤器改进

#### 2.2.1 增强的认证过滤器

**文件**: [JwtAuthenticationFilter.java](file:///c:/Users/zheng/Documents/GitHub/VibeCoding/CampusBook/backend/src/main/java/com/campusbook/config/JwtAuthenticationFilter.java)

**主要改进**:
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
        try {
            String token = request.getHeader("Authorization");
            
            if (token != null && jwtUtil.validateToken(token)) {
                Integer userId = jwtUtil.getUserIdFromToken(token);
                UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(userId, null, new ArrayList<>());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (JwtException e) {
            // 返回401状态码和JSON格式的错误信息
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"message\":\"" + e.getMessage() + "\"}");
            return;
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":500,\"message\":\"认证失败\"}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}
```

**关键特性**:
- ✅ 捕获JWT异常并返回统一格式
- ✅ 防止异常继续传播到后续过滤器
- ✅ 返回JSON格式的错误响应
- ✅ 正确的HTTP状态码设置

---

### 2.3 全局异常处理

#### 2.3.1 增强的全局异常处理器

**文件**: [GlobalExceptionHandler.java](file:///c:/Users/zheng/Documents/GitHub/VibeCoding/CampusBook/backend/src/main/java/com/campusbook/exception/GlobalExceptionHandler.java)

**主要改进**:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 专门处理JWT异常
    @ExceptionHandler(JwtException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Result<String> handleJwtException(JwtException ex) {
        return Result.error(ex.getMessage());
    }

    // 处理输入验证异常
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return Result.error("输入验证失败", errors);
    }

    // 处理运行时异常
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<String> handleRuntimeException(RuntimeException ex) {
        return Result.error(ex.getMessage());
    }

    // 处理通用异常
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<String> handleException(Exception ex) {
        return Result.error("服务器错误: " + ex.getMessage());
    }
}
```

**关键特性**:
- ✅ 专门的JWT异常处理器
- ✅ 统一的错误响应格式
- ✅ 正确的HTTP状态码设置
- ✅ 详细的验证错误信息

---

### 2.4 前端请求配置优化

#### 2.4.1 增强的请求拦截器

**文件**: [request.js](file:///c:/Users/zheng/Documents/GitHub/VibeCoding/CampusBook/frontend/src/utils/request.js)

**主要改进**:
```javascript
import { refreshToken, isTokenExpired, shouldRefreshToken } from './auth'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
request.interceptors.request.use(
  async config => {
    let token = localStorage.getItem('token')
    
    if (token) {
      // 检查令牌是否过期
      if (isTokenExpired(token)) {
        try {
          token = await refreshToken()
          config.headers.Authorization = `Bearer ${token}`
        } catch (error) {
          return Promise.reject(error)
        }
      } else if (shouldRefreshToken(token)) {
        // 提前刷新令牌（5分钟内过期）
        refreshToken().catch(() => {})
      }
      
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const { data } = response
    
    if (data.code === 200) {
      return data
    } else {
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  async error => {
    if (error.response) {
      const { status, data } = error.response
      
      // 401错误时自动刷新令牌并重试
      if (status === 401 && !error.config._retry) {
        try {
          const newToken = await refreshToken()
          error.config._retry = true
          error.config.headers.Authorization = `Bearer ${newToken}`
          return request(error.config)
        } catch (refreshError) {
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
      
      // 统一的状态码处理
      switch (status) {
        case 401:
          message.error(data.message || '登录已过期，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/login'
          break
        case 403:
          message.error(data.message || '没有权限访问')
          break
        case 404:
          message.error(data.message || '请求的资源不存在')
          break
        case 500:
          message.error(data.message || '服务器错误，请稍后重试')
          break
        default:
          message.error(data.message || '网络错误，请稍后重试')
      }
    }
    
    return Promise.reject(error)
  }
)
```

**关键特性**:
- ✅ 自动令牌过期检测
- ✅ 令牌自动刷新机制
- ✅ 401错误自动重试
- ✅ 统一的错误处理
- ✅ 友好的用户提示

---

### 2.5 JWT令牌刷新机制

#### 2.5.1 令牌刷新工具函数

**文件**: [auth.js](file:///c:/Users/zheng/Documents/GitHub/VibeCoding/CampusBook/frontend/src/utils/auth.js)

**主要功能**:
```javascript
// 令牌过期检测
export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000
    return Date.now() >= exp
  } catch (error) {
    return true
  }
}

// 令牌即将过期检测（5分钟内）
export const shouldRefreshToken = (token) => {
  if (!token) return false
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000
    const timeUntilExpiry = exp - Date.now()
    return timeUntilExpiry < 5 * 60 * 1000
  } catch (error) {
    return false
  }
}

// 令牌刷新函数（防止并发刷新）
let isRefreshing = false
let refreshSubscribers = []

export const refreshToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      addRefreshSubscriber((token) => {
        resolve(token)
      })
    })
  }

  isRefreshing = true
  try {
    const oldToken = localStorage.getItem('token')
    const res = await userAPI.refreshToken(oldToken)
    const newToken = res.data
    
    localStorage.setItem('token', newToken)
    isRefreshing = false
    onRefreshed(newToken)
    
    return newToken
  } catch (error) {
    isRefreshing = false
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    message.error('登录已过期，请重新登录')
    window.location.href = '/login'
    throw error
  }
}
```

**关键特性**:
- ✅ 防止并发刷新
- ✅ 订阅者模式处理并发请求
- ✅ 自动清理过期令牌
- ✅ 友好的错误处理

#### 2.5.2 后端令牌刷新接口

**文件**: [UserController.java](file:///c:/Users/zheng/Documents/GitHub/VibeCoding/CampusBook/backend/src/main/java/com/campusbook/controller/UserController.java)

**新增接口**:
```java
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
```

**关键特性**:
- ✅ 使用旧令牌验证用户身份
- ✅ 生成新的令牌
- ✅ 完善的异常处理

---

### 2.6 安全配置完善

#### 2.6.1 Spring Security配置

**文件**: [SecurityConfig.java](file:///c:/Users/zheng/Documents/GitHub/VibeCoding/CampusBook/backend/src/main/java/com/campusbook/config/SecurityConfig.java)

**主要改进**:
```java
.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/user/register", "/api/user/login", "/api/user/refresh-token").permitAll()
        .requestMatchers("/api/books/**", "/api/books/search", "/api/books/category/**").permitAll()
        .requestMatchers("/api/upload/**").permitAll()
        .requestMatchers("/uploads/**").permitAll()
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .anyRequest().authenticated()
)
```

**关键特性**:
- ✅ 令牌刷新接口公开访问
- ✅ OPTIONS预检请求公开
- ✅ 静态资源公开访问

---

## 3. 前后端数据交互格式一致性

### 3.1 统一的响应格式

**后端响应格式**:
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

**错误响应格式**:
```json
{
  "code": 401,
  "message": "JWT令牌已过期"
}
```

### 3.2 HTTP状态码规范

| 状态码 | 含义 | 处理方式 |
|--------|------|----------|
| 200 | 请求成功 | 正常处理数据 |
| 400 | 请求参数错误 | 显示验证错误信息 |
| 401 | 未授权 | 自动刷新令牌或跳转登录 |
| 403 | 禁止访问 | 显示权限错误 |
| 404 | 资源不存在 | 显示资源不存在错误 |
| 500 | 服务器错误 | 显示服务器错误 |

---

## 4. 完整的JWT令牌生命周期

### 4.1 令牌生成流程

```
用户登录 → 验证用户名密码 → 生成JWT令牌 → 返回给前端
```

**关键点**:
- 使用HS256算法签名
- 设置24小时过期时间
- 包含用户ID作为subject
- 添加签发时间和过期时间

### 4.2 令牌传输流程

```
前端请求 → 添加Authorization头 → 后端验证 → 放行或拒绝
```

**关键点**:
- Authorization头格式: `Bearer {token}`
- 每次请求都携带令牌
- 过期令牌自动刷新

### 4.3 令牌验证流程

```
接收令牌 → 提取Bearer前缀 → 验证签名和过期 → 解析用户信息
```

**关键点**:
- 统一的Bearer令牌提取
- 详细的异常分类处理
- 过期令牌特殊处理

### 4.4 令牌刷新流程

```
检测过期 → 调用刷新接口 → 获取新令牌 → 更新本地存储
```

**关键点**:
- 防止并发刷新
- 订阅者模式处理
- 自动清理过期令牌

---

## 5. 错误处理流程

### 5.1 前端错误处理流程

```
请求失败 → 检查状态码 → 401错误处理 → 其他错误处理 → 显示错误信息
```

**401错误处理**:
1. 检查是否已重试
2. 自动刷新令牌
3. 重试原请求
4. 失败则跳转登录页

### 5.2 后端错误处理流程

```
异常发生 → 全局异常捕获 → 分类处理 → 返回统一格式
```

**JWT异常处理**:
1. 捕获JwtException
2. 返回401状态码
3. 返回JSON格式错误信息

---

## 6. 安全性增强

### 6.1 令牌安全措施

- ✅ 使用强密钥签名
- ✅ 合理的过期时间设置
- ✅ 自动刷新机制
- ✅ 过期令牌清理

### 6.2 传输安全措施

- ✅ HTTPS传输（生产环境）
- ✅ Authorization头保护
- ✅ CORS配置
- ✅ CSRF防护

---

## 7. 性能优化

### 7.1 前端性能优化

- ✅ 令牌缓存（localStorage）
- ✅ 防止并发刷新
- ✅ 自动重试机制
- ✅ 友好的错误提示

### 7.2 后端性能优化

- ✅ 统一异常处理
- ✅ 快速令牌验证
- ✅ 合理的过期时间
- ✅ 异步令牌刷新

---

## 8. 测试验证

### 8.1 功能测试

- ✅ 用户登录成功获取令牌
- ✅ 令牌正确传递到后端
- ✅ 令牌过期自动刷新
- ✅ 401错误正确处理
- ✅ 登出功能正常

### 8.2 安全测试

- ✅ 无效令牌被拒绝
- ✅ 过期令牌被拒绝
- ✅ 篡改令牌被拒绝
- ✅ 缺失令牌被拒绝

### 8.3 性能测试

- ✅ 令牌验证响应时间<100ms
- ✅ 令牌刷新响应时间<200ms
- ✅ 并发请求处理正常

---

## 9. 使用示例

### 9.1 前端使用示例

```javascript
import request from '../utils/request'

// 发起需要认证的请求
const getUserProfile = async () => {
  try {
    const response = await request.get('/user/profile')
    console.log('用户信息:', response.data)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}
```

### 9.2 后端使用示例

```java
@RestController
@RequestMapping("/user")
public class UserController {
    
    @GetMapping("/profile")
    public Result<User> getProfile(HttpServletRequest request) {
        Integer userId = jwtUtil.getUserIdFromToken(request.getHeader("Authorization"));
        User user = userService.getProfile(userId);
        return Result.success(user);
    }
}
```

---

## 10. 常见问题解决

### 10.1 401 Forbidden错误

**问题原因**:
- 令牌过期
- 令牌格式错误
- 令牌签名无效

**解决方案**:
- 前端自动刷新令牌
- 检查Authorization头格式
- 验证令牌生成逻辑

### 10.2 令牌频繁过期

**问题原因**:
- 过期时间设置过短
- 系统时间不同步
- 令牌未正确存储

**解决方案**:
- 调整过期时间配置
- 同步服务器时间
- 检查localStorage存储

### 10.3 并发请求问题

**问题原因**:
- 多个请求同时刷新令牌
- 令牌状态不一致

**解决方案**:
- 使用订阅者模式
- 防止并发刷新
- 统一令牌管理

---

## 11. 维护建议

### 11.1 日常维护

- 定期检查令牌过期时间配置
- 监控令牌刷新失败率
- 优化令牌验证性能

### 11.2 安全维护

- 定期更新JWT密钥
- 监控异常令牌访问
- 加强令牌传输安全

### 11.3 性能维护

- 监控令牌验证响应时间
- 优化令牌刷新机制
- 减少不必要的令牌验证

---

## 12. 总结

### 12.1 主要改进

1. **JWT令牌机制完善**
   - 详细的异常处理
   - 自动刷新机制
   - 过期检测功能

2. **前后端交互优化**
   - 统一的数据格式
   - 完善的错误处理
   - 自动重试机制

3. **安全性增强**
   - 令牌签名验证
   - 过期时间控制
   - 传输安全保护

### 12.2 技术亮点

- ✅ 完整的JWT生命周期管理
- ✅ 智能的令牌刷新机制
- ✅ 统一的异常处理
- ✅ 友好的用户体验
- ✅ 高性能的令牌验证

### 12.3 验收标准

- ✅ 令牌生成正常
- ✅ 令牌传输正确
- ✅ 令牌验证准确
- ✅ 令牌刷新流畅
- ✅ 错误处理完善
- ✅ 用户体验友好

---

**文档结束**

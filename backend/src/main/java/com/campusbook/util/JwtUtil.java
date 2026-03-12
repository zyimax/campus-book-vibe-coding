package com.campusbook.util;

import com.campusbook.exception.JwtException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Integer userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

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
        } catch (Exception e) {
            throw new JwtException("解析JWT令牌失败: " + e.getMessage(), e);
        }
    }

    public boolean validateToken(String token) {
        try {
            String cleanToken = extractBearerToken(token);
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(cleanToken);
            return true;
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
        } catch (Exception e) {
            return false;
        }
    }

    public Date getExpirationDateFromToken(String token) {
        try {
            String cleanToken = extractBearerToken(token);
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(cleanToken)
                    .getBody();
            return claims.getExpiration();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            return expiration != null && expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    public String extractBearerToken(String token) {
        if (token == null) {
            throw new JwtException("JWT令牌为空");
        }
        if (token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return token;
    }

    public Long getExpirationTime() {
        return expiration;
    }
}

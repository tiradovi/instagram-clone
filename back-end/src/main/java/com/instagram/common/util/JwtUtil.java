package com.instagram.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 토큰 생성 및 검증 유틸리티
 * JwtUtil = 디지털 학생증 발급기
 * <p>
 * secretKeyString : 위조를 방지하기 위한 학교만의 비밀 도장 낙인
 * expirationTime : 24시간의 유효기간
 * <p>
 * getSigningKey() : 학교 비밀 도장을 꺼내 준비하는 과정 (secret에서 작성한 문자열을 실제 도장으로 변환)
 * generateToken() : 학생증 만들기(로그 있을 때 24시간 유효한 기간제 학생증)
 * getUserIdFromToken() : 학생증에서 학번 읽기
 * getUserEmailFromToken() : 학생증에서 이메일 읽기
 * validateToken() : 학생증이 가짜인지 진짜인지 확인(API 요청시 진실된 학생증인지 확인 유무)
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKeyString;

    @Value("${jwt.expiration}")
    private long expirationTime;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * JWT 토큰 생성
     * 토큰의 형태는 sdagsadgiwegnzxczxcbiowe 와 같은 형식
     */
    public String generateToken(int userId, String userEmail) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + expirationTime);  // 현재시간 기준 + 24시간 유효기간 설정

        return Jwts.builder()
                .subject(String.valueOf(userId)) // 학번
                .claim("email", userEmail)  // 이메일
                .issuedAt(now)  // 발급일
                .expiration(validity) // 도장 만료일
                .signWith(getSigningKey()) // 도장 찍기
                .compact(); // 학생증 완성
    }

    /**
     * 토큰에서 사용자 ID 추출
     */
    public int getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return Integer.parseInt(claims.getSubject());
    }

    /**
     * 토큰에서 이메일 추출
     */
    public String getUserEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("email", String.class);
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

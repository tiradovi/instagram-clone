package com.instagram.user.model.service;

import com.instagram.user.model.dto.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    // 회원가입
    void signUp(User user);

    // 로그인
    User login(String userEmail, String userPassword);

    // 아이디로 유저정보 가져오기
    User getUserByUserId(int userId);

    // 이메일로 유저정보 가져오기
    User getUserByUserEmail(String userEmail);

    // 일부 단어로 유저들 검색
    List<User> searchUsers(String query);

    // 유저이름으로 유저 정보 조회
    User getUserByUsername(String userName);

    User updateUser(User user, MultipartFile file);
}

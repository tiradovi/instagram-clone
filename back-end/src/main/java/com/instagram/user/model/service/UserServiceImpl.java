package com.instagram.user.model.service;

import com.instagram.user.model.dto.User;
import com.instagram.user.model.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void signUp(User user) {
        String existUserEmail = userMapper.selectUserByUserEmail(user.getUserEmail());
        String existUserName = userMapper.selectUserByUsername(user.getUserName());

        if (existUserEmail != null) throw new RuntimeException("이미 존재하는 이메일");
        if (existUserName != null) throw new RuntimeException("이미 존재하는 사용자명");

        //기본 아바타 설정
        if (user.getUserAvatar() == null || user.getUserAvatar().isEmpty()) {
            user.setUserAvatar("default-avatar.png");
        }

        // 비밀번호 암호화 저장
        user.setUserPassword(bCryptPasswordEncoder.encode(user.getUserPassword()));

        // db에 저장할 유저를 encode하여 저장
        userMapper.insertUser(user);
        log.info("회원가입 완료 - 이메일: {}, 사용자명: {}", user.getUserEmail(), user.getUserName());
    }

    @Override
    public User login(String userEmail, String userPassword) {
        // 이메일로 사용자 조회
        User existUser = userMapper.selectUserByUserEmail(userEmail);

        if(existUser == null){
            log.warn("로그인 실패 - 존재하지 않는 이메일: {}",userEmail);
            return null;
        }

        // 비밀번호 검증
        if(!bCryptPasswordEncoder.matches(userPassword,existUser.getUserPassword())){
            log.warn("로그인 실패 - 잘못된 비밀번호 : {}",userEmail);
            return null;
        }

        // 비밀번호는 응답에서 제거
        existUser.setUserPassword(null);
        log.info("로그인 성공");


        return null;
    }

    @Override
    public User getUserById(String userEmail) {
        return null;
    }

    @Override
    public User getUserByUsername(String userName) {
        return null;
    }
}

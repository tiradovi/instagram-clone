package com.instagram.user.model.service;

import com.instagram.common.util.FileUploadService;
import com.instagram.user.model.dto.User;
import com.instagram.user.model.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FileUploadService fileUploadService;

    @Override
    public void signUp(User user) {
        User existUserEmail = userMapper.selectUserByUserEmail(user.getUserEmail());
        String existUserName = userMapper.selectUserNameByUsername(user.getUserName());

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
        User user = userMapper.selectUserByUserEmail(userEmail);

        if (user == null) {
            log.warn("로그인 실패 - 존재하지 않는 이메일: {}", userEmail);
            return null;
        }

        // 비밀번호 검증
        if (!bCryptPasswordEncoder.matches(userPassword, user.getUserPassword())) {
            log.warn("로그인 실패 - 잘못된 비밀번호 : {}", userEmail);
            return null;
        }

        // 비밀번호는 응답에서 제거
        user.setUserPassword(null);
        log.info("로그인 성공 - 이메일: {}", user.getUserEmail());

        return user;
    }

    @Override
    public User getUserByUserId(int userId) {
        return userMapper.selectUserByUserId(userId);
    }

    @Override
    public User getUserByUserEmail(String userEmail) {
        return userMapper.selectUserByUserEmail(userEmail);
    }

    @Override
    public List<User> searchUsers(String query) {
        if (query == null || query.isEmpty()) return List.of();
        try {
            return userMapper.searchUsersByUserName(query);
        } catch (Exception e) {
            log.error(e.getMessage());
            return List.of();
        }
    }

    @Override
    public User getUserByUsername(String userName) {
        if (userName == null || userName.isEmpty()) return null;
        try {
            return userMapper.selectUserByUserNameExact(userName);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }


    @Override
    @Transactional
    public User updateUser(User user, MultipartFile file) {
        try {

            User existUser = userMapper.selectUserByUserId(user.getUserId());

            if (existUser != null) {

                if (!file.isEmpty() && file != null) {
                    String newAvatarPath = fileUploadService.uploadProfileImage(file);
                    existUser.setUserAvatar(newAvatarPath);
                } else {
                    existUser.setUserAvatar(existUser.getUserAvatar());
                }
                if (user.getUserName() != null)
                    existUser.setUserName(user.getUserName());
                if (user.getUserEmail() != null)
                    existUser.setUserEmail(user.getUserEmail());
                if (user.getUserFullname() != null)
                    existUser.setUserFullname(user.getUserFullname());

                userMapper.updateUser(existUser);

                existUser.setUserPassword(null);
                return existUser;
            } else {
                log.error("유저 없음");
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }
}

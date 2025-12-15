package com.instagram.user.model.mapper;

import com.instagram.user.model.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {
    // 모든 사용자 확인
    List<User> selectAllUsers();

    // userId를 이용한 사용자 조회
    User selectUserByUserId(int userId);

    // 유저 명칭을 이용한 사용자 명칭 조회
    String selectUserNameByUsername(String userName);

    // email을 이용한 사용자 이메일 조회
    User selectUserByUserEmail(String userEmail);

    // 비밀번호 확인
    User selectUserByUserPassword(String userPassword);

    // 유저 이름 일부로 검색
    List<User> searchUsersByUserName(@Param("userName") String query);

    // 유저네임으로 정확히 일치하는 유저 조회
    User selectUserByUserNameExact(String userName);

    // 사용자 생성
    void insertUser(User user);

    // 사용자 수정
    void updateUser(User user);

    // 사용자 삭제
    void deleteUser(int userId);

}

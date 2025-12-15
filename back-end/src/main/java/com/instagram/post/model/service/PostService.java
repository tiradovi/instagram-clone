package com.instagram.post.model.service;

import com.instagram.post.model.dto.Post;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PostService {
    // 모든 게시물 조회(= 로그인시 팔로워하는 지인 기준)
    // 새로운 게시물들 팔로우 안한 유저 게시물 사용 가능
    List<Post> getAllPosts(int currentUserId);

    // 나의 피드나 특정 유저의 피드로 접속했을 때 유저가 올린 게시물들 조회
    List<Post> getPostsByUserId(int userId);

    // 나의 피드나 특정 유저의 피드로 접속했을 때 특정 피드를 선택하여 피드 게시물 세부사항 조회
    Post getPostById(int postId, int currentUserId);

    // 게시물 생성
    void createPost(MultipartFile postImage, String postCaption, String postLocation, int currentUserId) throws IOException;

    // 게시물 삭제
    void deletePost(int postId);

    // 게시물 좋아요 추가
    void addLike(int postId, int userId);

    // 게시물 좋아요 삭제
    void removeLike(int postId, int userId);
}

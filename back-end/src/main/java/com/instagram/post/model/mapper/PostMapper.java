package com.instagram.post.model.mapper;

import com.instagram.post.model.dto.Post;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostMapper {

    // 게시물 전체 조회
    List<Post> selectAllPosts(int currentUserId);

    // 특정 게시물 조회
    Post selectPostByPostId(int postId, int currentUserId);

    // 특정 유저 게시물 조회
    List<Post> selectPostsByUserId(int userId);

    // 게시물 생성
    int insertPost(Post post);

    // 게시물 삭제
    int deletePost(int postId);

    int insertLike(int postId, int userId);

    int deleteLike(int postId, int userId);

    // 좋아요 존재 여부 (필요할 때만)
    int existsLike(int postId, int userId);
}

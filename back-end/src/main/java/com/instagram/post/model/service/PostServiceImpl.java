package com.instagram.post.model.service;

import com.instagram.common.util.FileUploadService;
import com.instagram.post.model.dto.Post;
import com.instagram.post.model.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;
    private final FileUploadService fileUploadService;

    @Override
    public List<Post> getAllPosts(int currentUserId) {
        return postMapper.selectAllPosts(currentUserId);
    }

    @Override
    public List<Post> getPostsByUserId(int userId) {
        return postMapper.selectPostsByUserId(userId);
    }

    @Override
    public Post getPostById(int postId, int currentUserId) {
        Post post = postMapper.selectPostByPostId(postId, currentUserId);
        if (post == null) {
            throw new IllegalArgumentException("게시물이 존재하지 않습니다.");
        }
        return post;
    }

    @Transactional
    @Override
    public void createPost(
            MultipartFile postImage,
            String postCaption,
            String postLocation,
            int currentUserId
    ) throws IOException {
        if (postImage == null || postImage.isEmpty()) {
            throw new IllegalArgumentException("이미지는 필수입니다.");
        }

        String imageUrl = fileUploadService.uploadPostImage(postImage);

        Post post = new Post();
        post.setUserId(currentUserId);
        post.setPostCaption(postCaption);
        post.setPostLocation(postLocation);
        post.setPostImage(imageUrl);

        int result = postMapper.insertPost(post);
        if (result == 0) {
            throw new IllegalStateException("게시물 저장에 실패했습니다.");
        }
    }

    @Transactional
    @Override
    public void deletePost(int postId) {
        int result = postMapper.deletePost(postId);
        if (result == 0) {
            throw new IllegalArgumentException("삭제할 게시물이 없습니다.");
        }
    }

    @Transactional
    @Override
    public void addLike(int postId, int userId) {
        int result = postMapper.insertLike(postId, userId);
        if (result == 0) {
            throw new IllegalStateException("좋아요 처리에 실패했습니다.");
        }
    }

    @Transactional
    @Override
    public void removeLike(int postId, int userId) {
        int result = postMapper.deleteLike(postId, userId);
        if (result == 0) {
            throw new IllegalStateException("좋아요 취소에 실패했습니다.");
        }
    }
}

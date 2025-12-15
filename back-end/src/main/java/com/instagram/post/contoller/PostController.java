package com.instagram.post.contoller;

import com.instagram.common.util.AuthUtil;
import com.instagram.post.model.dto.Post;
import com.instagram.post.model.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final AuthUtil authUtil;

    @PostMapping
    public ResponseEntity<Void> createPost(
            @RequestHeader("Authorization") String authHeader,
            @RequestPart MultipartFile postImage,
            @RequestPart String postCaption,
            @RequestPart String postLocation
    ) throws IOException {
        int currentUserId = authUtil.getCurrentUserId(authHeader);
        postService.createPost(postImage, postCaption, postLocation, currentUserId);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(@RequestHeader("Authorization") String authHeader) {
        int currentUserId = authUtil.getCurrentUserId(authHeader);
        return ResponseEntity.ok(postService.getAllPosts(currentUserId));
    }

    @GetMapping("/userId/{userId}")
    public ResponseEntity<List<Post>> getPostsByUserId(@PathVariable int userId) {
        return ResponseEntity.ok(postService.getPostsByUserId(userId));
    }

    @GetMapping("/postId/{postId}")
    public ResponseEntity<Post> getPostById(@RequestHeader("Authorization") String authHeader, @PathVariable int postId) {
        int currentUserId = authUtil.getCurrentUserId(authHeader);
        return ResponseEntity.ok(postService.getPostById(postId, currentUserId));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable int postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    /* ================= 좋아요 ================= */

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> addLike(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int postId
    ) {
        int currentUserId = authUtil.getCurrentUserId(authHeader);
        postService.addLike(postId, currentUserId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<Void> removeLike(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int postId
    ) {
        int currentUserId = authUtil.getCurrentUserId(authHeader);
        postService.removeLike(postId, currentUserId);
        return ResponseEntity.noContent().build();
    }
}

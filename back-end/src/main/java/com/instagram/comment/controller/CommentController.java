package com.instagram.comment.controller;


import com.instagram.comment.model.dto.CommentResponse;
import com.instagram.comment.model.service.CommentService;
import com.instagram.common.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;
    private final AuthUtil authUtil;

    /**
     * 게시물의 댓글 목록 조회
     */
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> getCommentsByPostId(@PathVariable int postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    /**
     * 댓글 작성
     */
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Void> createComment(
            @PathVariable int postId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody String commentContent
    ) {
        int currentUserId = authUtil.getCurrentUserId(authHeader);
        commentService.createComment(postId, currentUserId, commentContent);
        return ResponseEntity.ok().build();
    }

    /**
     * 댓글 삭제
     * DELETE /api/comments/{commentId}
     */
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable int commentId,
            @RequestHeader("Authorization") String authHeader
    ) {
        int currentUserId = authUtil.getCurrentUserId(authHeader);
        commentService.deleteCommentById(commentId, currentUserId);
        return ResponseEntity.ok().build();
    }

    /**
     * 댓글 수정
     * PUT /api/comments/{commentId}
     */
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Void> updateComment(
            @PathVariable int commentId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody String commentContent
    ) {
        int currentUserId = authUtil.getCurrentUserId(authHeader);
        commentService.updateComment(commentId, currentUserId, commentContent);
        return ResponseEntity.ok().build();
    }
}

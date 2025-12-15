package com.instagram.comment.model.service;

import com.instagram.comment.model.dto.CommentResponse;

public interface CommentService {

    CommentResponse getCommentsByPostId(int postId);

    void createComment(int postId, int userId, String commentContent);

    void deleteCommentById(int commentId, int currentUserId);

    void updateComment(int commentId, int currentUserId, String commentContent);
}

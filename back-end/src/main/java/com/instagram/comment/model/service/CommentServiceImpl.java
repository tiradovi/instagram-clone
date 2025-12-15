package com.instagram.comment.model.service;


import com.instagram.comment.model.dto.Comment;
import com.instagram.comment.model.dto.CommentResponse;
import com.instagram.comment.model.mapper.CommentMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;

    @Override
    public CommentResponse getCommentsByPostId(int postId) {
        List<Comment> comments = commentMapper.selectCommentsByPostId(postId);
        return new CommentResponse(comments);
    }

    @Override
    public void createComment(int postId, int userId, String commentContent) {
        Comment comment = new Comment();

        String content = commentContent;
        if (content.startsWith("\"") && content.endsWith("\"")) content = content.substring(1, content.length() - 1);

        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setCommentContent(content);

        int result = commentMapper.insertComment(comment);
        if (result == 0) {
            throw new IllegalStateException("댓글 작성 실패");
        }
    }

    @Override
    public void deleteCommentById(int commentId, int currentUserId) {
        Comment comment = commentMapper.selectCommentById(commentId);

        if (comment == null) throw new IllegalArgumentException("댓글이 존재하지 않습니다.");
        if (comment.getUserId() != currentUserId) throw new IllegalStateException("삭제 권한이 없습니다.");

        commentMapper.deleteCommentById(commentId);
    }

    @Override
    public void updateComment(int commentId, int currentUserId, String commentContent) {
        Comment comment = commentMapper.selectCommentById(commentId);

        if (comment == null) throw new IllegalArgumentException("댓글이 존재하지 않습니다.");
        if (comment.getUserId() != currentUserId) throw new IllegalStateException("수정 권한이 없습니다.");

        String content = commentContent;
        if (content.startsWith("\"") && content.endsWith("\"")) content = content.substring(1, content.length() - 1);

        commentMapper.updateComment(commentId, content);
    }
}

import React, {useEffect, useState} from 'react';
import {Heart, MessageCircle, Send, Bookmark, Trash2, Pencil} from 'lucide-react';
import {formatDate, getImageUrl} from '../service/commonService';

import Header from "../components/Header";
import {useNavigate, useParams} from "react-router-dom";
import apiService from "../service/apiService";
import PostOptionMenu from "../components/PostOptionMenu";
import MentionText from "../components/MentionText";
import {useAuth} from "../provider/AuthContext";

const PostDetailPage = () => {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [commentText, setCommentText] = useState('');

    const navigate = useNavigate();
    const {user} = useAuth();

    useEffect(() => {
        loadFeedData();
        loadComments();
    }, [postId, navigate]);

    const loadFeedData = async () => {
        setLoading(true);
        try {
            const postData = await apiService.getPostById(postId);
            setPost(postData);
        } catch (err) {
            alert("포스트 피드를 불러오는데 실패했습니다.")
        } finally {
            setLoading(false);
        }

    };
    const loadComments = async () => {
        try {
            const data = await apiService.getComments(postId);
            setComments(data.comments || []);
            setCommentCount(data.commentCount || 0);
        } catch (err) {
            console.error(err);
            setComments([]);
            setCommentCount(0);
        }
    };

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;

        try {
            await apiService.createComment(postId, commentText);

            setCommentText('');
            loadComments();
        } catch (err) {
            alert("댓글 작성에 실패했습니다.");
        }
    };
    const handleDeleteComment = async (commentId) => {
        try {
            await apiService.deleteComment(commentId);
            loadComments();
        } catch (err) {
            alert("댓글 삭제에 실패했습니다.");
        }
    };
    const handelUpdateComment = async (commentId) => {

    }

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/post/${post.postId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${post.userName}의 게시물`,
                    text: post.postCaption,
                    url: shareUrl
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard(shareUrl);
                }
            }
        } else {
            copyToClipboard(shareUrl);

        }
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('링크가 클립보트에 복사되었습니다.');
        }).catch(() => {
            alert("링크 복사에 실패했습니다.");
        })
    };
    const toggleLike = async () => {
        const isLiked = post.isLiked;

        setPost(prev => ({
            ...prev,
            isLiked: !isLiked,
            likeCount: prev.likeCount + (isLiked ? -1 : 1)
        }));

        try {
            if (isLiked) await apiService.removeLike(post.postId);
            else await apiService.addLike(post.postId);
        } catch (err) {
            alert("좋아요 처리에 실패했습니다.");
            loadFeedData();
        }
    };

    const deletePost = async (postId) => {
        try {
            await apiService.deletePost(postId);
            setPost(post.filter(p => p.postId !== postId));
            setSelectedPost(null);
            alert("게시물이 삭제되었습니다.");
        } catch (err) {
            alert("게시물 삭제에 실패했습니다.");
        }
    }

    if (loading || !post) {
        return (
            <div className="feed-container">
                <div style={{padding: '2rem', textAlign: 'center'}}>
                    로딩 중...
                </div>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <Header/>

            <div className="feed-content">
                <article key={post.postId} className="post-card">
                    <div className="post-header">
                        <div className="post-user-info">
                            <img src={getImageUrl(post.userAvatar)}
                                 className="post-user-avatar"
                                 style={{cursor: 'pointer'}}
                                 onClick={() => navigate(`/user/feed/${post.userId}`)}
                            />
                            <span className="post-username">{post.userName}</span>
                        </div>
                        <PostOptionMenu
                            post={post}
                            currentUserId={user.userId}
                            onDelete={deletePost}/>
                    </div>

                    <img src={post.postImage}
                         className="post-image"
                    />
                    <div className="post-content">
                        <div className="post-actions">
                            <div className="post-actions-left">
                                <Heart
                                    className={`action-icon like-icon ${post.isLiked ? 'liked' : ''}`}
                                    onClick={() => toggleLike(post.postId, post.isLiked)}
                                    fill={post.isLiked ? "#ed4956" : "none"}
                                />
                                <MessageCircle className="action-icon" onClick={handleShare}/>
                                <Send className="action-icon"/>
                            </div>
                            <Bookmark className="action-icon"/>
                        </div>

                        <div className="post-likes">
                            좋아요 {post.likeCount}개
                        </div>

                        <div className="post-caption">
                            <span className="post-caption-username">{post.userName}</span>
                            <MentionText text={post.postCaption}/>
                        </div>


                        <div className="comments-section">
                            {comments.length === 0 ? (
                                <div className="comments-empty">
                                    첫 번째 댓글을 남겨보세요!
                                </div>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.commentId} className="comment-item">
                                        <img
                                            src={getImageUrl(comment.userAvatar)}
                                            className="comment-avatar"
                                            alt="avatar"
                                        />

                                        <div className="comment-content">
                                            <div className="comment-text">
                                                    <span className="comment-username">
                                                        {comment.userName}
                                                    </span>
                                                <span className="comment-time">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                                <div>
                                                    <MentionText text={comment.commentContent}/>
                                                </div>
                                            </div>
                                        </div>

                                        {user.userId !== comment.userId && (
                                            <Heart
                                                size={24}
                                                className="comment-btn"

                                            />
                                        )}
                                        {user.userId === comment.userId && (
                                            <Pencil
                                                size={24}
                                                className="comment-btn"
                                                onClick={() => handelUpdateComment(comment.commentId)}
                                            />
                                        )}
                                        {user.userId === comment.userId && (
                                            <Trash2
                                                size={24}
                                                className="comment-btn"
                                                onClick={() => handleDeleteComment(comment.commentId)}
                                            />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {commentCount > 0 && (
                            <button className="post-comments-btn">
                                댓글 {commentCount}개
                            </button>
                        )}

                        <div className="comment-input-container">
                            <input
                                className="comment-input"
                                placeholder="댓글을 작성해주세요."
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleCommentSubmit();
                                }}
                            />
                            <button
                                className="comment-post-btn"
                                disabled={!commentText.trim()}
                                onClick={handleCommentSubmit}
                                style={{opacity: commentText.trim() ? 1 : 0.3}}
                            >
                                게시
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default PostDetailPage;
import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Heart, MessageCircle, Send, Bookmark, MoreHorizontal} from 'lucide-react';
import apiService from '../service/apiService';
import {getImageUrl} from '../service/commonService';
import MentionText from '../components/MentionText';
import Header from '../components/Header';
import {useAuth} from '../provider/AuthContext';

const PostDetailPage = () => {
    const {postId} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPostData();
    }, [postId, navigate]);

    const loadPostData = async () => {
        try {
            const data = await apiService.getPostByPostId(postId);
            setPost(data);
        } catch (err) {
            alert('게시물을 불러오는데 실패했습니다.');
            navigate('/feed');
        } finally {
            setLoading(false);
        }
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
        } catch {
            alert('좋아요 처리에 실패했습니다.');
        }
    };

    if (loading) {
        return <div style={{padding: '2rem', textAlign: 'center'}}>로딩중...</div>;
    }

    if (!post) return null;

    return (
        <div className="feed-container">
            <Header/>

            <div className="feed-content">
                <article className="post-card">
                    <div className="post-header">
                        <div className="post-user-info">
                            <img
                                src={getImageUrl(post.userAvatar)}
                                className="post-user-avatar"
                                alt="user"
                            />
                            <span className="post-username">
                                {post.userName}
                            </span>
                        </div>
                        <MoreHorizontal className="post-more-icon"/>
                    </div>

                    <img
                        src={post.postImage}
                        className="post-image"
                        alt="post"
                    />

                    <div className="post-content">
                        <div className="post-actions">
                            <div className="post-actions-left">
                                <Heart
                                    className={`action-icon like-icon ${post.isLiked ? 'liked' : ''}`}
                                    fill={post.isLiked ? '#ed4956' : 'none'}
                                    onClick={toggleLike}
                                />
                                <MessageCircle className="action-icon"/>
                                <Send className="action-icon"/>
                            </div>
                            <Bookmark className="action-icon"/>
                        </div>

                        <div className="post-likes">
                            좋아요 {post.likeCount}개
                        </div>

                        <div className="post-caption">
                            <span className="post-caption-username">
                                {post.userName}
                            </span>
                            <MentionText text={post.postCaption}/>
                        </div>

                        <div className="post-time">
                            {post.createdAt || '방금 전'}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default PostDetailPage;

import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';
import {Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, PlusSquare, Film, User} from 'lucide-react';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        loadFeedData();
    }, []);

    const loadFeedData = async () => {
        try {
            const postData = await apiService.getPosts();
            setPosts(postData);
        } catch (error) {
            alert("포스트 불러오기 실패");
        }
        try {
            const storyData = await apiService.getStories();
            setStories(storyData);
        } catch (error) {
            alert("스토리 불러오기 실패");
        } finally {
            setLoading(false);
        }
    };


    const toggleLike = async (postId, isLiked) => {
        try {
            if (isLiked) await apiService.removeLike(postId);
            else await apiService.addLike(postId);

            const postData = await apiService.getPosts();
            setPosts(postData);
        } catch (error) {
            alert("좋아요 설정 실패");
        }
    };


    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) apiService.logout();
    };

    // TODO: loading이 true면 "로딩 중..." 표시
    if (loading) {
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
            <header className="header">
                <div className="header-container">
                    <h1 className="header-title">Instagram</h1>
                    <div className="header-nav">
                        <Home className="header-icon"
                              onClick={() => navigate(('/'))}/>
                        <MessageCircle className="header-icon"/>
                        <PlusSquare className="header-icon" onClick={() => navigate(('/post/upload'))}/>
                        <Film className="header-icon" onClick={() => navigate(('/story/upload'))}/>
                        <User className="header-icon" onClick={handleLogout}/>
                    </div>
                </div>
            </header>

            <div className="feed-content">
                {stories.length > 0 && (
                    <div className="stories-container">
                        <div className="stories-wrapper">
                            {stories.map((story) => (
                                <div key={story.storyId} className="story-item">
                                    <div className="story-avatar-wrapper" key={story.storyId}>
                                        <img
                                            src={story.userAvatar ? story.userAvatar : '/static/img/default-avatar.jpg'}
                                            className="story-avatar" alt="스토리아바타"/>
                                    </div>
                                    <span className="story-username">{story.userName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {posts.length > 0 && (
                    posts.map((post) => (
                        <article key={post.postId} className="post-card">
                            <div className="post-header">
                                <div className="post-user-info">
                                    <img src={post.userAvatar ? post.userAvatar : '/static/img/default-avatar.jpg'}
                                         className="post-user-avatar" alt="유저아바타"/>
                                    <span className="post-username">{post.userName}</span>
                                </div>
                                <MoreHorizontal className="post-more-icon"/>
                            </div>

                            <img src={post.postImage} className="post-image" alt="포스트 이미지"/>
                            <div className="post-content">
                                <div className="post-actions">
                                    <div className="post-actions-left">
                                        <Heart
                                            className={`action-icon like-icon ${post.isLiked ? 'liked' : ''}`}
                                            onClick={() => toggleLike(post.postId, post.isLiked)}
                                            fill={post.isLiked ? "#ed4956" : "none"}
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
                                    <span className="post-caption-username">{post.userName}</span>
                                    {post.postCaption}
                                </div>
                                {post.commentCount > 0 && (
                                    <button className="post-comments-btn">
                                        댓글{post.commentCount}개 모두 보기
                                    </button>
                                )}
                                <div className="post-time">
                                    {post.createdAt || '방금 전'}
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
};

export default FeedPage;
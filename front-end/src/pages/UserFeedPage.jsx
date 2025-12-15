import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Grid, Bookmark } from 'lucide-react';
import apiService from "../service/apiService";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "../service/commonService";
import { useAuth } from "../provider/AuthContext";

const UserFeedPage = () => {
    const { user: authUser } = useAuth();
    const { userId } = useParams();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);

    const isMyFeed = authUser?.userId === Number(userId);

    useEffect(() => {
        if (!userId) return;
        loadUserFeed();
    }, [userId]);

    const loadUserFeed = async () => {
        setLoading(true);
        try {
            const profile = await apiService.getUserByUserId(userId);
            const userPosts = await apiService.getPostByUserId(userId);

            setProfileUser(profile);
            setPosts(userPosts);
        } catch (error) {
            console.error(error);
            alert("데이터를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="feed-container">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    로딩 중...
                </div>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <Header type="feed" />

            <main className="profile-wrapper">
                <header className="profile-header">
                    <div className="profile-image-container">
                        <img
                            src={getImageUrl(profileUser?.userAvatar)}
                            alt="profile"
                            className="profile-image-large"
                        />
                    </div>

                    <div className="profile-info-section">
                        <div className="profile-title-row">
                            <h2 className="profile-username">
                                {profileUser?.userName}
                            </h2>

                            <div className="profile-actions">
                                {isMyFeed ? (
                                    <button
                                        className="profile-edit-btn"
                                        onClick={() => navigate("/profile/edit")}
                                    >
                                        프로필 편집
                                    </button>
                                ) : (
                                    <button className="profile-follow-btn">
                                        팔로우
                                    </button>
                                )}
                            </div>
                        </div>

                        <ul className="profile-stats">
                            <li>게시물 <strong>{posts.length}</strong></li>
                            <li>팔로워 <strong>0</strong></li>
                            <li>팔로잉 <strong>0</strong></li>
                        </ul>

                        <div className="profile-bio-container">
                            <div className="profile-fullname">
                                {profileUser?.userFullname}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        <Grid size={12} /> 게시물
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('saved')}
                        disabled={!isMyFeed}
                    >
                        <Bookmark size={12} /> 저장됨
                    </button>
                </div>

                <div className="profile-posts-grid">
                    {posts.map(post => (
                        <div key={post.postId} className="grid-item">
                            <img src={getImageUrl(post.postImage)} alt="post" />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default UserFeedPage;

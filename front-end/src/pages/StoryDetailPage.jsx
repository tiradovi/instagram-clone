import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {X, MoreHorizontal, Heart, Send, ChevronLeft, ChevronRight} from 'lucide-react';
import apiService from "../service/apiService";
import {formatDate, getImageUrl} from "../service/commonService";
import {useAuth} from "../provider/AuthContext";

const StoryDetailPage = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const {userId} = useParams();

    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const {user} = useAuth();
    const currentStory = stories[currentIndex];
    useEffect(() => {
        loadStoryData()
    }, [userId]);


    const loadStoryData = async () => {
        try {
            setLoading(true);
            const data = await apiService.getStoriesByUserId(userId);
            console.log(data);

            if (Array.isArray(data) && data.length > 0) {
                setStories(data);
            } else {
                navigate(`/feed`);
            }

        } catch (err) {
            alert('스토리를 불러오는데 실패했습니다.');
            navigate('/feed');
        } finally {
            setLoading(false);
        }
    }

    // 다음 스토리로 이동
    const goToNextStory = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            navigate("/feed");
        }
    }
    // 이전 스토리로 이동
    const goToPrevStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0);
        } else {
            navigate("/feed");
        }
    }


    useEffect(() => {
        if (!stories.length) return;

        const duration = 5000;
        const intervalTime = 50;
        const step = 100 / (duration / intervalTime);

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev + step >= 100) {
                    clearInterval(timer);
                    setTimeout(goToNextStory, 0);
                    return 100;
                }
                return prev + step;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [currentIndex, stories.length]);


    const handleScreenClick = (e) => {
        const clickX = e.clientX;
        const screenWidth = window.innerWidth;

        if (clickX < screenWidth / 3) {
            goToPrevStory();
        } else if (clickX > (screenWidth * 2) / 3) {
            goToNextStory();
        }
    }

    if (loading || !currentStory) return <div>로딩중</div>;

    const handleDeleteStory = async () => {
        try {
            await apiService.deleteStory(currentStory.storyId);

            const updateStories = stories.filter((_, index) => index !== currentIndex);

            if (updateStories.length === 0) {
                navigate(`/feed`);
            } else {
                if (currentIndex >= updateStories.length) {
                    setCurrentIndex(updateStories.length - 1);
                }
                setStories(updateStories);
                setProgress(0);
            }
            setShowDeleteModal(false);
        } catch (err) {
            alert("스토리 삭제에 실패했습니다.");
            console.error(err.message);
        }
    }


    return (
        <div className="story-viewer-container" onClick={handleScreenClick}>
            <div
                className="story-bg-blur"
                style={{backgroundImage: `url(${getImageUrl(currentStory.storyImage)})`}}
            />

            <div className="story-content-box">
                <div className="story-progress-wrapper">
                    {stories.map((_, index) => (
                        <div key={index} className="story-progress-bar">
                            <div className="story-progress-fill"
                                 style={{
                                     width: index < currentIndex
                                         ? '100%'
                                         : index === currentIndex
                                             ? `${progress}%`
                                             : '0%'
                                 }}>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="story-header-info">
                    <div className="story-user">
                        <img src={getImageUrl(currentStory.userAvatar)}
                             alt="user"
                             className="story-user-avatar"
                        />
                        <span className="story-username">
                            {currentStory.userName}
                        </span>
                        <span className="story-time">
                            {formatDate(currentStory.createdAt, 'relative')}
                        </span>
                    </div>
                    <div className="story-header-actions">
                        <MoreHorizontal color="white"
                                        className="story-icon"
                                        style={{display: user.userId === currentStory.userId ? 'block' : 'none'}}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowDeleteModal(true);
                                        }}
                        />
                        <X
                            color="white"
                            className="story-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(-1);
                            }}
                        />
                    </div>
                </div>

                <img src={getImageUrl(currentStory.storyImage)}
                     alt="story"
                     className="story-main-image"/>
                {currentIndex > 0 && (
                    <div className="story-nav-hint story-nav-left">
                        <ChevronLeft color="white" size={32}/>
                    </div>
                )}
                {currentIndex < stories.length - 1 && (
                    <div className="story-nav-hint story-nav-right">
                        <ChevronRight color="white" size={32}/>
                    </div>
                )}

                <div className="story-footer">
                    <div className="story-input-container">
                        <input
                            type="text"
                            placeholder="메시지 보내기..."
                            className="story-message-input"
                        />
                    </div>
                    <Heart color="white"
                           className="story-icon"/>
                    <Send color="white"
                          className="story-icon"/>
                </div>
                {showDeleteModal && (
                    <div
                        className="story-delete-modal-overlay"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteModal(false);
                        }}
                    >
                        <div
                            className="story-delete-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="story-delete-button story-delete-confirm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStory();
                                }}
                            >
                                스토리 삭제
                            </button>
                            <button
                                className="story-delete-button story-delete-cancel"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(false);
                                }}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryDetailPage;
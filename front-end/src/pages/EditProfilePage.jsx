import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import { getImageUrl } from '../service/commonService';
import Header from '../components/Header';
import { useAuth } from '../provider/AuthContext';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        userFullname: '',
        userEmail: ''
    });
    const [previewImage, setPreviewImage] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (!user) return;

        setFormData({
            userName: user.userName,
            userFullname: user.userFullname,
            userEmail: user.userEmail,
        });

        setPreviewImage(getImageUrl(user.userAvatar));
    }, [user]);

    const handleImageChange = (e) => {
        const f = e.target.files[0];
        if (!f) return;

        setFile(f);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(f);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const submitData = new FormData();

            submitData.append(
                'user',
                new Blob([JSON.stringify({
                    userName: formData.userName,
                    userFullname: formData.userFullname,
                    userEmail: formData.userEmail
                })], { type: "application/json" })
            );

            if (file) submitData.append('userAvatar', file);

            const updatedUser = await apiService.updateProfile(
                user.userId,
                submitData
            );

            login(updatedUser, localStorage.getItem("token"));

            alert('프로필이 저장되었습니다.');
            navigate(`/user/feed/${user.userId}`);
        } catch (err) {
            console.error(err);
            alert('프로필 저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feed-container">
            <Header />

            <div className="edit-profile-wrapper">
                <div className="edit-profile-card">
                    <div className="edit-profile-sidebar">
                        <div className="sidebar-item active">프로필 편집</div>
                        <div className="sidebar-item">비밀번호 변경</div>
                        <div className="sidebar-item">앱 및 웹사이트</div>
                    </div>

                    <div className="edit-profile-form">
                        <div className="form-group photo-section">
                            <img
                                src={previewImage}
                                alt="프로필 미리보기"
                                className="edit-profile-avatar"
                            />

                            <label htmlFor="profile-upload" className="photo-change-btn">
                                프로필 사진 바꾸기
                            </label>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">이름</label>
                            <input
                                className="edit-input"
                                name="userFullname"
                                value={formData.userFullname}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">사용자 이름</label>
                            <input
                                className="edit-input"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">이메일</label>
                            <input
                                className="edit-input"
                                value={formData.userEmail}
                                disabled
                                readOnly
                            />
                        </div>

                        <button
                            className="edit-submit-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? '저장 중' : '수정'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;

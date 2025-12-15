import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import { useAuth } from '../provider/AuthContext';

const LoginPage = () => {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!userEmail || !password) {
            alert("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        setLoading(true);

        try {
            const response = await apiService.login(userEmail, password);

            const { user, token } = response;

            login(user, token);
            alert("로그인 성공");
            navigate("/feed");
        } catch (error) {
            if (error.response?.status === 401) {
                alert("이메일 또는 비밀번호가 올바르지 않습니다.");
            } else {
                alert("로그인에 실패했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKakaoLogin = () => {
        const API_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
        const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URL;

        if (!API_KEY || !REDIRECT_URI) {
            alert("카카오 설정 오류: 환경변수를 확인해주세요.");
            return;
        }

        const kakaoAuthUrl =
            `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

        window.location.href = kakaoAuthUrl;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-card">
                    <h1 className="login-title">Instagram</h1>

                    <input
                        className="login-input"
                        type="text"
                        placeholder="전화번호, 사용자 이름 또는 이메일"
                        value={userEmail}
                        onChange={e => setUserEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />

                    <input
                        className="login-input"
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />

                    <button
                        className="login-button"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>

                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">또는</span>
                        <div className="divider-line"></div>
                    </div>

                    <img
                        className="kakaotalk-login"
                        onClick={handleKakaoLogin}
                        src="/static/img/kakao_login_large_wide.png"
                        alt="카카오 로그인"
                    />
                </div>

                <div className="signup-box">
                    <p>
                        계정이 없으신가요?
                        <button
                            className="signup-link"
                            onClick={() => navigate("/signup")}
                        >
                            가입하기
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

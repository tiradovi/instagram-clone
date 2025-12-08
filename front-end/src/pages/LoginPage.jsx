import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';

const LoginPage = () => {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // TODO: handleLogin 함수를 작성하세요
    // 1. 입력값 검증 (username과 password가 비어있는지 확인)
    // 2. loading을 true로 설정
    // 3. apiService.login(username, password) 호출
    // 4. 성공 시: localStorage에 token과 user 저장, /feed로 이동
    // 5. 실패 시: alert로 에러 메시지 표시
    // 6. finally: loading을 false로 설정
    const handleLogin = async () => {
        try {
            const response = await apiService.login(userEmail, password);

            alert("로그인 성공");
            navigate("/feed");
        } catch (error) {
            if (error.response?.status === 401) {
                alert("이메일 또는 비밀번호 올바르지 않음");
            }
            alert("로그인 실패")
        }

    };

    // TODO: Enter 키 입력 시 handleLogin 호출하는 함수 작성
    const handleKeyPress = (e) => {
        // TODO: 함수를 완성하세요
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-card">
                    <h1 className="login-title">Instagram</h1>

                    <div>
                        <input
                            className="login-input"
                            placeholder="전화번호, 사용자 이름 또는 이메일"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />

                        <input
                            className="login-input"
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />

                        {/* TODO: 로그인 버튼 작성 */}
                        {/* onClick: handleLogin */}
                        {/* disabled: loading */}
                        {/* 버튼 텍스트: loading이면 "로그인 중...", 아니면 "로그인" */}
                        <button className="login-button" onClick={handleLogin} disabled={loading}>
                            {loading ? "로그인 중..." : "로그인"}
                        </button>
                    </div>

                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">또는</span>
                        <div className="divider-line"></div>
                    </div>

                    <button className="facebook-login">
                        SNS로 로그인
                    </button>

                    <button className="forgot-password">
                        비밀번호를 잊으셨나요?
                    </button>
                </div>
                <div className="signup-box">
                    <p>
                        계정이 없으신가요? <button className="signup-link" onClick={() => navigate('/signup')}>가입하기</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
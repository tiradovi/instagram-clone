import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';

const SignupPage = () => {
    const location = useLocation();
    console.log("kakao email : ", location.state?.email);
    console.log("kakao email : ", location.state);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const [isKakaoSignup, setIsKakaoSignup] = useState(false);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
            setUsername(location.state.name);
            setFullName(location.state.fullName);
            setIsKakaoSignup(true)
        }
    }, [location.state]);


    const handleSignup = async () => {
        if (!username || !email || !password || !fullName) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('올바른 이메일 형식이 아닙니다.');
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9._]{3,50}$/;
        if (!usernameRegex.test(username)) {
            alert('사용자명은 영문, 숫자, 밑줄(_), 마침표(.)만 사용 가능하며 3~50자여야 합니다.');
            return;
        }

        if (password.length < 6) {
            alert('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        setLoading(true);

        try {
            await apiService.signup(username, email, password, fullName);

            alert('회원가입이 완료되었습니다. 로그인해주세요.');
            navigate('/login');

        } catch (error) {
            let errorMessage = '회원가입에 실패했습니다.';

            if (error) {
                if (error.status === 409) {
                    errorMessage = '이미 사용 중인 사용자 이름 또는 이메일입니다.';
                } else if (error.status === 400) {
                    errorMessage = '입력 정보를 확인해주세요.';
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            }
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-card">
                    <h1 className="login-title">Instagram</h1>

                    <p style={{
                        textAlign: 'center',
                        color: '#8e8e8e',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        lineHeight: '1.4'
                    }}>
                        친구들의 사진과 동영상을 보려면<br/>가입하세요.
                    </p>

                    <button className="facebook-login" style={{marginBottom: '1rem'}}>
                        <svg
                            style={{
                                width: '1rem',
                                height: '1rem',
                                marginRight: '0.5rem',
                                display: 'inline-block',
                                verticalAlign: 'middle'
                            }}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        SNS으로 로그인
                    </button>

                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">또는</span>
                        <div className="divider-line"></div>
                    </div>

                    <div>
                        <input
                            className="login-input"
                            type="email"
                            placeholder="휴대폰 번호 또는 이메일 주소"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            autoComplete="email"
                            disabled={isKakaoSignup}
                        />
                        <input className="login-input"
                               type="text"
                               placeholder="성명"
                               value={fullName}
                               onChange={(e) => setFullName(e.target.value)}
                               onKeyPress={handleKeyPress}
                               autoComplete="name"
                               disabled={isKakaoSignup}
                        />
                        <input className="login-input"
                               type="text"
                               placeholder="사용자 이름"
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                               onKeyPress={handleKeyPress}
                               autoComplete="username"
                               disabled={isKakaoSignup}
                        />
                        {!isKakaoSignup && (
                            <input className="login-input"
                                   type="password"
                                   placeholder="비밀번호"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   onKeyPress={handleKeyPress}
                                   autoComplete="new-password"
                            />
                        )}
                        <button className="login-button"
                                onClick={(e) => handleSignup(e)}
                                disabled={loading}
                        >
                            {loading === false ?
                                (
                                    <div style={{opacity: '0.7', cursor: 'not-allowed'}}>가입 </div>

                                ) : <div style={{opacity: '1', cursor: 'pointer'}}>가입 </div>}
                        </button>
                    </div>

                    <p style={{
                        textAlign: 'center',
                        color: '#8e8e8e',
                        fontSize: '0.75rem',
                        marginTop: '1.5rem',
                        lineHeight: '1.5',
                        padding: '0 1rem'
                    }}>
                        가입하면 Instagram의 <strong style={{fontWeight: 600}}>약관</strong>, <strong
                        style={{fontWeight: 600}}>데이터 정책</strong> 및<br/>
                        <strong style={{fontWeight: 600}}>쿠키 정책</strong>에 동의하게 됩니다.
                    </p>
                </div>

                <div className="signup-box">
                    <p>
                        계정이 있으신가요? {' '}
                        <button
                            className="signup-link"
                            onClick={() => navigate('/login')}
                        >
                            로그인
                        </button>
                    </p>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    fontSize: '0.875rem'
                }}>
                    <p style={{marginBottom: '1rem', color: '#262626'}}>앱을 다운로드하세요.</p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <img
                            src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
                            alt="Google Play에서 다운로드"
                            style={{height: '40px', cursor: 'pointer'}}
                        />
                        <img
                            src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
                            alt="Microsoft에서 다운로드"
                            style={{height: '40px', cursor: 'pointer'}}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
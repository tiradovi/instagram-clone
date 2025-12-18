import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

axios.defaults.withCredentials = true;
// axios 인스턴스를 생성
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

// 요청 인터셉터를 설정(모든 요청에 JWT 토큰 추가)
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// 응답 인터셉터를 설정
api.interceptors.response.use(
    response => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

const apiService = {
    // ===== 인증 API ===== //

    // 회원가입
    signup: async (username, email, password, fullName) => {
        const response = await api.post(`/auth/signup`, {
            userName: username,
            userEmail: email,
            userPassword: password,
            userFullname: fullName
        });

        return response.data;
    },

    // 로그인
    login: async (userEmail, password) => {
        const response = await api.post(`/auth/login`, {
            userEmail: userEmail,
            userPassword: password
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // 로그아웃
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // ===== 게시물 API ===== //

    //  모든 게시물 조회
    getPosts: async () => {
        const response = await api.get(`/posts`);
        return response.data;
    },

    // 특정 유저 게시물 조회
    getPostsByUserId: async (userId) => {
        const response = await api.get(`/posts/user/${userId}`);
        return response.data;
    },

    // 특정 게시물 조회
    getPostById: async (postId) => {
        const response = await api.get(`/posts/post/${postId}`);
        return response.data;
    },

    // 게시물 생성
    createPost: async (postImage, postCaption, postLocation) => {
        const formData = new FormData();
        formData.append('postImage', postImage);
        formData.append('postCaption', postCaption);
        formData.append('postLocation', postLocation);
        const response = await api.post("/posts", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    // 게시물 삭제
    deletePost: async (postId) => {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    },

    // ===== 좋아요 API ===== //

    // 좋아요 추가
    addLike: async (postId) => {
        const response = await api.post(`/posts/${postId}/like`);
        return response.data;
    },

    // 좋아요 취소
    removeLike: async (postId) => {
        const response = await api.delete(`/posts/${postId}/like`);
        return response.data;
    },

    // ===== 댓글 API =====//

    // 특정 게시물 댓글 조회
    getComments: async (postId) => {
        const response = await api.get(`/posts/${postId}/comments`);
        return response.data;
    },

    // 댓글 작성
    createComment: async (postId, commentContent) => {
        const response = await api.post(`/posts/${postId}/comments`, commentContent);
        return response.data;
    },

    // 댓글 삭제
    deleteComment: async (commentId) => {
        const response = await api.delete(`/comments/${commentId}`);
        return response.data;
    },

    // 댓글 수정
    updateComment: async (commentId) => {
        const response = await api.put(`/posts/${commentId}`);
        return response.data;
    },

    // ===== 스토리 API =====

    // 모든 스토리 조회
    getStories: async () => {
        const response = await api.get('/stories');
        return response.data;
    },

    // 특정 유저 스토리 조회
    getStoriesByUserId: async (userId) => {
        const response = await api.get(`/stories/user/${userId}`);
        return response.data;
    },

    // 스토리 생성
    createStory: async (storyImage) => {
        const formData = new FormData();
        formData.append('storyImage', storyImage);

        const response = await api.post('/stories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    // 스토리 삭제
    deleteStory: async (storyId) => {
        const response = await api.delete(`/stories/${storyId}`);
        return response.data;
    },

    // ===== 사용자 API =====

    // 특정 유저 조회
    getUserById: async (userId) => {
        try {
            const response = await api.get(`/users/userId/${userId}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }

    },

    // 검색어를 포함한 유저들 조회
    searchUsers: async (query) => {
        if (!query || query.isEmpty) return [];
        try {
            const response = await api.get(`/users/search?q=${query}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    // 유저 이름으로 유저 조회
    getUserByUsername: async (username) => {
        try {
            const response = await api.get(`/users/username/${username}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // 유저 정보 변경
    updateProfile: async (userId, formData) => {
        const response = await api.put('/auth/profile/edit', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (response.data) localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    }
};

export default apiService;

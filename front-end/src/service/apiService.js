import axios from 'axios';

export const API_BASE_URL = 'http://localhost:9000/api';

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
    getPostByUserId: async (userId) => {
        const response = await api.get(`/posts/userId/${userId}`);
        return response.data;
    },

    // 특정 게시물 조회
    getPostByPostId: async (postId) => {
        const response = await api.get(`/posts/postId/${postId}`);
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

    // TODO: 게시물 삭제
    // DELETE /posts/:postId
    deletePost: async (postId) => {
        // TODO: API 호출을 완성하세요
        const response = await api.delete(`/posts/${postId}`);
    },

    // ===== 좋아요 API =====

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

    // ===== 댓글 API =====
    // TODO: 댓글 목록 조회
    // GET /posts/:postId/comments
    getComments: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 댓글 작성
    // POST /posts/:postId/comments
    // body: { commentContent }
    createComment: async (postId, commentContent) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 댓글 삭제
    // DELETE /comments/:commentId
    deleteComment: async (commentId) => {
        // TODO: API 호출을 완성하세요
    },

    // ===== 스토리 API =====

    getStories: async () => {
        const response = await api.get('/stories');
        return response.data;
    },
    getStory: async (userId) => {
        const response = await api.get(`/stories/user/${userId}`);
        return response.data;
    },
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
    deleteStory: async (storyId) => {
        const response = await api.delete(`/stories/${storyId}`);
        return response.data;
    },

    // ===== 사용자 API =====


    getUserByUserId: async (userId) => {
        try {
            const response = await api.get(`/users/userId/${userId}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }

    },

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

    getUserByUsername: async (username) => {
        try {
            const response = await api.get(`/users/username/${username}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

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

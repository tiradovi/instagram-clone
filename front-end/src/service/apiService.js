import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/api';

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
    // ===== 인증 API =====
    // 회원가입 API
    signup: async (username, email, password, fullName) => {
        const response = await api.post(`/auth/signup`, {
            userName: username,
            userEmail: email,
            userPassword: password,
            userFullname: fullName
        });

        return response.data;
    },

    // 로그인 API
    login: async (userEmail, password) => {
        const response = await api.post(`/auth/login`, {
            userEmail: userEmail,
            userPassword: password
        });

        // 토큰 정보 localStorage 저장
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // TODO: 로그아웃 함수
    // localStorage에서 token과 user 제거하고 /login으로 이동
    logout: () => {
        // TODO: 로그아웃 로직을 완성하세요
    },

    // ===== 게시물 API =====

    //  모든 게시물 조회
    getPosts: async () => {
        const response = await api.get(`/posts`);
        return response.data;
    },

    // 특정 게시물 조회
    // GET /posts/:postId
    getPost: async (postId) => {
        // TODO: API 호출을 완성하세요
        const response = await api.get(`/posts/:postId`);
        return response.data;
    },

    // 게시물 작성
    createPost: async (postImage, postCaption, postLocation) => {

        const postData = new FormData();
        postData.append('postImage', postImage);
        postData.append('postCaption', postCaption);
        postData.append('postLocation', postLocation);
        const response = await api.post("/posts", postData, {
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
    },

    // ===== 좋아요 API =====

    // TODO: 좋아요 추가
    // POST /posts/:postId/like
    addLike: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 좋아요 취소
    // DELETE /posts/:postId/like
    removeLike: async (postId) => {
        // TODO: API 호출을 완성하세요
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

    // 모든 스토리 조회
    getStories: async () => {
        const response = await api.get(`/stories`);
        return response.data;
    },

    // 스토리 작성
    createStory: async (storyImage) => {
        const storyData = new FormData();
        storyData.append('storyImage', storyImage);
        const response = await api.post("/stories", storyData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    // ===== 사용자 API =====

    // TODO: 사용자 프로필 조회
    // GET /users/:userId
    getUser: async (userId) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 사용자 게시물 조회
    // GET /users/:userId/posts
    getUserPosts: async (userId) => {
        // TODO: API 호출을 완성하세요
    }
};
/*
export const 기능1번 = () => {

}
const 기능2번 = {
    회원가입기능: () => {

    },
    로그인기능: () => {

    }
}

export default 기능2번;
*/

export default apiService;
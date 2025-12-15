import React from 'react';
import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./provider/PrivateRoute";
import FeedPage from "./pages/FeedPage";
import PostUploadPage from "./pages/PostUploadPage";
import SignupPage from "./pages/SignupPage";
import StoryUploadPage from "./pages/StoryUploadPage";
import UserFeedPage from "./pages/UserFeedPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import EditProfilePage from "./pages/EditProfilePage";
import KakaoCallback from "./pages/KakaoCallback";
import PostDetailPage from "./pages/PostDetailPage";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/auth/kakao/callback" element={<KakaoCallback/>}/>
                <Route path="/signup" element={<SignupPage/>}/>

                <Route
                    path="/feed"
                    element={
                        <PrivateRoute>
                            <FeedPage/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/post/detail/:postId"
                    element={
                        <PrivateRoute>
                            <PostDetailPage/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/story/detail/:userId"
                    element={
                        <PrivateRoute>
                            <StoryDetailPage/>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/post/upload"
                    element={
                        <PrivateRoute>
                            <PostUploadPage/>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/story/upload"
                    element={
                        <PrivateRoute>
                            <StoryUploadPage/>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/user/feed/:userId"
                    element={
                        <PrivateRoute>
                            <UserFeedPage/>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/profile/edit"
                    element={
                        <PrivateRoute>
                            <EditProfilePage/>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;

import React from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./provider/PrivateRoute";
import FeedPage from "./pages/FeedPage";
import PostUploadPage from "./pages/PostUploadPage";
import SignupPage from "./pages/SignupPage";
import StoryUploadPage from "./pages/StoryUploadPage";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/signup" element={<SignupPage/>}/>
                    <Route path="/feed"
                           element={
                               <PrivateRoute>
                                   <FeedPage/>
                               </PrivateRoute>}
                    />
                    <Route path="/post/upload"
                           element={
                               <PrivateRoute>
                                   <PostUploadPage/>
                               </PrivateRoute>
                           }
                    />
                    <Route path="/story/upload"
                           element={
                               <PrivateRoute>
                                   <StoryUploadPage/>
                               </PrivateRoute>
                           }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
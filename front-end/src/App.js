import React from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./provider/PrivateRoute";
import FeedPage from "./pages/FeedPage";
import UploadPage from "./pages/UploadPage";
import SignupPage from "./pages/SignupPage";

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
                    <Route path="/upload"
                           element={
                               <PrivateRoute>
                                   <UploadPage/>
                               </PrivateRoute>
                           }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
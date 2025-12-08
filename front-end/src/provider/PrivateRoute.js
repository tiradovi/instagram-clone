import React from 'react';
import {Navigate} from "react-router-dom";

const PrivateRoute = ({children}) => {
    // localStorage에서 token 가져오기
    const token = localStorage.getItem('token');

    // token이 없으면 /login으로 리다이렉트
    if (!token) return <Navigate to="/login" replace/>

    // token이 있으면 children을 반환
    return children;
};

export default PrivateRoute;

/* importing the necessary modules for the component to function properly. */
import React from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
/* The AuthRedirect component redirects to the home page if the user is already logged in, otherwise it renders its children. */
export const AuthRedirect = ({children}) => {
    const {currentUser} = useAuth() ;
    const navigate = useNavigate();

    // return currentUser ? <redirect to="/"/> : children;
    if(currentUser){
        navigate('/');
        return null;
    }
    return children;
};


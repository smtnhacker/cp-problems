import { GoogleLogin } from "@react-oauth/google";
import md5 from "md5"
import { useEffect } from "react";

import { useAppDispatch } from '../../app/hooks';
import { authLogin } from "./authSlice";

interface GoogleLoginBtnProps {
    onSuccess?: Function
}

// https://stackoverflow.com/questions/71686512/gsi-logger-the-value-of-callback-is-not-a-function-configuration-ignored
function decodeJwtResponse(token: string) {
    let base64Url = token.split('.')[1]
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload)
}

const GoogleLoginBtn = (props: GoogleLoginBtnProps) => {

    const handleGoogleSuccess = (id: string) => {
        const data: { sub: string } = decodeJwtResponse(id);
        const authorID = md5(data.sub);    
        if (props.onSuccess) {
            props.onSuccess(authorID)
        }
    }

    return (
        <GoogleLogin
            onSuccess={(res) => handleGoogleSuccess(res.credential || "")}
            onError={() => alert("Login failed")}
        />
    );
};

export default GoogleLoginBtn
import { GoogleLogin } from "@react-oauth/google";

import { useAppDispatch } from '../../app/hooks';
import { authLogin } from "./authSlice";

const Login = () => {
    const dispatch = useAppDispatch()

    const handleGoogleSuccess = (id: string) => {
        localStorage.setItem("nerd-id", id);
        dispatch(authLogin(id));
    }

    return (
        <GoogleLogin
            onSuccess={(res) => handleGoogleSuccess(res.credential || "")}
            onError={() => alert("Login failed")}
        />
    );
};

export default Login
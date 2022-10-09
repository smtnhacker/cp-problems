import { googleLogout } from "@react-oauth/google";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import LoginForm from "../components/LoginForm";
import { authLogin, selectAuth } from "../features/auth/authSlice";

interface LoginPageProps {
    successRedirect: string
}

const LoginPage = (props: LoginPageProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)

    const handleLogin = (authorID: string) => {
        localStorage.setItem("nerd-id", authorID);
        dispatch(authLogin(authorID));
        console.log("Logged in as", authorID)
        navigate(props.successRedirect)
        console.log("navigated to", props.successRedirect)
    }

    if (!!auth.loggedIn) {
        return (
            <div>
                You are already logged in
            </div>
        )
    }

    return (
        <div>
            <LoginForm onSuccess={handleLogin} />
        </div>
    )
}

export default LoginPage
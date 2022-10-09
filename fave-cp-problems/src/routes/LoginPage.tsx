import { useNavigate } from "react-router";
import { useAppDispatch } from "../app/hooks";

import LoginForm from "../components/LoginForm";
import { authLogin } from "../features/auth/authSlice";

interface LoginPageProps {
    successRedirect: string
}

const LoginPage = (props: LoginPageProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleLogin = (authorID: string) => {
        localStorage.setItem("nerd-id", authorID);
        dispatch(authLogin(authorID));
        console.log("Logged in as", authorID)
        navigate(props.successRedirect)
        console.log("navigated to", props.successRedirect)
    }

    return (
        <div>
            <LoginForm onSuccess={handleLogin} />
        </div>
    )
}

export default LoginPage
import { useNavigate } from "react-router";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

import SignupForm from "../components/SignupForm";

interface SignupPageProps {
    redirect: string
}

const SignupPage = (props: SignupPageProps) => {
    const navigate = useNavigate()

    const handleSignup = (email: string, password: string) => {
        const auth = getAuth()
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log("Created user:", user);
                navigate(props.redirect)
            })
            .catch((err) => {
                const errorCode = err.code;
                const errorMessage = err.message;
                console.log(errorCode, errorMessage)
            })
    }

    return (
        <div>
            <SignupForm onSubmit={handleSignup} />  
        </div>
    )
}

export default SignupPage
import { Link } from 'react-router-dom';
import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import GoogleLoginBtn from "../features/auth/GoogleLoginBtn"
import Separator from "../components/Separator/Separator"
import { useNavigate } from 'react-router';

interface LoginFormProps {
    onSuccess: Function
}

const LoginForm = (props: LoginFormProps) => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                props.onSuccess(user.uid)
            })
            .catch((err) => {
                const errorCode = err.code;
                const errorMessage = err.message;
                console.log(errorCode, errorMessage)
            })
    }

    return (
        <div className="card" style={{ width: "clamp(50%, 800px, 100%)", padding: "24px" }}>
            <div className="card-body">
                <div style={{ margin: "24px 0px" }}>
                    <h3>Login</h3>
                    Log in using your <b>Google Account</b>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <GoogleLoginBtn onSuccess={props.onSuccess} />
                </div>
                <Separator text="or" />
                <form className="row g-3" onSubmit={handleSubmit}> 
                    <div className="form-floating mb-3">
                        <input 
                            type="email" 
                            name="email" 
                            className="form-control" 
                            placeholder="email@sample.com" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control" 
                            placeholder="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label htmlFor="username">Password</label>
                    </div>
                    <input type="submit" value="Submit" className="btn btn-primary" />
                </form>
                <Link className="nav-link" style={{ paddingTop: "24px" }} to="/signup">I'm new here</Link>
            </div>
        </div>
    )
}

export default LoginForm
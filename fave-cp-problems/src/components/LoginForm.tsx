
import GoogleLoginBtn from "../features/auth/GoogleLoginBtn"
import Separator from "../components/Separator/Separator"

interface LoginFormProps {
    onSuccess: Function
}

const LoginForm = (props: LoginFormProps) => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSuccess("random")
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
                        <input type="text" name="username" className="form-control" placeholder="username" />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" name="password" className="form-control" placeholder="password" />
                        <label htmlFor="username">Password</label>
                    </div>
                    <input type="submit" value="Submit" className="btn btn-primary" />
                </form>
            </div>
        </div>
    )
}

export default LoginForm
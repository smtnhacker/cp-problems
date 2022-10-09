import { useState } from 'react'
import { Link } from 'react-router-dom';

interface SignupFormProps {
    onSubmit: Function
}

const SignupForm = (props: SignupFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        props.onSubmit(email, password)
    }

    return (
        <div className="card" style={{ width: "clamp(50%, 800px, 100%)", padding: "24px" }}>
            <div className="card-body">
                <div style={{ margin: "24px 0px" }}>
                    <h3>Sign-Up</h3>
                </div>
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
                <Link className="nav-link" style={{ paddingTop: "24px" }} to="/login">I already have an account</Link>
            </div>
        </div>
    )
}

export default SignupForm
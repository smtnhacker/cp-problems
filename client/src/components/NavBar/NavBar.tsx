import { useAppSelector } from '../../app/hooks'
import { selectAuth } from '../../features/auth/authSlice'
import { Link } from 'react-router-dom'

import LogoutBtn from '../../features/auth/LogoutBtn'
import styles from './Navbar.module.css'

const NavBar = () => {
    const { loggedIn } = useAppSelector(selectAuth);

    return (
        <header className={`navbar bg-light ${styles.header}`}>
            <div className="logo row">
                <div className="col">
                    <Link className="navbar-brand" to="/">CP Progress Tracker</Link>
                </div>
                <ul className="nav col-auto">
                    <li className="nav-item">
                        <Link className='nav-link' to="/posts">Posts</Link>
                    </li>
                {loggedIn &&
                    <>
                        <li className="nav-item">
                            <Link className='nav-link' to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/problems">Problems</Link>
                        </li>
                    </> 
                }
                </ul>
            </div>
            <ul className={`nav nav-fill ${styles.nav}`}>
                {loggedIn ? 
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to="/profile">My Profile</Link>
                    </li>
                    <li className="nav-item">
                        <LogoutBtn />
                    </li>
                </>
                    :
                    <li className='nav-item'>
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                }
            </ul>
        </header>
    )
}

export default NavBar
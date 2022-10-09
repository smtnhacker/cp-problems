import { useAppSelector } from '../../app/hooks'
import { selectAuth } from '../../features/auth/authSlice'
import { Link } from 'react-router-dom'

import LogoutBtn from '../../features/auth/LogoutBtn'
import styles from './Navbar.module.css'

const NavBar = () => {
    const { loggedIn } = useAppSelector(selectAuth);

    return (
        <header className={`navbar bg-light ${styles.header}`}>
            <div className="logo">
                <Link className="navbar-brand" to="/">CP Problems</Link>
            </div>
            <ul className={`nav nav-fill ${styles.nav}`}>
                {loggedIn ? 
                    <li className="nav-item">
                        <LogoutBtn />
                    </li>
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
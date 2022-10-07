import { useAppSelector } from '../../app/hooks'
import { selectAuth } from '../../features/auth/authSlice'

import Login from '../../features/auth/Login'
import Logout from '../../features/auth/Logout'
import styles from './Navbar.module.css'

const NavBar = () => {
    const { loggedIn } = useAppSelector(selectAuth);

    return (
        <header className={`navbar bg-light ${styles.header}`}>
            <div className="logo">
                CP Problem Index
            </div>
            <ul className={`nav nav-fill ${styles.nav}`}>
                {loggedIn ? 
                    <li className="nav-item">
                        <Logout />
                    </li>
                    :
                    <li className='nav-item'>
                        <Login />
                    </li>
                }
            </ul>
        </header>
    )
}

export default NavBar
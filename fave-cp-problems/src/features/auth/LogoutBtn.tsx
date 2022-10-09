import { googleLogout } from '@react-oauth/google'

import { useAppDispatch } from '../../app/hooks';
import { authLogout } from './authSlice';

const LogoutBtn = () => {
    const dispatch = useAppDispatch()

    const handleLogout = () => {
        googleLogout();
        localStorage.setItem("nerd-id", "");
        dispatch(authLogout());
    }

    return (
        <button className="btn" onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutBtn
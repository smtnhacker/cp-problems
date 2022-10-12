import { useEffect } from "react";
import { Outlet } from "react-router"
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import { fetchItems, fetchUserItems, selectStatus } from "../features/list/listSlice";


const DataWrapper = () => {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const status = useAppSelector(selectStatus)

    useEffect(() => {
    if (auth.loggedIn) {
      dispatch(fetchUserItems(auth.id));
    }
    dispatch(fetchItems(1));
  }, [auth.loggedIn]);

    if (status === 'loading') {
        return <div className="h1">Loading...</div>
    } else if (status === 'failed') {
        return <div className="h1">Error :(</div>
    }

    return (
        <Outlet />
    )
}

export default DataWrapper
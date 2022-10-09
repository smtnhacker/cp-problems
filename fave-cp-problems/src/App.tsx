import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import "./App.css";
import { useAppDispatch } from "./app/hooks";
import NavBar from "./components/NavBar/NavBar";
import { authLogin } from "./features/auth/authSlice";

function App() {
  const dispatch = useAppDispatch()

    useEffect(() => {
        const authorID = localStorage.getItem("nerd-id");
        if (authorID) {
            dispatch(authLogin(authorID));
        }
    }, [])

  return (
    <div className="layout">
      <NavBar />
      <div className="App">
        <Outlet />
      </div>

    </div>
  );
}
export default App;
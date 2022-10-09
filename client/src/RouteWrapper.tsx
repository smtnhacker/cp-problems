import { useEffect, useState } from "react"
import { Routes, Route } from "react-router"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import { authLogin, selectAuth } from "./features/auth/authSlice"
import List from "./features/list/List"
import DashboardPage from "./routes/DashboardPage"
import LoginPage from "./routes/LoginPage"
import SignupPage from "./routes/SignupPage"

const LOGIN_PATH = "/login"

const RouteWrapper = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()

  const getAuthentication = () => {
    const authorID = localStorage.getItem("nerd-id");
    if (authorID) {
      dispatch(authLogin(authorID))
      return true
    }
    return false
  }

  useEffect(() => {
    getAuthentication();
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            path="/login"
            element={<LoginPage successRedirect="/problems" />}
          />
          <Route 
            path="/signup"
            element={<SignupPage redirect="/login" />}
          />
          <Route
            element={
              <ProtectedRoute redirectPath={LOGIN_PATH} getAuthentication={getAuthentication} />
            }
          >
            <Route path="/dashboard" element={<DashboardPage />}></Route>
            <Route path="/problems" element={<List />} />
          </Route>
          <Route path="*" element={<h1>Error 404!</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RouteWrapper
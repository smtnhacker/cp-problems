import { useEffect, useState } from "react"
import { Routes, Route } from "react-router"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import DataWrapper from "./components/DataWrapper"
import PostsView from "./components/Posts/PostsView"
import ProblemView from "./components/Problem/ProblemView"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import { authLogin, selectAuth } from "./features/auth/authSlice"
import List from "./features/list/List"
import DashboardPage from "./routes/DashboardPage"
import EditPage from "./routes/EditPage"
import LandingPage from "./routes/LandingPage"
import LoginPage from "./routes/LoginPage"
import PublicPage from "./routes/PublicPage"
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
          <Route index element={<LandingPage />} />
          <Route
            path="/login"
            element={<LoginPage successRedirect="/problems" />}
          />
          <Route 
            path="/signup"
            element={<SignupPage redirect="/login" />}
          />
          <Route element={<DataWrapper />}>
            <Route path="/posts" element={<PublicPage />}>
              <Route index element={<PostsView />} />
              <Route path=":problemID" element={<ProblemView readonly />} />
            </Route>
            <Route
              element={
                <ProtectedRoute redirectPath={LOGIN_PATH} getAuthentication={getAuthentication} />
              }
            >
              <Route path="/dashboard" element={<DashboardPage />}></Route>
              <Route path="/problems" element={<EditPage />}>
                <Route index element={<List />} />
                <Route path=":problemID" element={<ProblemView />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<h1>Error 404!</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RouteWrapper
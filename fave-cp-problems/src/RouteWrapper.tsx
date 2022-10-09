import { useEffect } from "react"
import { Routes, Route } from "react-router"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { useAppSelector } from "./app/hooks"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import { selectAuth } from "./features/auth/authSlice"
import List from "./features/list/List"
import LoginPage from "./routes/LoginPage"

const LOGIN_PATH = "/login"

const RouteWrapper = () => {
  const auth = useAppSelector(selectAuth);

  const isAuthenticated = () => {
    return !!auth.loggedIn;
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
            element={
              <ProtectedRoute redirectPath={LOGIN_PATH} isAllowed={isAuthenticated()} />
            }
          >
            <Route path="/problems" element={<List />} />
          </Route>
          <Route path="*" element={<h1>Error 404!</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RouteWrapper
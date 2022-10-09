import { Outlet } from "react-router-dom";

import "./App.css";
import NavBar from "./components/NavBar/NavBar";

function App() {

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
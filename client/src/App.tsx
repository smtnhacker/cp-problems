import { Outlet } from "react-router-dom";

import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar/NavBar";

function App() {

  return (
    <div className="layout">
      <NavBar />
      <div className="App">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
export default App;
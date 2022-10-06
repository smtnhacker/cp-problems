import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import List from "./features/list/List";

function App() {
  return (
    <div className="layout">
      <NavBar />
      <div className="App">
        <List />
      </div>

    </div>
  );
}
export default App;
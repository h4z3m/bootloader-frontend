import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Homepage from "./Modules/Homepage/Homepage";
import Navbar from "./Components/Navbar/Navbar";
import { StatusProvider } from "./Modules/StatusContext/StatusContext";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <StatusProvider>
        <Navbar />
        <Homepage></Homepage>
      </StatusProvider>
    </>
  );
}

export default App;

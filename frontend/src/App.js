import React, { useState, useEffect } from "react";
import { gray } from "@ant-design/colors";
import Navbar from "./components/Navbar";
import WelcomeMessage from "./components/WelcomeMessage";
import MainApp from "./MainApp";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div
      style={{
        position: "relative",
        background: `linear-gradient(45deg, ${gray[7]}, ${gray[2]})`,
        display: "block",
      }}
    >
      <Navbar user={user} setUser={setUser} handleLogout={handleLogout} />
      {user ? <MainApp user={user} /> : <WelcomeMessage />}
    </div>
  );
}

export default App;

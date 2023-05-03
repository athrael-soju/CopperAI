import React, { useState, useEffect } from "react";
import "./styles/bootstrap.vapor.min.css";
import "./styles/App.css";
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
    <div className="App container-fluid">
      <video id="live-wallpaper" loop autoPlay muted>
        <source src="assets/video/synthwave.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Navbar user={user} setUser={setUser} handleLogout={handleLogout} />
      {user ? <MainApp user={user} /> : <WelcomeMessage />}
    </div>
  );
}

export default App;

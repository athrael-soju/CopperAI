import React, { useState } from "react";
import { Button } from "react-bootstrap";
import AccountModal from "./AccountModal";
import Login from "./Login";

function Navbar({ user, setUser, handleLogout }) {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const handleAccountModalClose = () => setShowAccountModal(false);
  const handleAccountModalShow = () => setShowAccountModal(true);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a
            className="navbar-brand"
            href="https://github.com/athrael-soju/whisperChat"
          >
            whisperChat
          </a>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto"></ul>
            <form className="d-flex">
              {user ? (
                <Button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </Button>
              ) : (
                <Button
                  className="btn btn-secondary"
                  onClick={handleAccountModalShow}
                >
                  Account
                </Button>
              )}
            </form>
          </div>
        </div>
      </nav>
      {!user && (
        <AccountModal
          show={showAccountModal}
          handleClose={handleAccountModalClose}
        >
          <Login setUser={setUser} />
        </AccountModal>
      )}
    </>
  );
}

export default Navbar;

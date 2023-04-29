import React, { useState } from "react";
import { Button } from "react-bootstrap";
import AccountModal from "./AccountModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import AccountDetailsForm from "./AccountDetailsForm";

function Navbar({ user, setUser, handleLogout }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleLoginModalShow = () => setShowLoginModal(true);
  const handleSignupModalClose = () => setShowSignupModal(false);
  const handleSignupModalShow = () => setShowSignupModal(true);
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
              <Button
                className="btn btn-info me-2"
                onClick={handleAccountModalShow}
                disabled={!user}
              >
                {user ? user.username : "Account"}
              </Button>
              {user ? (
                <>
                  <Button
                    onClick={handleLogout}
                    className="btn btn-danger me-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="btn btn-secondary me-2"
                    onClick={handleLoginModalShow}
                  >
                    Login
                  </Button>
                  <Button
                    className="btn btn-secondary me-2"
                    onClick={handleSignupModalShow}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      </nav>
      {!user && (
        <>
          <AccountModal
            show={showLoginModal}
            handleClose={handleLoginModalClose}
          >
            <LoginForm setUser={setUser} />
          </AccountModal>
          <AccountModal
            show={showSignupModal}
            handleClose={handleSignupModalClose}
          >
            <RegisterForm setUser={setUser} />
          </AccountModal>
        </>
      )}
      {user && (
        <AccountModal
          show={showAccountModal}
          handleClose={handleAccountModalClose}
        >
          <AccountDetailsForm user={user} />
        </AccountModal>
      )}
    </>
  );
}

export default Navbar;

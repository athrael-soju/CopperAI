import React, { useState } from "react";
import { Layout, Button, Space } from "antd";
import { gray } from "@ant-design/colors";
import AccountModal from "./AccountModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import AccountDetailsForm from "./AccountDetailsForm";

const { Header } = Layout;

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: gray?.[8],
};

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
      <Header style={headerStyle}>
        <Button
          type="link"
          href="https://github.com/athrael-soju/whisperChat"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#fff" }}
        >
          whisperChat
        </Button>
        <Space>
          {user ? (
            <>
              <Button danger type="primary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleLoginModalShow} type="default">
                Login
              </Button>
              <Button onClick={handleSignupModalShow} type="primary">
                Sign up
              </Button>
            </>
          )}
          {!user && (
            <>
              <AccountModal
                show={showSignupModal}
                handleClose={handleSignupModalClose}
              >
                <RegisterForm setUser={setUser} />
              </AccountModal>
              <AccountModal
                show={showLoginModal}
                handleClose={handleLoginModalClose}
              >
                <LoginForm setUser={setUser} />
              </AccountModal>
            </>
          )}
          {user && (
            <>
              <AccountModal
                show={showAccountModal}
                handleClose={handleAccountModalClose}
              >
                <AccountDetailsForm user={user} />
              </AccountModal>
              <Button onClick={handleAccountModalShow}>
                {user ? user.username : "Account"}
              </Button>
            </>
          )}
        </Space>
      </Header>
    </>
  );
}

export default Navbar;

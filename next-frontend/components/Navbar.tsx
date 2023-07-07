const { Layout, Menu } = require("antd");
const { Header } = Layout;

export default function Navbar() {
  return (
    <Header
      style={{ position: "fixed", zIndex: 1, width: "100%", overflow: "auto" }}
    >
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">Home</Menu.Item>
        <Menu.Item key="2">About</Menu.Item>
        <Menu.Item key="3">Contact</Menu.Item>
      </Menu>
    </Header> 
  );
}

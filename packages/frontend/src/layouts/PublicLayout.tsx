import { Layout, Menu } from "antd";
import { HomeOutlined, GlobalOutlined } from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import ChatWidget from "../features/chat/components/ChatWidget";

const { Header, Content } = Layout;

export default function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Início",
    },
    {
      key: "website",
      icon: <GlobalOutlined />,
      label: (
        <a
          href="https://www.escolaangelim.com.br"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit" }}
        >
          Sobre
        </a>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: "#3E2723",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "#FDF8F0",
            borderRadius: 8,
            padding: "4px 12px",
            marginRight: 32,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="Angelim"
            style={{ height: 40 }}
          />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => {
            if (key !== "website") {
              navigate(key);
            }
          }}
          style={{ flex: 1, minWidth: 0, background: "#3E2723" }}
        />
      </Header>
      <Content>
        <Outlet />
      </Content>
      <ChatWidget />
    </Layout>
  );
}

import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import {
  TeamOutlined,
  CalendarOutlined,
  MessageOutlined,
  DashboardOutlined,
  ScheduleOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { Sider, Content, Header } = Layout;

const menuItems = [
  {
    key: "/admin",
    icon: <DashboardOutlined />,
    label: "Painel",
  },
  {
    key: "/admin/leads",
    icon: <TeamOutlined />,
    label: "Funil de Vendas",
  },
  {
    key: "/admin/visits",
    icon: <CalendarOutlined />,
    label: "Visitas",
  },
  {
    key: "/admin/availability",
    icon: <ScheduleOutlined />,
    label: "Disponibilidade",
  },
  {
    key: "/admin/chat",
    icon: <MessageOutlined />,
    label: "Chat",
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} breakpoint="lg" collapsedWidth={60}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#FDF8F0",
              borderRadius: 8,
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/logo.png"
              alt="Angelim"
              style={{ height: 36 }}
            />
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e8ddd0",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            Gestão Escolar
          </h2>

          <Dropdown
            menu={{
              items: [
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Sair",
                  onClick: handleLogout,
                },
              ],
            }}
            placement="bottomRight"
          >
            <Space style={{ cursor: "pointer" }}>
              <Avatar size="small" icon={<UserOutlined />} />
              <span style={{ fontSize: 14 }}>{admin?.name || admin?.email}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

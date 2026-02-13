import { Layout, Menu } from "antd";
import {
  TeamOutlined,
  CalendarOutlined,
  MessageOutlined,
  DashboardOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} breakpoint="lg" collapsedWidth={60}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FDF8F0",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 0.5,
          }}
        >
          Angelim
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
            borderBottom: "1px solid #e8ddd0",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            Gestão Escolar
          </h2>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

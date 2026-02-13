import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import ChatWidget from "../features/chat/components/ChatWidget";

const { Content } = Layout;

export default function PublicLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content>
        <Outlet />
      </Content>
      <ChatWidget />
    </Layout>
  );
}

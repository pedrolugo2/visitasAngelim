import { Button, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 24,
        textAlign: "center",
      }}
    >
      <Space direction="vertical" size="large">
        <Title level={1}>Escola Angelim</Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 500 }}>
          Agende uma visita e venha conhecer nossa escola Waldorf.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate("/agendar")}
        >
          Agendar Visita
        </Button>
      </Space>
    </div>
  );
}

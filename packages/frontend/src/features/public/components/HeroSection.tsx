import { Button, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #5B8C5A 0%, #6BA3BE 100%)",
        padding: "80px 24px",
        textAlign: "center",
        color: "#FDF8F0",
      }}
    >
      <Title level={1} style={{ color: "#FDF8F0", marginBottom: 16, fontSize: 48 }}>
        Bem-vindo à Escola Angelim
      </Title>
      <Paragraph
        style={{
          fontSize: 20,
          color: "#FDF8F0",
          maxWidth: 700,
          margin: "0 auto 32px",
          opacity: 0.95,
        }}
      >
        Educação Waldorf que respeita o desenvolvimento natural da criança,
        integrando artes, ciências e vivências práticas.
      </Paragraph>
      <Button
        type="primary"
        size="large"
        icon={<CalendarOutlined />}
        onClick={() => navigate("/agendar")}
        style={{
          height: 48,
          fontSize: 16,
          background: "#D4874D",
          borderColor: "#D4874D",
        }}
      >
        Agende uma Visita
      </Button>
    </div>
  );
}

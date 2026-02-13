import { Card, Row, Col, Button, Typography } from "antd";
import { SmileOutlined, ReadOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUnits } from "../../../hooks/useUnits";

const { Title, Paragraph } = Typography;

export default function UnitsShowcase() {
  const navigate = useNavigate();
  const { units } = useUnits();

  const unitsWithIcons = units.map((unit) => ({
    ...unit,
    icon: unit.id === "jardim" ? <SmileOutlined /> : <ReadOutlined />,
    color: unit.id === "jardim" ? "#E8C547" : "#6BA3BE",
  }));

  return (
    <div
      style={{
        padding: "60px 24px",
        background: "#f9f5ef",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center", color: "#3E2723", marginBottom: 48 }}>
          Nossas Unidades
        </Title>

        <Row gutter={[32, 32]}>
          {unitsWithIcons.map((unit) => (
            <Col xs={24} md={12} key={unit.id}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  borderTop: `4px solid ${unit.color}`,
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 48,
                      color: unit.color,
                      marginBottom: 16,
                    }}
                  >
                    {unit.icon}
                  </div>
                  <Title level={3} style={{ margin: 0, color: "#3E2723" }}>
                    {unit.name}
                  </Title>
                </div>
                <Paragraph style={{ fontSize: 15, color: "#3E2723", textAlign: "center", minHeight: 80 }}>
                  {unit.description}
                </Paragraph>
                <div style={{ textAlign: "center", marginTop: 24 }}>
                  <Button
                    type="primary"
                    icon={<CalendarOutlined />}
                    onClick={() => navigate("/agendar")}
                    style={{
                      background: unit.color,
                      borderColor: unit.color,
                    }}
                  >
                    Agendar Visita - {unit.name}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

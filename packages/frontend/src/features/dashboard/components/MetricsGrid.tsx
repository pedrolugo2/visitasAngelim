import { Row, Col, Card, Statistic } from "antd";
import { TeamOutlined, CalendarOutlined, RiseOutlined, MessageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { DashboardMetrics } from "../hooks/useDashboard";

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  const navigate = useNavigate();

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable onClick={() => navigate("/admin/leads")} style={{ cursor: "pointer" }}>
          <Statistic
            title="Total de Leads"
            value={metrics.totalLeads}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#5B8C5A" }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card hoverable onClick={() => navigate("/admin/visits")} style={{ cursor: "pointer" }}>
          <Statistic
            title="Visitas Este Mês"
            value={metrics.visitsThisMonth}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#D4874D" }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card hoverable onClick={() => navigate("/admin/visits")} style={{ cursor: "pointer" }}>
          <Statistic
            title="Visitas Hoje"
            value={metrics.visitsToday}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#E8C547" }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Taxa de Conversão"
            value={metrics.conversionRate}
            precision={1}
            suffix="%"
            prefix={<RiseOutlined />}
            valueStyle={{ color: "#6BA3BE" }}
          />
        </Card>
      </Col>
    </Row>
  );
}

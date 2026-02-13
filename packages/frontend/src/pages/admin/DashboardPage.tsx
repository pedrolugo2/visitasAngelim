import { Row, Col, Typography, Spin, Alert } from "antd";
import { useDashboard } from "../../features/dashboard/hooks/useDashboard";
import MetricsGrid from "../../features/dashboard/components/MetricsGrid";
import UpcomingVisitsList from "../../features/dashboard/components/UpcomingVisitsList";
import RecentLeadsList from "../../features/dashboard/components/RecentLeadsList";

const { Title } = Typography;

export default function DashboardPage() {
  const { metrics, upcomingVisits, recentLeads, loading, error } = useDashboard();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Erro ao carregar painel"
        description={error.message}
        showIcon
      />
    );
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Painel Geral
      </Title>

      <MetricsGrid metrics={metrics} />

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <UpcomingVisitsList visits={upcomingVisits} />
        </Col>
        <Col xs={24} lg={12}>
          <RecentLeadsList leads={recentLeads} />
        </Col>
      </Row>
    </div>
  );
}

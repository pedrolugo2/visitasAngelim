import { Card, List, Typography, Tag, Empty } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import type { Lead } from "@visitas-angelim/shared";
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@visitas-angelim/shared";

const { Title, Text } = Typography;

interface RecentLeadsListProps {
  leads: Lead[];
}

export default function RecentLeadsList({ leads }: RecentLeadsListProps) {
  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TeamOutlined />
          <span>Leads Recentes</span>
        </div>
      }
      extra={<Link to="/admin/leads">Ver todos</Link>}
    >
      {leads.length === 0 ? (
        <Empty description="Nenhum lead cadastrado" />
      ) : (
        <List
          dataSource={leads}
          renderItem={(lead) => (
            <List.Item>
              <List.Item.Meta
                title={<Text strong>{lead.parentName}</Text>}
                description={
                  <div>
                    <div style={{ fontSize: 12, color: "#8c7b6b" }}>
                      {lead.parentEmail}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <Tag color={LEAD_STATUS_COLORS[lead.status]}>
                        {LEAD_STATUS_LABELS[lead.status]}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>
                        {dayjs(lead.createdAt as string).format("DD/MM/YYYY")}
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}

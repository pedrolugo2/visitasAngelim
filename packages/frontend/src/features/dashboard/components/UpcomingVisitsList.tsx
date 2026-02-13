import { Card, List, Typography, Tag, Empty } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import type { Visit } from "@visitas-angelim/shared";
import { VISIT_STATUS_LABELS } from "@visitas-angelim/shared";
import { useUnits } from "../../../hooks/useUnits";

const { Title, Text } = Typography;

interface UpcomingVisitsListProps {
  visits: Visit[];
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "blue",
  confirmed: "green",
  completed: "default",
  cancelled: "red",
};

export default function UpcomingVisitsList({ visits }: UpcomingVisitsListProps) {
  const { units } = useUnits();

  const unitsMap = units.reduce(
    (acc, unit) => {
      acc[unit.id] = unit.name;
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarOutlined />
          <span>Próximas Visitas</span>
        </div>
      }
      extra={<Link to="/admin/visits">Ver todas</Link>}
    >
      {visits.length === 0 ? (
        <Empty description="Nenhuma visita agendada" />
      ) : (
        <List
          dataSource={visits}
          renderItem={(visit) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div>
                    <Text strong>{visit.parentName}</Text>
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                      {unitsMap[visit.unitId]}
                    </Text>
                  </div>
                }
                description={
                  <div>
                    <div>{dayjs(visit.visitDateTime as string).format("DD/MM/YYYY [às] HH:mm")}</div>
                    <Tag color={STATUS_COLORS[visit.status]} style={{ marginTop: 4 }}>
                      {VISIT_STATUS_LABELS[visit.status]}
                    </Tag>
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

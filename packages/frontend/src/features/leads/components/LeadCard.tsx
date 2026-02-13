import { Card, Tag, Typography } from "antd";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Lead } from "@visitas-angelim/shared";
import { LEAD_SOURCE_LABELS } from "@visitas-angelim/shared";
import dayjs from "dayjs";

const { Text } = Typography;

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        size="small"
        hoverable
        onClick={() => onClick(lead)}
        style={{ marginBottom: 8 }}
        styles={{ body: { padding: 12 } }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <UserOutlined style={{ fontSize: 12, color: "#8c7b6b" }} />
          <Text strong ellipsis style={{ flex: 1, fontSize: 13 }}>
            {lead.parentName}
          </Text>
        </div>

        {lead.childName && (
          <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
            {lead.childName}
            {lead.childAge ? ` (${lead.childAge} anos)` : ""}
          </Text>
        )}

        {lead.parentPhone && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
            <PhoneOutlined style={{ fontSize: 11, color: "#8c7b6b" }} />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {lead.parentPhone}
            </Text>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          {lead.source && (
            <Tag style={{ fontSize: 11, margin: 0 }}>
              {LEAD_SOURCE_LABELS[lead.source]}
            </Tag>
          )}
          {lead.updatedAt && (
            <Text type="secondary" style={{ fontSize: 10 }}>
              {dayjs(lead.updatedAt as string).format("DD/MM")}
            </Text>
          )}
        </div>
      </Card>
    </div>
  );
}

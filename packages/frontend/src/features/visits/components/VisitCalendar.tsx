import { useState, useCallback } from "react";
import { Calendar, Badge, Modal, List, Typography, Tag, Spin, Alert } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { Visit } from "@visitas-angelim/shared";
import { VISIT_STATUS_LABELS } from "@visitas-angelim/shared";
import { useVisits } from "../hooks/useVisits";
import { useUnits } from "../../../hooks/useUnits";
import VisitDetailDrawer from "./VisitDetailDrawer";

const { Title, Text } = Typography;

const STATUS_COLORS: Record<string, string> = {
  scheduled: "blue",
  confirmed: "green",
  completed: "default",
  cancelled: "red",
};

export default function VisitCalendar() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const { visits, loading, error } = useVisits();
  const { units } = useUnits();

  const unitsMap = units.reduce(
    (acc, unit) => {
      acc[unit.id] = unit.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const getVisitsForDate = useCallback(
    (date: Dayjs) => {
      return visits.filter((v) =>
        dayjs(v.visitDateTime as string).isSame(date, "day")
      );
    },
    [visits]
  );

  const dateCellRender = (value: Dayjs) => {
    const dayVisits = getVisitsForDate(value);
    if (dayVisits.length === 0) return null;

    return (
      <div style={{ fontSize: 12 }}>
        {dayVisits.slice(0, 2).map((visit) => (
          <div key={visit.id} style={{ marginBottom: 2 }}>
            <Badge
              status={STATUS_COLORS[visit.status] as any}
              text={dayjs(visit.visitDateTime as string).format("HH:mm")}
            />
          </div>
        ))}
        {dayVisits.length > 2 && (
          <Text type="secondary" style={{ fontSize: 11 }}>
            +{dayVisits.length - 2} mais
          </Text>
        )}
      </div>
    );
  };

  const handleSelect = (date: Dayjs) => {
    const dayVisits = getVisitsForDate(date);
    if (dayVisits.length > 0) {
      setSelectedDate(date);
      setModalOpen(true);
    }
  };

  const handleVisitClick = (visit: Visit) => {
    setModalOpen(false);
    setSelectedVisit(visit);
    setDrawerOpen(true);
  };

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
        message="Erro ao carregar visitas"
        description={error.message}
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  const dayVisits = selectedDate ? getVisitsForDate(selectedDate) : [];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 20 }}>
        Calendário de Visitas
      </Title>

      <Calendar
        cellRender={dateCellRender}
        onSelect={handleSelect}
        style={{ background: "#fff", borderRadius: 8, padding: 16 }}
      />

      <Modal
        title={selectedDate?.format("DD/MM/YYYY")}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={500}
      >
        <List
          dataSource={dayVisits}
          renderItem={(visit) => (
            <List.Item
              onClick={() => handleVisitClick(visit)}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                title={
                  <div>
                    {dayjs(visit.visitDateTime as string).format("HH:mm")} - {visit.parentName}
                  </div>
                }
                description={
                  <div>
                    <Text type="secondary">{unitsMap[visit.unitId]}</Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag color={STATUS_COLORS[visit.status]}>
                        {VISIT_STATUS_LABELS[visit.status]}
                      </Tag>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      <VisitDetailDrawer
        open={drawerOpen}
        visit={selectedVisit}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedVisit(null);
        }}
      />
    </div>
  );
}

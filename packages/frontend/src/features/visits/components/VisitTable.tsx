import { useState, useCallback } from "react";
import { Table, Select, DatePicker, Space, Typography, Tag, Spin, Alert } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Visit } from "@visitas-angelim/shared";
import { VISIT_STATUSES, VISIT_STATUS_LABELS } from "@visitas-angelim/shared";
import { useVisits } from "../hooks/useVisits";
import { useUnits } from "../../../hooks/useUnits";
import VisitDetailDrawer from "./VisitDetailDrawer";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const STATUS_COLORS: Record<string, string> = {
  scheduled: "blue",
  confirmed: "green",
  completed: "default",
  cancelled: "red",
};

export default function VisitTable() {
  const [unitFilter, setUnitFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[string, string] | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const { visits, loading, error } = useVisits({
    unitId: unitFilter,
    status: statusFilter as any,
    dateFrom: dateRange?.[0],
    dateTo: dateRange?.[1],
  });
  const { units } = useUnits();

  const handleRowClick = useCallback((visit: Visit) => {
    setSelectedVisit(visit);
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setSelectedVisit(null);
  }, []);

  const unitsMap = units.reduce(
    (acc, unit) => {
      acc[unit.id] = unit.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const columns = [
    {
      title: "Data/Hora",
      dataIndex: "visitDateTime",
      key: "visitDateTime",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      width: 150,
    },
    {
      title: "Responsável",
      dataIndex: "parentName",
      key: "parentName",
    },
    {
      title: "Criança",
      dataIndex: "childName",
      key: "childName",
      render: (name: string | undefined, record: Visit) =>
        name ? `${name} (${record.childAge || "?"}a)` : "-",
    },
    {
      title: "Unidade",
      dataIndex: "unitId",
      key: "unitId",
      render: (unitId: string) => unitsMap[unitId] || unitId,
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={STATUS_COLORS[status]}>
          {VISIT_STATUS_LABELS[status as keyof typeof VISIT_STATUS_LABELS]}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: Visit) => (
        <a onClick={() => handleRowClick(record)}>
          <EyeOutlined /> Ver detalhes
        </a>
      ),
      width: 120,
    },
  ];

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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Lista de Visitas
        </Title>
        <Space>
          <Select
            placeholder="Todas as unidades"
            style={{ width: 180 }}
            allowClear
            value={unitFilter}
            onChange={setUnitFilter}
            options={units.map((u) => ({ value: u.id, label: u.name }))}
          />
          <Select
            placeholder="Todos os status"
            style={{ width: 180 }}
            allowClear
            value={statusFilter}
            onChange={setStatusFilter}
            options={VISIT_STATUSES.map((s) => ({
              value: s,
              label: VISIT_STATUS_LABELS[s],
            }))}
          />
          <RangePicker
            format="DD/MM/YYYY"
            placeholder={["Data início", "Data fim"]}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([
                  dates[0].startOf("day").toISOString(),
                  dates[1].endOf("day").toISOString(),
                ]);
              } else {
                setDateRange(undefined);
              }
            }}
          />
        </Space>
      </div>

      <Table
        dataSource={visits}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        onRow={(record) => ({
          style: { cursor: "pointer" },
        })}
      />

      <VisitDetailDrawer
        open={drawerOpen}
        visit={selectedVisit}
        onClose={handleDrawerClose}
      />
    </div>
  );
}

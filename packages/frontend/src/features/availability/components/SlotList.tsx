import { useState, useCallback } from "react";
import { Table, Button, Select, Tag, Popconfirm, Space, Typography, Spin, Alert, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { AvailabilitySlot } from "@visitas-angelim/shared";
import { useAvailabilitySlots } from "../hooks/useAvailabilitySlots";
import { useUnits } from "../../../hooks/useUnits";
import { deleteSlot } from "../../../services/availability.service";
import SlotDetailDrawer from "./SlotDetailDrawer";

const { Title } = Typography;

export default function SlotList() {
  const [unitFilter, setUnitFilter] = useState<string | undefined>(undefined);
  const { slots, loading, error } = useAvailabilitySlots(unitFilter);
  const { units } = useUnits();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  const handleNewSlot = useCallback(() => {
    setSelectedSlot(null);
    setDrawerOpen(true);
  }, []);

  const handleEditSlot = useCallback((slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setSelectedSlot(null);
  }, []);

  async function handleDeleteSlot(id: string) {
    try {
      await deleteSlot(id);
      message.success("Slot excluído com sucesso");
    } catch {
      message.error("Erro ao excluir slot");
    }
  }

  const unitsMap = units.reduce(
    (acc, unit) => {
      acc[unit.id] = unit.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const columns = [
    {
      title: "Unidade",
      dataIndex: "unitId",
      key: "unitId",
      render: (unitId: string) => unitsMap[unitId] || unitId,
      width: 120,
    },
    {
      title: "Data/Hora",
      key: "datetime",
      render: (_: unknown, record: AvailabilitySlot) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {dayjs(record.startTime as string).format("DD/MM/YYYY")}
          </div>
          <div style={{ fontSize: 12, color: "#8c7b6b" }}>
            {dayjs(record.startTime as string).format("HH:mm")} -{" "}
            {dayjs(record.endTime as string).format("HH:mm")}
          </div>
        </div>
      ),
      width: 150,
    },
    {
      title: "Capacidade",
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (tag: string | undefined) =>
        tag ? <Tag color="blue">{tag}</Tag> : null,
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "isBookable",
      key: "isBookable",
      render: (isBookable: boolean) =>
        isBookable ? (
          <Tag color="green">Reservável</Tag>
        ) : (
          <Tag color="red">Bloqueado</Tag>
        ),
      width: 120,
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: AvailabilitySlot) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditSlot(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Excluir este slot?"
            description="Esta ação não pode ser desfeita."
            onConfirm={() => handleDeleteSlot(record.id)}
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
      width: 150,
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
        message="Erro ao carregar slots"
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
          Gestão de Disponibilidade
        </Title>
        <Space>
          <Select
            placeholder="Todas as unidades"
            style={{ width: 200 }}
            allowClear
            value={unitFilter}
            onChange={setUnitFilter}
            options={units.map((u) => ({ value: u.id, label: u.name }))}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleNewSlot}
          >
            Novo Slot
          </Button>
        </Space>
      </div>

      <Table
        dataSource={slots}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 20 }}
      />

      <SlotDetailDrawer
        open={drawerOpen}
        slot={selectedSlot}
        onClose={handleDrawerClose}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Table, Tag, Button, Typography, Spin, Alert, Space, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { TeacherAvailability } from "@visitas-angelim/shared";
import { useUnits } from "../../../hooks/useUnits";
import {
  subscribeToTeacherAvailability,
  updateTeacherAvailabilityStatus,
} from "../../../services/teacherAvailability.service";

const { Title } = Typography;

export default function TeacherAvailabilityList() {
  const [availability, setAvailability] = useState<TeacherAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { units } = useUnits();

  useEffect(() => {
    const unsubscribe = subscribeToTeacherAvailability(
      (data) => {
        setAvailability(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function handleMarkAsReviewed(id: string) {
    try {
      await updateTeacherAvailabilityStatus(id, "reviewed");
      message.success("Marcado como revisado");
    } catch {
      message.error("Erro ao atualizar status");
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
      title: "Professor",
      dataIndex: "teacherName",
      key: "teacherName",
    },
    {
      title: "E-mail",
      dataIndex: "teacherEmail",
      key: "teacherEmail",
    },
    {
      title: "Unidade",
      dataIndex: "unitId",
      key: "unitId",
      render: (unitId: string) => unitsMap[unitId] || unitId,
    },
    {
      title: "Datas",
      dataIndex: "availableDates",
      key: "availableDates",
      render: (dates: string[]) => (
        <div>
          {dates.slice(0, 3).map((date, idx) => (
            <div key={idx} style={{ fontSize: 12 }}>
              {dayjs(date).format("DD/MM/YYYY")}
            </div>
          ))}
          {dates.length > 3 && (
            <div style={{ fontSize: 11, color: "#8c7b6b" }}>
              +{dates.length - 3} mais
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Períodos",
      dataIndex: "preferredTimes",
      key: "preferredTimes",
      render: (times: string[]) =>
        times.map((t) => (
          <Tag key={t}>{t === "morning" ? "Manhã" : "Tarde"}</Tag>
        )),
    },
    {
      title: "Data de Envio",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status === "pending" ? (
          <Tag color="orange">Pendente</Tag>
        ) : (
          <Tag color="green">Revisado</Tag>
        ),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: TeacherAvailability) =>
        record.status === "pending" ? (
          <Button
            size="small"
            icon={<CheckOutlined />}
            onClick={() => handleMarkAsReviewed(record.id)}
          >
            Marcar como Revisado
          </Button>
        ) : null,
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
        message="Erro ao carregar disponibilidades"
        description={error.message}
        showIcon
      />
    );
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 20 }}>
        Disponibilidade de Professores
      </Title>

      <Table
        dataSource={availability}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: "12px 24px" }}>
              <strong>Observações:</strong>
              <p style={{ margin: "8px 0 0 0" }}>
                {record.notes || "Nenhuma observação"}
              </p>
            </div>
          ),
        }}
      />
    </div>
  );
}

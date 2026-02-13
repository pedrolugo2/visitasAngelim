import { useState, useEffect, useCallback } from "react";
import { Table, Tag, Select, Typography, Spin, Alert } from "antd";
import dayjs from "dayjs";
import type { ChatLog } from "@visitas-angelim/shared";
import { subscribeToAllSessions } from "../../../services/chat.service";
import ChatSessionDrawer from "./ChatSessionDrawer";

const { Title } = Typography;

interface SessionInfo {
  sessionId: string;
  lastMessage: string;
  lastTimestamp: string;
  messageCount: number;
  hasAdminReply: boolean;
  participantEmail?: string;
}

export default function ChatSessionList() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "answered">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAllSessions(
      (data) => {
        const sessionInfos: SessionInfo[] = [];

        data.forEach((logs, sessionId) => {
          if (logs.length === 0) return;

          const sortedLogs = [...logs].sort(
            (a, b) =>
              new Date(b.timestamp as string).getTime() -
              new Date(a.timestamp as string).getTime()
          );

          const lastLog = sortedLogs[0];
          const hasAdminReply = logs.some((log) => log.participantType === "Admin");

          sessionInfos.push({
            sessionId,
            lastMessage: lastLog.message,
            lastTimestamp: lastLog.timestamp as string,
            messageCount: logs.length,
            hasAdminReply,
          });
        });

        // Sort by last timestamp descending
        sessionInfos.sort(
          (a, b) =>
            new Date(b.lastTimestamp).getTime() -
            new Date(a.lastTimestamp).getTime()
        );

        setSessions(sessionInfos);
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

  const handleRowClick = useCallback((sessionId: string) => {
    setSelectedSessionId(sessionId);
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setSelectedSessionId(null);
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (filter === "pending") return !s.hasAdminReply;
    if (filter === "answered") return s.hasAdminReply;
    return true;
  });

  const columns = [
    {
      title: "Sessão",
      dataIndex: "sessionId",
      key: "sessionId",
      render: (id: string) => id.substring(0, 20) + "...",
      width: 200,
    },
    {
      title: "Última Mensagem",
      dataIndex: "lastMessage",
      key: "lastMessage",
      render: (msg: string) => (
        <div style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {msg}
        </div>
      ),
    },
    {
      title: "Data/Hora",
      dataIndex: "lastTimestamp",
      key: "lastTimestamp",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      width: 150,
    },
    {
      title: "Mensagens",
      dataIndex: "messageCount",
      key: "messageCount",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "hasAdminReply",
      key: "hasAdminReply",
      render: (hasReply: boolean) =>
        hasReply ? (
          <Tag color="green">Respondido</Tag>
        ) : (
          <Tag color="orange">Pendente</Tag>
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
        message="Erro ao carregar conversas"
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
          Conversas do Chat
        </Title>
        <Select
          value={filter}
          onChange={setFilter}
          style={{ width: 180 }}
          options={[
            { value: "all", label: "Todas" },
            { value: "pending", label: "Pendentes" },
            { value: "answered", label: "Respondidas" },
          ]}
        />
      </div>

      <Table
        dataSource={filteredSessions}
        columns={columns}
        rowKey="sessionId"
        pagination={{ pageSize: 20 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record.sessionId),
          style: { cursor: "pointer" },
        })}
      />

      {selectedSessionId && (
        <ChatSessionDrawer
          open={drawerOpen}
          sessionId={selectedSessionId}
          onClose={handleDrawerClose}
        />
      )}
    </div>
  );
}

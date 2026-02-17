import { useState, useRef, useEffect } from "react";
import { Drawer, List, Input, Button, Space, Avatar, Typography, Spin } from "antd";
import { SendOutlined, UserOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useChat } from "../hooks/useChat";
import { sendMessage } from "../../../services/chat.service";

const { Text } = Typography;

interface ChatSessionDrawerProps {
  open: boolean;
  sessionId: string;
  onClose: () => void;
}

export default function ChatSessionDrawer({
  open,
  sessionId,
  onClose,
}: ChatSessionDrawerProps) {
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading } = useChat(sessionId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendReply() {
    if (!inputValue.trim()) return;

    setSending(true);
    try {
      await sendMessage(sessionId, inputValue.trim(), "Admin");
      setInputValue("");
    } catch {
      // Error handling
    } finally {
      setSending(false);
    }
  }

  return (
    <Drawer
      title={`Conversa: ${sessionId.substring(0, 30)}...`}
      open={open}
      onClose={onClose}
      width={520}
    >
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          {/* Messages list */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginBottom: 16,
              padding: 16,
              background: "#f9f5ef",
              borderRadius: 8,
            }}
          >
            <List
              dataSource={messages}
              renderItem={(msg) => {
                const isParent = msg.participantType === "Parent";

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: isParent ? "flex-start" : "flex-end",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: isParent ? "row" : "row-reverse",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <Avatar
                        size="small"
                        icon={isParent ? <UserOutlined /> : <CustomerServiceOutlined />}
                        style={{
                          background: isParent ? "#6BA3BE" : "#5B8C5A",
                        }}
                      />
                      <div
                        style={{
                          maxWidth: 350,
                          padding: "8px 12px",
                          borderRadius: 8,
                          background: isParent ? "#fff" : "#5B8C5A",
                          color: isParent ? "#3E2723" : "#fff",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        }}
                      >
                        <div>{msg.message}</div>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: 11,
                            color: isParent ? "#8c7b6b" : "#e8f5e8",
                            display: "block",
                            marginTop: 4,
                          }}
                        >
                          {dayjs(msg.timestamp as string).format("DD/MM/YYYY HH:mm")}
                        </Text>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* Reply input */}
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Digite sua resposta..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSendReply}
              disabled={sending}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendReply}
              loading={sending}
            >
              Enviar
            </Button>
          </Space.Compact>
        </div>
      )}
    </Drawer>
  );
}

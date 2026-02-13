import { useState, useRef, useEffect } from "react";
import { Input, Button, List, Typography, Space, Avatar, Spin, message as antdMessage } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useChat } from "../hooks/useChat";
import { getFaqMatch } from "../../../services/chat.service";

const { Text } = Typography;

interface ChatPanelProps {
  sessionId: string;
}

export default function ChatPanel({ sessionId }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, loading } = useChat(sessionId);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setSending(true);

    try {
      // Check for FAQ match first
      const faqMatch = await getFaqMatch(userMessage);

      // Send user message
      await sendMessage(userMessage);

      // If FAQ matched, send automatic response
      if (faqMatch) {
        setTimeout(async () => {
          await sendMessage(`🤖 ${faqMatch.answer}`);
        }, 500);
      } else {
        // No FAQ match, send pending message
        setTimeout(async () => {
          await sendMessage(
            "Obrigado pela sua mensagem! Nossa equipe responderá em breve."
          );
        }, 500);
      }
    } catch (err) {
      antdMessage.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Messages list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          background: "#f9f5ef",
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Text type="secondary">
              Olá! Como posso ajudar você hoje?
            </Text>
          </div>
        ) : (
          <List
            dataSource={messages}
            renderItem={(msg) => {
              const isParent = msg.participantType === "Parent";
              const isBot = msg.message.startsWith("🤖");

              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: isParent ? "flex-end" : "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <Space
                    align="start"
                    direction={isParent ? "horizontal-reverse" : "horizontal"}
                  >
                    <Avatar
                      size="small"
                      icon={isParent ? <UserOutlined /> : <RobotOutlined />}
                      style={{
                        background: isParent ? "#5B8C5A" : "#8c7b6b",
                      }}
                    />
                    <div
                      style={{
                        maxWidth: 250,
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: isParent ? "#5B8C5A" : "#fff",
                        color: isParent ? "#fff" : "#3E2723",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div>{msg.message}</div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 11,
                          color: isParent ? "#e8f5e8" : "#8c7b6b",
                          display: "block",
                          marginTop: 4,
                        }}
                      >
                        {dayjs(msg.timestamp as string).format("HH:mm")}
                      </Text>
                    </div>
                  </Space>
                </div>
              );
            }}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: 16,
          borderTop: "1px solid #e8ddd0",
          background: "#fff",
        }}
      >
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleSend}
            disabled={sending}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={sending}
          >
            Enviar
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { FloatButton, Drawer } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ChatPanel from "./ChatPanel";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Get or create session ID from localStorage
    let storedSessionId = localStorage.getItem("chatSessionId");
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chatSessionId", storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  if (!sessionId) return null;

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={() => setOpen(true)}
        badge={{ dot: false }}
      />

      <Drawer
        title="Chat - Escola Angelim"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={400}
        styles={{ body: { padding: 0 } }}
      >
        <ChatPanel sessionId={sessionId} />
      </Drawer>
    </>
  );
}

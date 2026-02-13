import { useEffect, useState, useCallback } from "react";
import type { ChatLog } from "@visitas-angelim/shared";
import { subscribeToChatSession, sendMessage as sendChatMessage } from "../../../services/chat.service";

export interface UseChatReturn {
  messages: ChatLog[];
  sendMessage: (message: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useChat(sessionId: string): UseChatReturn {
  const [messages, setMessages] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToChatSession(
      sessionId,
      (data) => {
        setMessages(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [sessionId]);

  const sendMessage = useCallback(
    async (message: string) => {
      await sendChatMessage(sessionId, message, "Parent");
    },
    [sessionId]
  );

  return { messages, sendMessage, loading, error };
}

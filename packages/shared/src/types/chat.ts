import type { TimestampField } from "./common";

export type ChatParticipantType = "Parent" | "Admin";

export interface ChatLog {
  id: string;
  sessionId: string;
  participantType: ChatParticipantType;
  message: string;
  timestamp: TimestampField;
  leadId?: string;
}

export interface ChatFaq {
  id: string;
  question: string;
  answer: string;
  keywords?: string[];
}

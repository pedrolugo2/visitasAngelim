import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import type { ChatLog, ChatFaq } from "@visitas-angelim/shared";

const LOGS_COLLECTION = "chat_logs";
const FAQS_COLLECTION = "chat_faqs";
const logsRef = collection(db, LOGS_COLLECTION);
const faqsRef = collection(db, FAQS_COLLECTION);

/** Convert a Firestore document to a ChatLog object */
function docToLog(id: string, data: Record<string, unknown>): ChatLog {
  return {
    id,
    sessionId: data.sessionId as string,
    participantType: data.participantType as "Parent" | "Admin",
    message: data.message as string,
    timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
    leadId: data.leadId as string | undefined,
  };
}

/** Convert a Firestore document to a ChatFaq object */
function docToFaq(id: string, data: Record<string, unknown>): ChatFaq {
  return {
    id,
    question: data.question as string,
    answer: data.answer as string,
    keywords: (data.keywords as string[]) || [],
  };
}

/** Subscribe to chat logs for a specific session */
export function subscribeToChatSession(
  sessionId: string,
  onData: (logs: ChatLog[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(
    logsRef,
    where("sessionId", "==", sessionId),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const logs = snapshot.docs.map((d) =>
        docToLog(d.id, d.data() as Record<string, unknown>)
      );
      onData(logs);
    },
    onError
  );
}

/** Subscribe to all chat sessions (admin view) */
export function subscribeToAllSessions(
  onData: (sessions: Map<string, ChatLog[]>) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(logsRef, orderBy("timestamp", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const sessions = new Map<string, ChatLog[]>();
      snapshot.docs.forEach((d) => {
        const log = docToLog(d.id, d.data() as Record<string, unknown>);
        if (!sessions.has(log.sessionId)) {
          sessions.set(log.sessionId, []);
        }
        sessions.get(log.sessionId)!.push(log);
      });
      onData(sessions);
    },
    onError
  );
}

/** Send a chat message */
export async function sendMessage(
  sessionId: string,
  message: string,
  participantType: "Parent" | "Admin",
  leadId?: string
): Promise<string> {
  const docRef = await addDoc(logsRef, {
    sessionId,
    participantType,
    message,
    timestamp: Timestamp.now(),
    leadId: leadId || null,
  });
  return docRef.id;
}

/** Subscribe to all FAQs */
export function subscribeToFaqs(
  onData: (faqs: ChatFaq[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(faqsRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const faqs = snapshot.docs.map((d) =>
        docToFaq(d.id, d.data() as Record<string, unknown>)
      );
      onData(faqs);
    },
    onError
  );
}

/** Get FAQ match for a message */
export async function getFaqMatch(message: string): Promise<ChatFaq | null> {
  const snapshot = await getDocs(faqsRef);
  const faqs = snapshot.docs.map((d) =>
    docToFaq(d.id, d.data() as Record<string, unknown>)
  );

  const normalizedMessage = message.toLowerCase();

  // Find FAQ with matching keywords
  for (const faq of faqs) {
    if (faq.keywords && faq.keywords.length > 0) {
      const hasMatch = faq.keywords.some((keyword) =>
        normalizedMessage.includes(keyword.toLowerCase())
      );
      if (hasMatch) return faq;
    }
  }

  return null;
}

/** Create a new FAQ */
export async function createFaq(
  data: Omit<ChatFaq, "id">
): Promise<string> {
  const docRef = await addDoc(faqsRef, data);
  return docRef.id;
}

/** Update an existing FAQ */
export async function updateFaq(
  id: string,
  data: Partial<Omit<ChatFaq, "id">>
): Promise<void> {
  const docRef = doc(db, FAQS_COLLECTION, id);
  await updateDoc(docRef, data as Record<string, unknown>);
}

/** Delete a FAQ */
export async function deleteFaq(id: string): Promise<void> {
  const docRef = doc(db, FAQS_COLLECTION, id);
  await deleteDoc(docRef);
}

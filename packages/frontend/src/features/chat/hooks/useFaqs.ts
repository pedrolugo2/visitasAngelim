import { useEffect, useState } from "react";
import type { ChatFaq } from "@visitas-angelim/shared";
import { subscribeToFaqs } from "../../../services/chat.service";

export interface UseFaqsReturn {
  faqs: ChatFaq[];
  loading: boolean;
  error: Error | null;
}

export function useFaqs(): UseFaqsReturn {
  const [faqs, setFaqs] = useState<ChatFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToFaqs(
      (data) => {
        setFaqs(data);
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

  return { faqs, loading, error };
}

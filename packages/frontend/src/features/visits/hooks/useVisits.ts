import { useEffect, useState } from "react";
import type { Visit } from "@visitas-angelim/shared";
import { subscribeToVisits, type VisitFilters } from "../../../services/visits.service";

export interface UseVisitsReturn {
  visits: Visit[];
  loading: boolean;
  error: Error | null;
}

export function useVisits(filters?: VisitFilters): UseVisitsReturn {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToVisits(
      filters,
      (data) => {
        setVisits(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [filters?.unitId, filters?.status, filters?.dateFrom, filters?.dateTo]);

  return { visits, loading, error };
}

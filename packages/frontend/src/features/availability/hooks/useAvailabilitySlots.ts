import { useEffect, useState } from "react";
import type { AvailabilitySlot } from "@visitas-angelim/shared";
import { subscribeToAvailabilitySlots } from "../../../services/availability.service";

export interface UseAvailabilitySlotsReturn {
  slots: AvailabilitySlot[];
  loading: boolean;
  error: Error | null;
}

export function useAvailabilitySlots(unitId?: string): UseAvailabilitySlotsReturn {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAvailabilitySlots(
      unitId,
      (data) => {
        setSlots(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [unitId]);

  return { slots, loading, error };
}

import { useEffect, useState } from "react";
import type { AvailabilitySlot } from "@visitas-angelim/shared";
import { subscribeToAvailabilitySlots } from "../../../services/availability.service";

export interface UseAvailableSlotsReturn {
  slots: AvailabilitySlot[];
  loading: boolean;
  error: Error | null;
}

export function useAvailableSlots(
  unitId: string | undefined,
  startDate: Date,
  endDate: Date
): UseAvailableSlotsReturn {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!unitId) {
      setSlots([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAvailabilitySlots(
      unitId,
      (data) => {
        // Filter slots by date range and bookable status
        const filtered = data.filter((slot) => {
          const slotDate = new Date(slot.startTime as string);
          return (
            slot.isBookable &&
            slotDate >= startDate &&
            slotDate <= endDate
          );
        });

        setSlots(filtered);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  // Use timestamps as deps to avoid re-subscribing when Date objects are recreated
  }, [unitId, startDate.getTime(), endDate.getTime()]);

  return { slots, loading, error };
}

import { useEffect, useState } from "react";
import type { AvailabilitySlot } from "@visitas-angelim/shared";
import { subscribeToAvailabilitySlots } from "../../../services/availability.service";
import { getSlotBookingCount } from "../../../services/visits.service";

export interface SlotWithCapacity extends AvailabilitySlot {
  remainingCapacity: number;
}

export interface UseAvailableSlotsReturn {
  slots: SlotWithCapacity[];
  loading: boolean;
  error: Error | null;
}

export function useAvailableSlots(
  unitId: string | undefined,
  startDate: Date,
  endDate: Date
): UseAvailableSlotsReturn {
  const [slots, setSlots] = useState<SlotWithCapacity[]>([]);
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
      async (data) => {
        try {
          // Filter slots by date range and bookable status
          const filtered = data.filter((slot) => {
            const slotDate = new Date(slot.startTime as string);
            return (
              slot.isBookable &&
              slotDate >= startDate &&
              slotDate <= endDate
            );
          });

          // Get booking counts for each slot
          const slotsWithCapacity = await Promise.all(
            filtered.map(async (slot) => {
              const bookedCount = await getSlotBookingCount(slot.id);
              return {
                ...slot,
                remainingCapacity: slot.capacity - bookedCount,
              };
            })
          );

          // Filter out slots with no remaining capacity
          const available = slotsWithCapacity.filter(
            (slot) => slot.remainingCapacity > 0
          );

          setSlots(available);
          setLoading(false);
          setError(null);
        } catch (err) {
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [unitId, startDate, endDate]);

  return { slots, loading, error };
}

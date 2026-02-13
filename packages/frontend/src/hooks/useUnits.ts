import { useEffect, useState } from "react";
import type { Unit } from "@visitas-angelim/shared";
import { subscribeToUnits } from "../services/units.service";

export interface UseUnitsReturn {
  units: Unit[];
  loading: boolean;
  error: Error | null;
}

export function useUnits(): UseUnitsReturn {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToUnits(
      (data) => {
        setUnits(data);
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

  return { units, loading, error };
}

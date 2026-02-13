import { useEffect, useState, useMemo } from "react";
import type { Lead, LeadStatus } from "@visitas-angelim/shared";
import { LEAD_STATUSES } from "@visitas-angelim/shared";
import { subscribeToLeads } from "../../../services/leads.service";

export interface UseLeadsReturn {
  leads: Lead[];
  leadsByStatus: Record<LeadStatus, Lead[]>;
  loading: boolean;
  error: Error | null;
}

export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToLeads(
      (data) => {
        setLeads(data);
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

  const leadsByStatus = useMemo(() => {
    const grouped = {} as Record<LeadStatus, Lead[]>;
    for (const status of LEAD_STATUSES) {
      grouped[status] = [];
    }
    for (const lead of leads) {
      if (grouped[lead.status]) {
        grouped[lead.status].push(lead);
      }
    }
    return grouped;
  }, [leads]);

  return { leads, leadsByStatus, loading, error };
}

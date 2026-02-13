import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import type { Visit, Lead } from "@visitas-angelim/shared";

export interface DashboardMetrics {
  totalLeads: number;
  leadsByStatus: Record<string, number>;
  visitsThisMonth: number;
  visitsToday: number;
  pendingChats: number;
  conversionRate: number;
}

export interface UseDashboardReturn {
  metrics: DashboardMetrics;
  upcomingVisits: Visit[];
  recentLeads: Lead[];
  loading: boolean;
  error: Error | null;
}

export function useDashboard(): UseDashboardReturn {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLeads: 0,
    leadsByStatus: {},
    visitsThisMonth: 0,
    visitsToday: 0,
    pendingChats: 0,
    conversionRate: 0,
  });
  const [upcomingVisits, setUpcomingVisits] = useState<Visit[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Get all leads
        const leadsSnapshot = await getDocs(collection(db, "leads"));
        const leads = leadsSnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Lead[];

        // Calculate lead metrics
        const leadsByStatus: Record<string, number> = {};
        leads.forEach((lead) => {
          leadsByStatus[lead.status] = (leadsByStatus[lead.status] || 0) + 1;
        });

        const enrolledCount = leadsByStatus["enrolled"] || 0;
        const conversionRate = leads.length > 0 ? (enrolledCount / leads.length) * 100 : 0;

        // Get visits this month
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const visitsThisMonthQuery = query(
          collection(db, "visits"),
          where("visitDateTime", ">=", Timestamp.fromDate(monthStart))
        );
        const visitsThisMonthSnapshot = await getDocs(visitsThisMonthQuery);

        // Get visits today
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);

        const visitsTodayQuery = query(
          collection(db, "visits"),
          where("visitDateTime", ">=", Timestamp.fromDate(todayStart)),
          where("visitDateTime", "<", Timestamp.fromDate(tomorrowStart))
        );
        const visitsTodaySnapshot = await getDocs(visitsTodayQuery);

        // Get upcoming visits
        const upcomingVisitsQuery = query(
          collection(db, "visits"),
          where("visitDateTime", ">=", Timestamp.now()),
          orderBy("visitDateTime", "asc"),
          limit(5)
        );
        const upcomingVisitsSnapshot = await getDocs(upcomingVisitsQuery);
        const upcoming = upcomingVisitsSnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          visitDateTime: (d.data().visitDateTime as Timestamp).toDate().toISOString(),
          createdAt: (d.data().createdAt as Timestamp)?.toDate().toISOString(),
        })) as Visit[];

        // Get recent leads
        const recentLeadsQuery = query(
          collection(db, "leads"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const recentLeadsSnapshot = await getDocs(recentLeadsQuery);
        const recent = recentLeadsSnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: (d.data().createdAt as Timestamp)?.toDate().toISOString(),
          updatedAt: (d.data().updatedAt as Timestamp)?.toDate().toISOString(),
        })) as Lead[];

        setMetrics({
          totalLeads: leads.length,
          leadsByStatus,
          visitsThisMonth: visitsThisMonthSnapshot.size,
          visitsToday: visitsTodaySnapshot.size,
          pendingChats: 0, // TODO: Implement chat count
          conversionRate,
        });
        setUpcomingVisits(upcoming);
        setRecentLeads(recent);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return { metrics, upcomingVisits, recentLeads, loading, error };
}

import type { TimestampField } from "./common";

export const VISIT_STATUSES = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type VisitStatus = (typeof VISIT_STATUSES)[number];

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  scheduled: "Agendada",
  confirmed: "Confirmada",
  completed: "Realizada",
  cancelled: "Cancelada",
};

export interface Visit {
  id: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  childName?: string;
  childAge?: number;
  childGradeOfInterest?: string;
  unitId: string;
  slotId: string;
  visitDateTime: TimestampField;
  status: VisitStatus;
  notes?: string;
  createdAt: TimestampField;
}

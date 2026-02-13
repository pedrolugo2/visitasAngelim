import type { TimestampField } from "./common";

export const LEAD_STATUSES = [
  "new_lead",
  "contacted",
  "visit_scheduled",
  "enrolled",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new_lead: "Novo Lead",
  contacted: "Contactado",
  visit_scheduled: "Visita Agendada",
  enrolled: "Matriculado",
  lost: "Perdido",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new_lead: "#6BA3BE",
  contacted: "#E8C547",
  visit_scheduled: "#D4874D",
  enrolled: "#5B8C5A",
  lost: "#B0766C",
};

export const LEAD_SOURCES = [
  "website",
  "chat",
  "referral",
  "phone",
  "social_media",
  "other",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Site",
  chat: "Chat",
  referral: "Indicação",
  phone: "Telefone",
  social_media: "Redes Sociais",
  other: "Outro",
};

export interface Lead {
  id: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  childName?: string;
  childAge?: number;
  childGradeOfInterest?: string;
  source?: LeadSource;
  status: LeadStatus;
  lastContactDate?: TimestampField;
  nextFollowUpDate?: TimestampField;
  notes?: string;
  visitId?: string;
  createdAt: TimestampField;
  updatedAt: TimestampField;
}

/** Data required to create a new lead (id and timestamps are auto-generated) */
export type CreateLeadData = Omit<Lead, "id" | "createdAt" | "updatedAt">;

/** Data allowed when updating a lead */
export type UpdateLeadData = Partial<Omit<Lead, "id" | "createdAt" | "updatedAt">>;

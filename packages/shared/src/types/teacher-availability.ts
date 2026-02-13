import type { TimestampField } from "./common";

export type PreferredTime = "morning" | "afternoon";

export interface TeacherAvailability {
  id: string;
  teacherName: string;
  teacherEmail: string;
  unitId: string;
  availableDates: string[]; // ISO date strings
  preferredTimes: PreferredTime[];
  notes?: string;
  status: "pending" | "reviewed";
  createdAt: TimestampField;
}

export type CreateTeacherAvailabilityData = Omit<TeacherAvailability, "id" | "createdAt">;

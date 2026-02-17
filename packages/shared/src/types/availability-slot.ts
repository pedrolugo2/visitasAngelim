import type { TimestampField } from "./common";

export interface AvailabilitySlot {
  id: string;
  unitId: string;
  startTime: TimestampField;
  endTime: TimestampField;
  capacity: number;
  isBookable: boolean;
  tag?: string;
}

import type { TimestampField } from "./common";

export interface Admin {
  uid: string;
  email: string;
  name: string;
  createdAt: TimestampField;
}

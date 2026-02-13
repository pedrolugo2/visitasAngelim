/** Firestore Timestamp representation for shared types */
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

/** Generic type allowing either a Firestore Timestamp or a serialized string */
export type TimestampField = FirestoreTimestamp | Date | string;

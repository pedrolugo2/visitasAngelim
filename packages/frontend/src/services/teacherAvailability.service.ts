import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { TeacherAvailability, CreateTeacherAvailabilityData } from "@visitas-angelim/shared";

const COLLECTION = "teacher_availability";
const availabilityRef = collection(db, COLLECTION);

/** Convert a Firestore document to a TeacherAvailability object */
function docToAvailability(id: string, data: Record<string, unknown>): TeacherAvailability {
  return {
    id,
    teacherName: data.teacherName as string,
    teacherEmail: data.teacherEmail as string,
    unitId: data.unitId as string,
    availableDates: data.availableDates as string[],
    preferredTimes: data.preferredTimes as ("morning" | "afternoon")[],
    notes: data.notes as string | undefined,
    status: data.status as "pending" | "reviewed",
    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
  };
}

/** Subscribe to teacher availability submissions */
export function subscribeToTeacherAvailability(
  onData: (availability: TeacherAvailability[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(availabilityRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const availability = snapshot.docs.map((d) =>
        docToAvailability(d.id, d.data() as Record<string, unknown>)
      );
      onData(availability);
    },
    onError
  );
}

/** Create a new teacher availability submission */
export async function createTeacherAvailability(
  data: CreateTeacherAvailabilityData
): Promise<string> {
  const docRef = await addDoc(availabilityRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

/** Update teacher availability status */
export async function updateTeacherAvailabilityStatus(
  id: string,
  status: "pending" | "reviewed"
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { status });
}

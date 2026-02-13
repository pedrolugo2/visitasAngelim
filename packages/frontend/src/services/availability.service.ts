import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { AvailabilitySlot } from "@visitas-angelim/shared";

const COLLECTION = "availability_slots";
const slotsRef = collection(db, COLLECTION);

/** Convert a Firestore document to an AvailabilitySlot object */
function docToSlot(id: string, data: Record<string, unknown>): AvailabilitySlot {
  return {
    id,
    unitId: data.unitId as string,
    startTime: (data.startTime as Timestamp).toDate().toISOString(),
    endTime: (data.endTime as Timestamp).toDate().toISOString(),
    capacity: data.capacity as number,
    isBookable: data.isBookable as boolean,
  };
}

/** Subscribe to real-time updates of availability slots, optionally filtered by unitId */
export function subscribeToAvailabilitySlots(
  unitId: string | undefined,
  onData: (slots: AvailabilitySlot[]) => void,
  onError: (error: Error) => void
): () => void {
  let q;
  if (unitId) {
    q = query(
      slotsRef,
      where("unitId", "==", unitId),
      orderBy("startTime", "asc")
    );
  } else {
    q = query(slotsRef, orderBy("startTime", "asc"));
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const slots = snapshot.docs.map((d) =>
        docToSlot(d.id, d.data() as Record<string, unknown>)
      );
      onData(slots);
    },
    onError
  );
}

/** Create a new availability slot */
export async function createSlot(
  data: Omit<AvailabilitySlot, "id">
): Promise<string> {
  const docRef = await addDoc(slotsRef, {
    unitId: data.unitId,
    startTime: Timestamp.fromDate(new Date(data.startTime as string)),
    endTime: Timestamp.fromDate(new Date(data.endTime as string)),
    capacity: data.capacity,
    isBookable: data.isBookable,
  });
  return docRef.id;
}

/** Update an existing availability slot */
export async function updateSlot(
  id: string,
  data: Partial<Omit<AvailabilitySlot, "id">>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  const updateData: Record<string, unknown> = { ...data };

  if (data.startTime) {
    updateData.startTime = Timestamp.fromDate(new Date(data.startTime as string));
  }
  if (data.endTime) {
    updateData.endTime = Timestamp.fromDate(new Date(data.endTime as string));
  }

  await updateDoc(docRef, updateData);
}

/** Delete an availability slot */
export async function deleteSlot(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

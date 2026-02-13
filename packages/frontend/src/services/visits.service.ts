import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Visit, VisitStatus } from "@visitas-angelim/shared";

const COLLECTION = "visits";
const visitsRef = collection(db, COLLECTION);

/** Convert a Firestore document to a Visit object */
function docToVisit(id: string, data: Record<string, unknown>): Visit {
  return {
    id,
    parentName: data.parentName as string,
    parentEmail: data.parentEmail as string,
    parentPhone: data.parentPhone as string | undefined,
    childName: data.childName as string | undefined,
    childAge: data.childAge as number | undefined,
    childGradeOfInterest: data.childGradeOfInterest as string | undefined,
    unitId: data.unitId as string,
    slotId: data.slotId as string,
    visitDateTime: (data.visitDateTime as Timestamp).toDate().toISOString(),
    status: data.status as VisitStatus,
    notes: data.notes as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() ?? new Date().toISOString(),
  };
}

export interface VisitFilters {
  unitId?: string;
  status?: VisitStatus;
  dateFrom?: string;
  dateTo?: string;
}

/** Subscribe to real-time updates of visits with optional filters */
export function subscribeToVisits(
  filters: VisitFilters | undefined,
  onData: (visits: Visit[]) => void,
  onError: (error: Error) => void
): () => void {
  let q = query(visitsRef, orderBy("visitDateTime", "desc"));

  if (filters?.unitId) {
    q = query(q, where("unitId", "==", filters.unitId));
  }
  if (filters?.status) {
    q = query(q, where("status", "==", filters.status));
  }
  if (filters?.dateFrom) {
    q = query(
      q,
      where("visitDateTime", ">=", Timestamp.fromDate(new Date(filters.dateFrom)))
    );
  }
  if (filters?.dateTo) {
    q = query(
      q,
      where("visitDateTime", "<=", Timestamp.fromDate(new Date(filters.dateTo)))
    );
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const visits = snapshot.docs.map((d) =>
        docToVisit(d.id, d.data() as Record<string, unknown>)
      );
      onData(visits);
    },
    onError
  );
}

/** Create a new visit */
export async function createVisit(
  data: Omit<Visit, "id" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(visitsRef, {
    ...data,
    visitDateTime: Timestamp.fromDate(new Date(data.visitDateTime as string)),
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

/** Update an existing visit */
export async function updateVisit(
  id: string,
  data: Partial<Omit<Visit, "id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  const updateData: Record<string, unknown> = { ...data };

  if (data.visitDateTime) {
    updateData.visitDateTime = Timestamp.fromDate(new Date(data.visitDateTime as string));
  }

  await updateDoc(docRef, updateData);
}

/** Get count of visits for a specific slot (excluding cancelled) */
export async function getSlotBookingCount(slotId: string): Promise<number> {
  const q = query(
    visitsRef,
    where("slotId", "==", slotId),
    where("status", "!=", "cancelled")
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

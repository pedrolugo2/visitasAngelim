import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Lead, CreateLeadData, UpdateLeadData, LeadStatus } from "@visitas-angelim/shared";

const COLLECTION = "leads";
const leadsRef = collection(db, COLLECTION);

/** Convert a Firestore document to a Lead object */
function docToLead(id: string, data: Record<string, unknown>): Lead {
  return {
    id,
    parentName: data.parentName as string,
    parentEmail: data.parentEmail as string,
    parentPhone: data.parentPhone as string | undefined,
    childName: data.childName as string | undefined,
    childAge: data.childAge as number | undefined,
    childGradeOfInterest: data.childGradeOfInterest as string | undefined,
    source: data.source as Lead["source"],
    status: data.status as LeadStatus,
    lastContactDate: data.lastContactDate
      ? (data.lastContactDate as Timestamp).toDate().toISOString()
      : undefined,
    nextFollowUpDate: data.nextFollowUpDate
      ? (data.nextFollowUpDate as Timestamp).toDate().toISOString()
      : undefined,
    notes: data.notes as string | undefined,
    visitId: data.visitId as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() ?? new Date().toISOString(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() ?? new Date().toISOString(),
  };
}

/** Subscribe to real-time updates of all leads, ordered by updatedAt descending */
export function subscribeToLeads(
  onData: (leads: Lead[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(leadsRef, orderBy("updatedAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const leads = snapshot.docs.map((d) =>
        docToLead(d.id, d.data() as Record<string, unknown>)
      );
      onData(leads);
    },
    onError
  );
}

/** Create a new lead */
export async function createLead(data: CreateLeadData): Promise<string> {
  const docRef = await addDoc(leadsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Update an existing lead */
export async function updateLead(
  id: string,
  data: UpdateLeadData
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Update only the lead's status (used by drag-and-drop) */
export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a lead */
export async function deleteLead(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

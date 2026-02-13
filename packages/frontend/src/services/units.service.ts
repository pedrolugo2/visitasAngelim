import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Unit } from "@visitas-angelim/shared";

const COLLECTION = "units";
const unitsRef = collection(db, COLLECTION);

/** Convert a Firestore document to a Unit object */
function docToUnit(id: string, data: Record<string, unknown>): Unit {
  return {
    id,
    name: data.name as string,
    description: data.description as string | undefined,
  };
}

/** Subscribe to real-time updates of all units, ordered by name */
export function subscribeToUnits(
  onData: (units: Unit[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(unitsRef, orderBy("name", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const units = snapshot.docs.map((d) =>
        docToUnit(d.id, d.data() as Record<string, unknown>)
      );
      onData(units);
    },
    onError
  );
}

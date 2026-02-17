import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { Visit } from "@visitas-angelim/shared";
import { sendVisitConfirmation } from "./services/email.service";

const db = getFirestore();

interface BookVisitData {
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  childName?: string;
  childAge?: number;
  childGradeOfInterest?: string;
  unitId: string;
  slotId: string;
}

export const bookVisit = onCall({ cors: true }, async (request) => {
  const data = request.data as BookVisitData;

  // Validate required fields
  if (!data.parentName || !data.parentEmail || !data.unitId || !data.slotId) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }

  try {
    // Run in transaction to ensure capacity isn't exceeded
    const result = await db.runTransaction(async (transaction) => {
      // 1. Get and validate slot
      const slotRef = db.collection("availability_slots").doc(data.slotId);
      const slotDoc = await transaction.get(slotRef);

      if (!slotDoc.exists) {
        throw new HttpsError("not-found", "Slot not found");
      }

      const slotData = slotDoc.data()!;

      if (!slotData.isBookable) {
        throw new HttpsError("failed-precondition", "Slot is not bookable");
      }

      // 2. Count existing visits for this slot (excluding cancelled)
      const visitsSnapshot = await db
        .collection("visits")
        .where("slotId", "==", data.slotId)
        .where("status", "!=", "cancelled")
        .get();

      const bookedCount = visitsSnapshot.size;

      if (bookedCount >= slotData.capacity) {
        throw new HttpsError("resource-exhausted", "Slot is at full capacity");
      }

      // 3. Create visit
      const visitRef = db.collection("visits").doc();
      const visitData = {
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone || null,
        childName: data.childName || null,
        childAge: data.childAge || null,
        childGradeOfInterest: data.childGradeOfInterest || null,
        unitId: data.unitId,
        slotId: data.slotId,
        visitDateTime: slotData.startTime,
        status: "scheduled",
        notes: null,
        createdAt: FieldValue.serverTimestamp(),
      };

      transaction.set(visitRef, visitData);

      // 4. Check if lead exists with this email
      const leadsSnapshot = await db
        .collection("leads")
        .where("parentEmail", "==", data.parentEmail)
        .limit(1)
        .get();

      if (leadsSnapshot.empty) {
        // Create new lead
        const leadRef = db.collection("leads").doc();
        transaction.set(leadRef, {
          parentName: data.parentName,
          parentEmail: data.parentEmail,
          parentPhone: data.parentPhone || null,
          childName: data.childName || null,
          childAge: data.childAge || null,
          childGradeOfInterest: data.childGradeOfInterest || null,
          source: "website",
          status: "visit_scheduled",
          visitId: visitRef.id,
          notes: "Lead criado automaticamente via agendamento de visita",
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        // Update existing lead
        const leadDoc = leadsSnapshot.docs[0];
        transaction.update(leadDoc.ref, {
          status: "visit_scheduled",
          visitId: visitRef.id,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }

      return {
        visitId: visitRef.id,
        slotData,
      };
    });

    // 5. Send confirmation email (async, don't block response)
    const unitDoc = await db.collection("units").doc(data.unitId).get();
    const unitName = unitDoc.exists ? unitDoc.data()!.name : data.unitId;

    // Send email in background (don't await to avoid timeout)
    sendVisitConfirmation({
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      childName: data.childName,
      unitName,
      visitDateTime: result.slotData.startTime.toDate().toISOString(),
      slotStartTime: result.slotData.startTime.toDate().toISOString(),
      slotEndTime: result.slotData.endTime.toDate().toISOString(),
    }).catch((err) => {
      console.error("Failed to send confirmation email:", err);
    });

    return {
      success: true,
      visitId: result.visitId,
      message: "Visit booked successfully",
    };
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    console.error("Error booking visit:", error);
    throw new HttpsError("internal", "Failed to book visit");
  }
});

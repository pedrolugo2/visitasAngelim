import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { sendVisitReminder } from "../services/email.service";

const db = getFirestore();

// Run daily at 8am to send reminders for visits 24h away
export const sendVisitReminders = onSchedule("0 8 * * *", async () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

  try {
    // Get visits scheduled for tomorrow
    const visitsSnapshot = await db
      .collection("visits")
      .where("visitDateTime", ">=", Timestamp.fromDate(tomorrowStart))
      .where("visitDateTime", "<", Timestamp.fromDate(tomorrowEnd))
      .where("status", "in", ["scheduled", "confirmed"])
      .get();

    console.log(`Found ${visitsSnapshot.size} visits for tomorrow`);

    // Send reminder for each visit
    const promises = visitsSnapshot.docs.map(async (doc) => {
      const visit = doc.data();

      try {
        // Get slot details
        const slotDoc = await db.collection("availability_slots").doc(visit.slotId).get();
        if (!slotDoc.exists) {
          console.error(`Slot ${visit.slotId} not found for visit ${doc.id}`);
          return;
        }
        const slot = slotDoc.data()!;

        // Get unit name
        const unitDoc = await db.collection("units").doc(visit.unitId).get();
        const unitName = unitDoc.exists ? unitDoc.data()!.name : visit.unitId;

        await sendVisitReminder({
          parentName: visit.parentName,
          parentEmail: visit.parentEmail,
          childName: visit.childName,
          unitName,
          visitDateTime: visit.visitDateTime.toDate().toISOString(),
          slotStartTime: slot.startTime.toDate().toISOString(),
          slotEndTime: slot.endTime.toDate().toISOString(),
        });

        console.log(`Sent reminder to ${visit.parentEmail} for visit ${doc.id}`);
      } catch (error) {
        console.error(`Failed to send reminder for visit ${doc.id}:`, error);
      }
    });

    await Promise.all(promises);
    console.log("Visit reminders sent successfully");
  } catch (error) {
    console.error("Error sending visit reminders:", error);
    throw error;
  }
});

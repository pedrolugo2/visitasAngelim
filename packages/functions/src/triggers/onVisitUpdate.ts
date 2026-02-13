import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export const onVisitUpdate = onDocumentUpdated("visits/{visitId}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();

  if (!before || !after) return;

  // If visit was cancelled, remove visitId from linked lead
  if (before.status !== "cancelled" && after.status === "cancelled") {
    try {
      // Find lead with this visitId
      const leadsSnapshot = await db
        .collection("leads")
        .where("visitId", "==", event.params.visitId)
        .limit(1)
        .get();

      if (!leadsSnapshot.empty) {
        const leadDoc = leadsSnapshot.docs[0];
        await leadDoc.ref.update({
          visitId: null,
          status: "contacted", // Revert to contacted
          updatedAt: new Date(),
        });

        console.log(`Updated lead ${leadDoc.id} after visit cancellation`);
      }
    } catch (error) {
      console.error("Error updating lead after visit cancellation:", error);
    }
  }

  // If visit was completed, keep lead status (don't change)
  // Admin will manually update lead status to enrolled if needed
});

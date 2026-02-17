/**
 * Seed script for production Firestore.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json npx tsx scripts/seed-prod.ts
 *
 * This populates production Firestore with initial data:
 *   - 2 units (Jardim, Fundamental)
 *   - Chat FAQs
 *   - Admin user
 *
 * ⚠ Safe to re-run: uses .set() with fixed doc IDs for units and admin,
 *   and checks for existing FAQs before inserting.
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Validate credentials
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  console.error(
    "Error: GOOGLE_APPLICATION_CREDENTIALS env var is required.\n" +
      "Usage: GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json npx tsx scripts/seed-prod.ts"
  );
  process.exit(1);
}

// Safety prompt
const args = process.argv.slice(2);
if (!args.includes("--confirm")) {
  console.error(
    "⚠  This will write to PRODUCTION Firestore.\n" +
      "   Run with --confirm to proceed:\n\n" +
      "   GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json npx tsx scripts/seed-prod.ts --confirm\n"
  );
  process.exit(1);
}

const app = initializeApp({
  credential: cert(credentialsPath),
});
const db = getFirestore(app);
const auth = getAuth(app);

async function seed() {
  console.log("Seeding production Firestore...\n");

  // --- Admin User ---
  console.log("Creating admin user...");
  const adminEmail = "admin@escolaangelim.com.br";

  try {
    let adminUser;
    try {
      adminUser = await auth.getUserByEmail(adminEmail);
      console.log("  -> Admin user already exists, updating Firestore doc...");
    } catch {
      adminUser = await auth.createUser({
        email: adminEmail,
        password: "admin123",
        displayName: "Admin Angelim",
      });
      console.log("  -> Admin user created (change password after first login!)");
    }

    await db.collection("admins").doc(adminUser.uid).set({
      email: adminEmail,
      name: "Admin Angelim",
      createdAt: Timestamp.now(),
    });
    console.log(`  -> admins/${adminUser.uid}\n`);
  } catch (err) {
    console.error("  -> Failed to create admin:", err);
  }

  // --- Units ---
  console.log("Creating units...");
  const jardimRef = db.collection("units").doc("jardim");
  const fundamentalRef = db.collection("units").doc("fundamental");

  await jardimRef.set({
    name: "Jardim",
    description:
      "Educação infantil Waldorf para crianças de 2 a 6 anos, com foco no brincar livre, artes e contato com a natureza.",
  });

  await fundamentalRef.set({
    name: "Fundamental",
    description:
      "Ensino fundamental Waldorf do 1º ao 9º ano, integrando artes, ciências e vivências práticas.",
  });

  console.log("  -> Jardim, Fundamental\n");

  // --- Chat FAQs ---
  console.log("Creating chat FAQs...");

  // Check if FAQs already exist to avoid duplicates
  const existingFaqs = await db.collection("chat_faqs").limit(1).get();
  if (!existingFaqs.empty) {
    console.log("  -> FAQs already exist, skipping...\n");
  } else {
    const faqs = [
      {
        question: "Qual o horário de funcionamento da escola?",
        answer:
          "A escola funciona das 7h30 às 13h para o Jardim e das 7h30 às 15h30 para o Fundamental.",
        keywords: ["horário", "funcionamento", "hora"],
      },
      {
        question: "Como faço para agendar uma visita?",
        answer:
          "Você pode agendar uma visita diretamente pelo nosso portal, escolhendo a unidade e o horário disponível.",
        keywords: ["visita", "agendar", "conhecer"],
      },
      {
        question: "Qual a faixa etária para o Jardim?",
        answer:
          "O Jardim atende crianças de 2 a 6 anos de idade.",
        keywords: ["idade", "jardim", "faixa etária", "criança"],
      },
      {
        question: "A escola segue a pedagogia Waldorf?",
        answer:
          "Sim! Somos uma escola Waldorf certificada, seguindo os princípios pedagógicos fundados por Rudolf Steiner.",
        keywords: ["waldorf", "pedagogia", "steiner", "método"],
      },
      {
        question: "Quais são os valores da mensalidade?",
        answer:
          "Os valores variam conforme a unidade e série. Entre em contato conosco para informações detalhadas sobre mensalidades e bolsas.",
        keywords: ["mensalidade", "valor", "preço", "custo", "bolsa"],
      },
    ];

    for (const faq of faqs) {
      await db.collection("chat_faqs").add(faq);
    }
    console.log(`  -> ${faqs.length} FAQs created\n`);
  }

  console.log("Production seed completed successfully!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

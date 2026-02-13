/**
 * Seed script for Firestore emulator.
 *
 * Usage:
 *   1. Start emulators: firebase emulators:start
 *   2. Run seed:        npx tsx scripts/seed.ts
 *
 * This populates the Firestore emulator with initial data:
 *   - 2 units (Jardim, Fundamental)
 *   - Sample chat FAQs
 *   - Sample leads across all funnel stages
 */

import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Point to emulator
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

const app = initializeApp({ projectId: "visitas-angelim" });
const db = getFirestore(app);
const auth = getAuth(app);

async function seed() {
  console.log("Seeding Firestore emulator...\n");

  // --- Admin User ---
  console.log("Creating admin user...");
  try {
    const adminUser = await auth.createUser({
      email: "admin@escolaangelim.com.br",
      password: "admin123",
      displayName: "Admin Teste",
    });

    await db.collection("admins").doc(adminUser.uid).set({
      email: "admin@escolaangelim.com.br",
      name: "Admin Teste",
      createdAt: Timestamp.now(),
    });

    console.log("  -> admin@escolaangelim.com.br / admin123\n");
  } catch (err) {
    console.log("  -> Admin user already exists, skipping...\n");
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
  console.log(`  -> ${faqs.length} FAQs\n`);

  // --- Sample Leads ---
  console.log("Creating sample leads...");
  const now = Timestamp.now();

  const leads = [
    {
      parentName: "Maria Silva",
      parentEmail: "maria.silva@email.com",
      parentPhone: "(11) 99876-5432",
      childName: "Pedro Silva",
      childAge: 4,
      childGradeOfInterest: "jardim",
      source: "website",
      status: "new_lead",
      notes: "Encontrou a escola pelo Google. Interessada no Jardim.",
      createdAt: now,
      updatedAt: now,
    },
    {
      parentName: "João Santos",
      parentEmail: "joao.santos@email.com",
      parentPhone: "(11) 98765-4321",
      childName: "Ana Santos",
      childAge: 3,
      childGradeOfInterest: "jardim",
      source: "referral",
      status: "new_lead",
      notes: "Indicação da família Oliveira.",
      createdAt: now,
      updatedAt: now,
    },
    {
      parentName: "Fernanda Costa",
      parentEmail: "fernanda.costa@email.com",
      parentPhone: "(11) 91234-5678",
      childName: "Lucas Costa",
      childAge: 6,
      childGradeOfInterest: "1ano",
      source: "social_media",
      status: "contacted",
      lastContactDate: now,
      notes: "Respondeu ao contato por e-mail. Quer saber mais sobre o 1º ano.",
      createdAt: now,
      updatedAt: now,
    },
    {
      parentName: "Roberto Lima",
      parentEmail: "roberto.lima@email.com",
      parentPhone: "(11) 94567-8901",
      childName: "Beatriz Lima",
      childAge: 5,
      childGradeOfInterest: "jardim",
      source: "phone",
      status: "contacted",
      lastContactDate: now,
      notes: "Ligou pedindo informações. Enviado material por e-mail.",
      createdAt: now,
      updatedAt: now,
    },
    {
      parentName: "Carla Mendes",
      parentEmail: "carla.mendes@email.com",
      parentPhone: "(11) 93456-7890",
      childName: "Gabriel Mendes",
      childAge: 7,
      childGradeOfInterest: "2ano",
      source: "website",
      status: "visit_scheduled",
      notes: "Visita agendada para a próxima semana. Interesse no Fundamental.",
      createdAt: now,
      updatedAt: now,
    },
    {
      parentName: "Patrícia Oliveira",
      parentEmail: "patricia.oliveira@email.com",
      parentPhone: "(11) 92345-6789",
      childName: "Sofia Oliveira",
      childAge: 4,
      childGradeOfInterest: "jardim",
      source: "referral",
      status: "enrolled",
      notes: "Matrícula confirmada para o Jardim. Início em março.",
      createdAt: now,
      updatedAt: now,
    },
    {
      parentName: "André Ferreira",
      parentEmail: "andre.ferreira@email.com",
      childName: "Matheus Ferreira",
      childAge: 8,
      childGradeOfInterest: "3ano",
      source: "website",
      status: "lost",
      notes: "Optou por outra escola mais perto de casa.",
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const lead of leads) {
    await db.collection("leads").add(lead);
  }
  console.log(`  -> ${leads.length} leads\n`);

  console.log("Seed completed successfully!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

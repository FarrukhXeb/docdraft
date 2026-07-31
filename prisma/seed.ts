/**
 * Seed a demo user with a starter answer library and one example proposal.
 *
 * Uses better-auth's sign-up API so the password is hashed exactly like a real
 * registration (no bespoke hashing here). Safe to run repeatedly: it upserts.
 *
 * Demo credentials: demo@docdraft.local / demopassword123
 */
import "./load-env";
import { PrismaClient } from "@prisma/client";
import { auth } from "../src/lib/auth";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@docdraft.local";
const DEMO_PASSWORD = "demopassword123";

const LIBRARY: { topic: string; content: string; tags?: string }[] = [
  {
    topic: "Data security practices",
    content:
      "Acme Corp maintains a defense-in-depth security program. All data is encrypted in transit (TLS 1.2+) and at rest (AES-256). We enforce least-privilege access, MFA for all staff, and quarterly access reviews. We follow a documented incident-response plan with defined SLAs and conduct annual third-party penetration testing.",
    tags: "security, compliance",
  },
  {
    topic: "Past performance",
    content:
      "Acme Corp has delivered 40+ engagements of similar scope over the past five years, including multi-year contracts with municipal and state agencies. Representative outcomes include on-time delivery on 95% of milestones and measurable cost savings for clients through process automation.",
    tags: "past performance, references",
  },
  {
    topic: "Company profile",
    content:
      "Acme Corp is a 120-person professional services firm founded in 2011, headquartered in Denver, CO. We specialize in IT modernization, data engineering, and secure cloud migration for the public sector.",
    tags: "company, profile",
  },
  {
    topic: "Implementation timeline and methodology",
    content:
      "We use an agile, phased delivery model: (1) Discovery and requirements, (2) iterative build in two-week sprints with client demos, (3) UAT and hardening, (4) go-live and hypercare. A typical mid-size engagement reaches production within 12-16 weeks.",
    tags: "delivery, timeline, methodology",
  },
];

async function main() {
  // Create the demo user via better-auth if it does not already exist.
  let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (!user) {
    await auth.api.signUpEmail({
      body: { name: "Demo User", email: DEMO_EMAIL, password: DEMO_PASSWORD },
    });
    user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  }
  if (!user) throw new Error("Failed to create demo user");

  // Reset and reseed this demo user's library.
  await prisma.answerEntry.deleteMany({ where: { userId: user.id } });
  await prisma.answerEntry.createMany({
    data: LIBRARY.map((e) => ({ ...e, userId: user!.id })),
  });

  // Seed one example proposal if none exists.
  const existing = await prisma.proposal.findFirst({
    where: { userId: user.id },
  });
  if (!existing) {
    await prisma.proposal.create({
      data: {
        userId: user.id,
        title: "Example: City IT Services RFP",
        companyName: "Acme Corp",
        companyInfo:
          "Acme Corp is a 120-person public-sector IT modernization firm based in Denver, CO.",
        requirements: {
          create: [
            { orderIndex: 0, prompt: "Describe your data security practices." },
            { orderIndex: 1, prompt: "Summarize relevant past performance." },
            { orderIndex: 2, prompt: "What is your implementation timeline?" },
          ],
        },
      },
    });
  }

  console.log(`Seeded demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`  ${LIBRARY.length} answer-library entries`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

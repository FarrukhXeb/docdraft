import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { StatusBadge } from "@/components/ui/status-badge";
import { getSession } from "@/lib/session";
import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: "DocDraft | First drafts for small GovCon proposal teams",
  description:
    "Turn solicitation requirements and approved reusable answers into a structured proposal first draft to review and export.",
};

const workflow = [
  {
    number: "01",
    icon: "file-text",
    title: "Bring in the requirements",
    body: "Paste solicitation questions or requirements to create a working response list.",
  },
  {
    number: "02",
    icon: "library-big",
    title: "Add approved answers",
    body: "Build a reusable library from public or sanitized company language your team already trusts.",
  },
  {
    number: "03",
    icon: "sparkles",
    title: "Generate first drafts",
    body: "Draft each response from the requirement, relevant library entries, and your company context.",
  },
  {
    number: "04",
    icon: "pencil",
    title: "Review requirement by requirement",
    body: "Edit responses, regenerate weak sections, and flag anything that needs another look.",
  },
  {
    number: "05",
    icon: "download",
    title: "Export to Word",
    body: "Download the reviewed response set as a .docx for the next stage of your proposal process.",
  },
];

const benefits = [
  {
    icon: "book-open",
    title: "Reuse the language you already approved",
    body: "Keep past performance, company capabilities, and standard answers in one working library instead of searching old files for every response.",
  },
  {
    icon: "layout-dashboard",
    title: "See the draft as a requirement list",
    body: "Work through the solicitation in a structured view with visible draft, edit, and unsure states—not an open-ended chat.",
  },
  {
    icon: "flag",
    title: "Keep review judgment with your team",
    body: "DocDraft handles repetitive first-draft work. Your proposal lead decides what is accurate, responsive, and ready to use.",
  },
];

function ActionLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "outline";
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`dd-btn dd-focus ${
        variant === "primary" ? "dd-btn-primary" : "dd-btn-outline"
      } ${styles.actionLink} ${
        variant === "primary" ? styles.actionPrimary : styles.actionOutline
      }`}
    >
      {children}
      <Icon name={href.startsWith("#") ? "chevron-down" : "chevron-right"} size={15} />
    </Link>
  );
}

function PublicHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={`dd-focus ${styles.logoLink}`} aria-label="DocDraft home">
          <Logo />
        </Link>
        <nav className={styles.sectionNav} aria-label="Landing page">
          <a className={`dd-focus ${styles.navLink}`} href="#workflow">
            Workflow
          </a>
          <a className={`dd-focus ${styles.navLink}`} href="#why-docdraft">
            Why DocDraft
          </a>
          <a className={`dd-focus ${styles.navLink}`} href="#pilot">
            Founding pilot
          </a>
        </nav>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <Link className={`dd-focus ${styles.loginLink}`} href="/login">
            Log in
          </Link>
          <Link
            className={`dd-btn dd-focus dd-btn-primary ${styles.headerCta}`}
            href="/register"
          >
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProductPreview() {
  return (
    <figure className={styles.previewFigure} aria-labelledby="preview-caption">
      <div className={styles.previewFrame}>
        <div className={styles.previewTopbar}>
          <div>
            <span className={styles.previewEyebrow}>Proposal workspace</span>
            <strong>City IT services RFP</strong>
          </div>
          <div className={styles.previewProgress}>
            <span>4/6 drafted</span>
            <div className={styles.progressTrack} aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
        <div className={styles.previewBody}>
          <div className={styles.requirementList} aria-label="Example requirements">
            <span className={styles.listLabel}>Requirements</span>
            <div className={`${styles.requirementRow} ${styles.requirementActive}`}>
              <span className={styles.requirementNumber}>01</span>
              <span>Implementation approach</span>
              <StatusBadge status="drafted" showIcon={false} />
            </div>
            <div className={styles.requirementRow}>
              <span className={styles.requirementNumber}>02</span>
              <span>Relevant past performance</span>
              <StatusBadge status="edited" showIcon={false} />
            </div>
            <div className={styles.requirementRow}>
              <span className={styles.requirementNumber}>03</span>
              <span>Data handling practices</span>
              <StatusBadge status="unsure" showIcon={false} />
            </div>
          </div>
          <div className={styles.draftPane}>
            <div className={styles.draftHeader}>
              <div>
                <span className={styles.listLabel}>Requirement 01</span>
                <p className={styles.draftTitle}>Describe your implementation approach.</p>
              </div>
              <StatusBadge status="drafted" />
            </div>
            <div className={styles.sourceNote}>
              <Icon name="library-big" size={14} />
              <span>Using 2 approved Answer Library entries</span>
            </div>
            <div className={styles.draftText}>
              <span className={styles.textLineLong} />
              <span />
              <span className={styles.textLineMedium} />
              <span className={styles.textLineLong} />
              <span className={styles.textLineShort} />
            </div>
            <div className={styles.previewButtons} aria-hidden="true">
              <span className={styles.previewPrimaryButton}>
                <Icon name="check" size={13} /> Save edit
              </span>
              <span className={styles.previewGhostButton}>
                <Icon name="flag" size={13} /> Mark unsure
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption id="preview-caption" className={styles.previewCaption}>
        Illustrative product view built from the current DocDraft workspace.
      </figcaption>
    </figure>
  );
}

export default async function Home() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <PublicHeader />

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <Badge tone="brand">For small GovCon proposal teams</Badge>
            <h1 id="hero-title">Move from blank page to a structured first draft.</h1>
            <p className={styles.heroLead}>
              Bring solicitation requirements and your firm&apos;s approved reusable answers into
              one reviewable workspace. DocDraft creates a first draft your team can edit and
              export.
            </p>
            <div className={styles.heroActions}>
              <ActionLink href="/register">Create an account</ActionLink>
              <ActionLink href="#workflow" variant="outline">
                See the workflow
              </ActionLink>
            </div>
            <p className={styles.heroNote}>
              <Icon name="info" size={14} /> The founding pilot accepts public or sanitized
              material only.
            </p>
          </div>
          <ProductPreview />
        </section>

        <section className={styles.audienceStrip} aria-label="Who DocDraft is for">
          <p>Built for proposal teams without a large proposal department.</p>
          <ul>
            <li>Founders</li>
            <li>Business-development leads</li>
            <li>Proposal managers</li>
          </ul>
        </section>

        <section id="workflow" className={styles.section} aria-labelledby="workflow-title">
          <div className={styles.sectionIntro}>
            <span className={styles.kicker}>One working path</span>
            <h2 id="workflow-title">From solicitation to reviewable response set</h2>
            <p>
              Keep the source requirements, reusable language, drafts, and review status
              connected as the proposal takes shape.
            </p>
          </div>
          <ol className={styles.workflowGrid}>
            {workflow.map((step) => (
              <li key={step.number} className={styles.workflowStep}>
                <div className={styles.stepTopline}>
                  <span className={styles.stepIcon}>
                    <Icon name={step.icon} size={17} />
                  </span>
                  <span className={styles.stepNumber}>{step.number}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="why-docdraft" className={styles.section} aria-labelledby="benefits-title">
          <div className={styles.sectionIntro}>
            <span className={styles.kicker}>Less first-draft friction</span>
            <h2 id="benefits-title">A proposal workspace, not a generic writing prompt</h2>
            <p>
              DocDraft is organized around the way a small team responds: approved source
              language, individual requirements, visible review states, and a practical export.
            </p>
          </div>
          <div className={styles.benefitGrid}>
            {benefits.map((benefit) => (
              <Card key={benefit.title} className={styles.benefitCard}>
                <span className={styles.benefitIcon}>
                  <Icon name={benefit.icon} size={18} />
                </span>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className={styles.boundarySection} aria-labelledby="boundary-title">
          <div className={styles.boundaryHeading}>
            <span className={styles.kicker}>Clear working boundary</span>
            <h2 id="boundary-title">Your team remains the proposal authority.</h2>
          </div>
          <div className={styles.boundaryColumns}>
            <div>
              <h3>
                <Icon name="sparkles" size={17} /> DocDraft helps prepare
              </h3>
              <ul className={styles.checkList}>
                <li>
                  <Icon name="check" size={15} /> A requirement-by-requirement first draft
                </li>
                <li>
                  <Icon name="check" size={15} /> Reuse of approved answer-library content
                </li>
                <li>
                  <Icon name="check" size={15} /> A visible place to edit and flag responses
                </li>
              </ul>
            </div>
            <div>
              <h3>
                <Icon name="user" size={17} /> Your team decides
              </h3>
              <ul className={styles.checkList}>
                <li>
                  <Icon name="check" size={15} /> Whether every response is accurate
                </li>
                <li>
                  <Icon name="check" size={15} /> Whether requirements are fully addressed
                </li>
                <li>
                  <Icon name="check" size={15} /> What is ready for the final submission
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="pilot" className={styles.pilotSection} aria-labelledby="pilot-title">
          <div className={styles.pilotCopy}>
            <span className={styles.kicker}>Founding pilot</span>
            <h2 id="pilot-title">Use DocDraft on one live proposal.</h2>
            <p>
              A focused pilot for small GovCon teams that want to test the workflow on current,
              appropriate material with founder support.
            </p>
            <div className={styles.pilotSafety}>
              <Icon name="info" size={17} />
              <p>
                Use public or sanitized material only. Do not submit CUI, classified, regulated,
                or otherwise sensitive customer material. No security certification is claimed
                for the current pilot.
              </p>
            </div>
          </div>
          <Card className={styles.pilotCard}>
            <div className={styles.priceBlock}>
              <span>Founding-pilot price</span>
              <strong>$750</strong>
              <p>One live proposal</p>
            </div>
            <ul className={styles.pilotList}>
              <li>
                <Icon name="check" size={15} /> 14-day pilot
              </li>
              <li>
                <Icon name="check" size={15} /> Founder-assisted setup and workflow
              </li>
              <li>
                <Icon name="check" size={15} /> Answer Library, drafting, review, and export
              </li>
              <li>
                <Icon name="check" size={15} /> Public or sanitized material only
              </li>
            </ul>
            <ActionLink href="/register">Create an account</ActionLink>
            <p className={styles.cardFinePrint}>Registration is the first step into DocDraft.</p>
          </Card>
        </section>

        <section className={styles.finalCta} aria-labelledby="final-cta-title">
          <div>
            <span className={styles.kicker}>Bring the next draft into focus</span>
            <h2 id="final-cta-title">Start with the requirements and language you already have.</h2>
          </div>
          <div className={styles.finalActions}>
            <ActionLink href="/register">Create an account</ActionLink>
            <Link className={`dd-focus ${styles.textLink}`} href="/login">
              Already registered? Log in
              <Icon name="chevron-right" size={14} />
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <Logo />
            <p>Structured first drafts for small proposal teams.</p>
          </div>
          <nav aria-label="Product">
            <span>Product</span>
            <a href="#workflow">Workflow</a>
            <a href="#why-docdraft">Why DocDraft</a>
            <a href="#pilot">Founding pilot</a>
          </nav>
          <nav aria-label="Account">
            <span>Account</span>
            <Link href="/register">Register</Link>
            <Link href="/login">Log in</Link>
          </nav>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} DocDraft</span>
          <span>Public or sanitized pilot material only.</span>
        </div>
      </footer>
    </div>
  );
}

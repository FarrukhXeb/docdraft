import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

export interface ExportRequirement {
  orderIndex: number;
  prompt: string;
  draft: string;
  status: string;
}

export interface ExportProposal {
  title: string;
  companyName?: string | null;
  requirements: ExportRequirement[];
}

/**
 * Render a proposal's Q&A into a .docx buffer using the `docx` library.
 * Each requirement becomes a numbered heading followed by its drafted answer.
 */
export async function buildProposalDocx(
  proposal: ExportProposal
): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({
      text: proposal.title,
      heading: HeadingLevel.TITLE,
    }),
  ];

  if (proposal.companyName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Prepared by: ", bold: true }),
          new TextRun(proposal.companyName),
        ],
      })
    );
  }

  children.push(new Paragraph({ text: "" }));

  proposal.requirements
    .slice()
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach((r, i) => {
      children.push(
        new Paragraph({
          text: `${i + 1}. ${r.prompt}`,
          heading: HeadingLevel.HEADING_2,
        })
      );

      const answer =
        r.draft.trim().length > 0
          ? r.draft.trim()
          : "[No response drafted yet.]";

      // Preserve paragraph breaks from the drafted answer.
      answer.split(/\n\s*\n/).forEach((para) => {
        children.push(
          new Paragraph({
            children: [new TextRun(para.replace(/\n/g, " ").trim())],
          })
        );
      });

      children.push(new Paragraph({ text: "" }));
    });

  const doc = new Document({
    creator: "DocDraft",
    title: proposal.title,
    sections: [{ children }],
  });

  return Packer.toBuffer(doc);
}

/** Filesystem-safe slug for the download filename. */
export function docxFilename(title: string): string {
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "proposal";
  return `${slug}.docx`;
}

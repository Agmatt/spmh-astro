# SPMH Media Center — Public Documents

This folder holds every downloadable PDF referenced by the Media Center.

## Where they surface

| File | Referenced by |
|---|---|
| `strategic-plan-2026-2030.pdf` | `/strategic-plan/`, `/news-and-media/publications/` |
| `strategic-plan-summary.pdf` | `/strategic-plan/`, `/news-and-media/publications/` |
| `annual-report-2025.pdf` | `/news-and-media/publications/` |
| `annual-report-2024.pdf` | `/news-and-media/publications/` |
| `meal-2026-q1.pdf` | `/news-and-media/publications/` |
| `meal-2025-annual.pdf` | `/news-and-media/publications/` |
| `financial-summary-2025.pdf` | `/news-and-media/publications/` |
| `service-charter.pdf` | `/news-and-media/publications/`, `/news-and-media/governance/` |
| `patient-rights.pdf` | `/news-and-media/publications/`, `/news-and-media/governance/` |
| `editorial-policy.pdf` | `/news-and-media/publications/`, `/news-and-media/governance/` |
| `safeguarding.pdf` | `/news-and-media/publications/`, `/news-and-media/governance/` |
| `privacy-policy.pdf` | `/news-and-media/publications/`, `/news-and-media/governance/` |

## How to publish a document

1. **Export to PDF.** From Word, Google Docs, Canva, or any tool.
2. **Rename the file** to exactly match the filename in the table above.
   - Lowercase letters, numbers, and hyphens only. No spaces, no underscores.
   - Wrong: `Strategic Plan Final v3.pdf`
   - Right: `strategic-plan-2026-2030.pdf`
3. **Drop it in this folder.** Any subfolder will not work — the site looks here, not deeper.
4. **Update `src/lib/documents.ts`** — flip `pending: true` to `pending: false` for that entry, and set the real `size` (e.g. `'4.2 MB'`).
5. **Commit and deploy.** The download link activates automatically.

## Why the pending flag exists

Every document in `documents.ts` starts with `pending: true`. Until you flip it:

- The card shows "Coming soon" instead of "Download"
- Clicking it lands on a friendly notice page, not a 404
- Nothing breaks if a file is missing

Once you set `pending: false`, the card shows the real size and the link goes straight to the PDF.

## Folder hygiene

- **Do not** put working drafts, source `.docx`, or `.indd` files here — they are world-readable.
- **Do not** use this folder for images. Those go in Supabase Storage under `content-images/`.
- **Do not** rename a file once published. If you must, add the new file, update `documents.ts`, and delete the old file in the same commit.

## File size guidance

- Keep each PDF under **10 MB**. Anything larger is slow to download on mobile networks.
- For scans, use a compression tool (Smallpdf, iLovePDF) before dropping in.
- Use **PDF/A** if the document is a legal record (service charter, patient rights).

## Versioning

When you publish a revised document (e.g. a new annual report):

- **Annual reports, MEAL reports, financials:** add a new file with the year in the name — never overwrite the old one. Historical reports should remain downloadable.
- **Policies (editorial, safeguarding, privacy):** overwrite the existing file. Add a "Last updated" date on the front page of the PDF itself.
- **Service charter and patient rights:** overwrite. These should always reflect current practice.

## Naming conventions for future documents

If you add a new document type, follow this pattern:

// Central manifest of downloadable documents for the Media Center.
// Update here and every page that references it stays in sync.

export type DocumentItem = {
  title: string;
  description: string;
  category: 'strategic' | 'annual' | 'meal' | 'financial' | 'governance';
  file: string;
  pending?: boolean;
  size?: string;
  updated: string;
  featured?: boolean;
};

export const DOCUMENTS: DocumentItem[] = [
  {
    title: 'Strategic Plan 2026–2030',
    description:
      "St. Paul's Mission Hospital's full five-year transformation plan — six pillars, phased implementation, and the pathway to Level 5 readiness.",
    category: 'strategic',
    file: '/documents/strategic-plan-2026-2030.pdf',
    pending: true,
    updated: '2026-01-15',
    featured: true,
  },
  {
    title: 'Executive Summary — Strategic Plan 2026–2030',
    description:
      'A two-page overview of the Plan — vision, mission, six pillars, and phased roadmap.',
    category: 'strategic',
    file: '/documents/strategic-plan-summary.pdf',
    pending: true,
    updated: '2026-01-15',
  },
  {
    title: 'Annual Report 2025',
    description:
      'Clinical performance, service utilization, financial highlights, and institutional milestones for the 2025 calendar year.',
    category: 'annual',
    file: '/documents/annual-report-2025.pdf',
    pending: true,
    updated: '2026-03-01',
  },
  {
    title: 'Annual Report 2024',
    description:
      'Prior-year institutional performance and service delivery summary.',
    category: 'annual',
    file: '/documents/annual-report-2024.pdf',
    pending: true,
    updated: '2025-03-01',
  },
  {
    title: 'MEAL Report — Q1 2026',
    description:
      'Quarterly Monitoring, Evaluation, Accountability and Learning report against Strategic Plan milestone indicators.',
    category: 'meal',
    file: '/documents/meal-2026-q1.pdf',
    pending: true,
    updated: '2026-04-15',
  },
  {
    title: 'MEAL Report — 2025 Annual',
    description:
      'Consolidated annual MEAL report covering all six strategic pillars.',
    category: 'meal',
    file: '/documents/meal-2025-annual.pdf',
    pending: true,
    updated: '2026-02-15',
  },
  {
    title: 'Financial Summary 2025',
    description:
      'Consolidated revenue, expenditure, claims performance, and cash-flow summary for the 2025 financial year.',
    category: 'financial',
    file: '/documents/financial-summary-2025.pdf',
    pending: true,
    updated: '2026-03-01',
  },
  {
    title: 'Service Charter',
    description:
      "The hospital's commitments to patients and visitors — service standards, response times, and complaint resolution.",
    category: 'governance',
    file: '/documents/service-charter.pdf',
    pending: true,
    updated: '2026-01-15',
  },
  {
    title: 'Patient Rights Charter',
    description:
      'Rights, responsibilities, and dignity standards for all patients receiving care at SPMH.',
    category: 'governance',
    file: '/documents/patient-rights.pdf',
    pending: true,
    updated: '2026-01-15',
  },
  {
    title: 'Editorial Policy',
    description:
      'Standards guiding the publication of news, blog, press, and event content on the SPMH Media Center.',
    category: 'governance',
    file: '/documents/editorial-policy.pdf',
    pending: true,
    updated: '2026-01-15',
  },
  {
    title: 'Safeguarding Policy',
    description:
      'Child protection, vulnerable adult safeguarding, and reporting procedures.',
    category: 'governance',
    file: '/documents/safeguarding.pdf',
    pending: true,
    updated: '2026-01-15',
  },
  {
    title: 'Privacy & Data Protection',
    description:
      'How SPMH collects, stores, and protects personal and health information.',
    category: 'governance',
    file: '/documents/privacy-policy.pdf',
    pending: true,
    updated: '2026-01-15',
  },
];

export const CATEGORY_LABELS: Record<DocumentItem['category'], string> = {
  strategic:  'Strategic Plan',
  annual:     'Annual Reports',
  meal:       'MEAL Reports',
  financial:  'Financial Summaries',
  governance: 'Governance & Policies',
};

export function getDocHref(doc: DocumentItem): string {
  if (doc.pending) {
    return `/news-and-media/documents-pending/?doc=${encodeURIComponent(doc.title)}`;
  }
  return doc.file;
}

export function isDownloadable(doc: DocumentItem): boolean {
  return !doc.pending;
}

export function getDocSize(doc: DocumentItem): string {
  if (doc.pending) return 'Coming soon';
  return doc.size ?? 'PDF';
}
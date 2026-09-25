// Institutional facts and key statistics for the Media Center Press Kit.
// Figures drawn from SPMH Strategic Plan 2026–2030 baseline assessment.

export const INSTITUTION = {
  name: "St. Paul's Mission Hospital",
  shortName: 'SPMH',
  descriptor: 'A Faith-Based Level IV Mission Hospital under the Catholic Diocese of Homa Bay',
  tagline: 'Healing Hands, Caring Hearts',
  founded: 'Serving Western Kenya since inception',
  location: 'Homa Bay, Homa Bay County, Kenya',
  postal: 'P.O. Box 426 – Homa Bay',
  website: 'https://www.spmh.co.ke',
  level: 'Level IV',
  ownership: 'Catholic Diocese of Homa Bay',
};

export const KEY_STATS: { label: string; value: string; context: string }[] = [
  {
    label: 'Catchment population',
    value: '200,000 – 350,000',
    context: 'Homa Bay Town and surrounding peri-urban and rural areas',
  },
  {
    label: 'Inpatient admissions (2025)',
    value: '3,699',
    context: 'Up from 2,549 in 2023',
  },
  {
    label: 'Average bed occupancy (2025)',
    value: '71%',
    context: 'Approaching capacity — expansion priority',
  },
  {
    label: 'Surgical procedures (2025)',
    value: '420',
    context: 'Minor and major combined',
  },
  {
    label: 'Maternity deliveries (2025)',
    value: '604',
    context: 'Skilled delivery with emergency obstetric support',
  },
  {
    label: 'Pharmacy dispensing episodes (2025)',
    value: '32,993',
    context: 'Outpatient and inpatient combined',
  },
  {
    label: 'OPD attendance (2025)',
    value: '16,672',
    context: 'General outpatient and chronic disease clinics',
  },
  {
    label: 'Surgical site infection rate',
    value: '<1%',
    context: 'Against a national benchmark of <3%',
  },
  {
    label: 'Hand hygiene compliance',
    value: '95%',
    context: 'Against a WHO target of >90%',
  },
  {
    label: 'Staff turnover rate',
    value: '6%',
    context: 'Below the 10% national threshold',
  },
];

export const PILLAR_SUMMARY = [
  { key: 'clinical',       label: 'Clinical Services',        summary: 'Maternal, newborn, child and adolescent health; emergency, surgical, medical and inpatient care.' },
  { key: 'workforce',      label: 'Health Workforce',          summary: 'Workforce planning, continuous professional development, clinical leadership, retention and wellbeing.' },
  { key: 'infrastructure', label: 'Infrastructure & Digital',  summary: 'Facility modernization, medical technology, digital health, and green hospital systems.' },
  { key: 'financing',      label: 'Health Financing',          summary: 'Financial management, revenue cycle, resource mobilization, and strategic investment.' },
  { key: 'community',      label: 'Community Health',          summary: 'Community health integration, referral coordination, chronic disease management, and public health resilience.' },
  { key: 'governance',     label: 'Governance',                summary: 'Board effectiveness, ethics and risk, strategic leadership, and external partnerships.' },
];
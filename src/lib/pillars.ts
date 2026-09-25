export const PILLARS = {
  clinical: {
    label: 'Clinical Services',
    color: '#1565c0',
    bg: '#E6F0FA',
    blurb:
      'Maternal, newborn, child and adolescent health; emergency, surgical, medical and inpatient care; clinical quality, infection prevention and patient safety.',
  },
  workforce: {
    label: 'Health Workforce',
    color: '#2E7D32',
    bg: '#E8F5E9',
    blurb:
      'Workforce planning and recruitment; continuous professional development; clinical leadership; retention, wellbeing and organizational culture.',
  },
  infrastructure: {
    label: 'Infrastructure & Digital',
    color: '#00695C',
    bg: '#E0F2F1',
    blurb:
      'Infrastructure expansion and modernization; medical technology and biomedical engineering; digital health and health information systems; green hospital systems.',
  },
  financing: {
    label: 'Health Financing',
    color: '#B26A00',
    bg: '#FFF4E0',
    blurb:
      'Financial management and cost optimization; revenue cycle and claims; resource mobilization and partnerships; financial risk and strategic investment.',
  },
  community: {
    label: 'Community Health',
    color: '#6A1B9A',
    bg: '#F3E5F5',
    blurb:
      'Community health integration and primary healthcare linkage; continuum of care and referral coordination; chronic disease management; public health resilience.',
  },
  governance: {
    label: 'Governance',
    color: '#860f0f',
    bg: '#F7E9E9',
    blurb:
      'Governance architecture and board effectiveness; ethics and risk governance; strategic leadership; strategic partnerships and external engagement.',
  },
} as const;

export type PillarKey = keyof typeof PILLARS;
export const PILLAR_KEYS = Object.keys(PILLARS) as PillarKey[];
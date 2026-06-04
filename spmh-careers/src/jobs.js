// ─────────────────────────────────────────────────────────────────────────────
// JOBS DATA — single source of truth
//
// To close a position:  set  open: false
// To hide a position:   remove or comment it out
// To add a position:    copy a block, give it a new id, set open: true
// ─────────────────────────────────────────────────────────────────────────────

export const benefits = [
  'Competitive remuneration within the Catholic Diocese of Homa Bay salary scale',
  'Supportive, faith-based, and mission-driven work environment',
  'Regular CPD sessions, in-service training, and professional development opportunities',
  'Stable employment within an established Level 4 health facility',
  'Contribution to meaningful, community-centred healthcare delivery',
  'Collaborative multidisciplinary team culture',
];

const jobs = [
  {
    id: 1,
    title: 'Clinical Officer – Inpatient',
    department: 'Clinical Services',
    type: 'Full-time',
    deadline: '30 June 2026',
    open: true,
    shortDescription:
      'Provide quality inpatient clinical care, conduct ward rounds, and support the medical team in patient diagnosis and management.',
    about:
      'We are seeking a dedicated and experienced Clinical Officer to join our inpatient clinical team. The successful candidate will work closely with the Hospital Medical Officer and nursing staff to ensure high-quality, evidence-based patient care is delivered in line with SPMH standards and Ministry of Health clinical guidelines.',
    responsibilities: [
      'Conduct daily inpatient ward rounds and document clinical findings accurately in the EMR system',
      'Perform clinical assessments, make diagnoses, and initiate appropriate treatment plans',
      'Respond promptly to acute and emergency cases on the ward',
      'Collaborate with nursing, pharmacy, laboratory, and nutrition teams for holistic patient care',
      'Participate in clinical case reviews, audits, and quality improvement activities',
      'Ensure rational medicine use and adherence to the Kenya Essential Medicines List',
      'Provide clinical supervision and mentorship to students and intern staff where applicable',
    ],
    requirements: [
      'Diploma or Degree in Clinical Medicine & Surgery from a recognised institution',
      'Valid and current KMPDB registration certificate',
      'Minimum 2 years of clinical experience, preferably in an inpatient or referral hospital setting',
      'Familiarity with MoH clinical guidelines, HMIS, and EMR systems',
      'Strong clinical documentation and communication skills',
      'Ability to work effectively under pressure in a multidisciplinary team',
    ],
  },
  {
    id: 2,
    title: 'Registered Nurse / Midwife',
    department: 'Nursing & Midwifery',
    type: 'Full-time',
    deadline: '30 June 2026',
    open: true,
    shortDescription:
      'Deliver comprehensive nursing and midwifery care including antenatal, intrapartum, and postnatal services.',
    about:
      "St. Paul's Mission Hospital is looking for a compassionate and skilled Registered Nurse/Midwife to strengthen our nursing and maternity services. The successful candidate will provide patient-centred care across our maternity, general nursing, and MCH units, upholding the highest standards of clinical practice.",
    responsibilities: [
      'Provide direct nursing and midwifery care to patients across assigned wards or units',
      'Conduct antenatal assessments, manage normal deliveries, and provide postnatal care',
      'Administer medications, IV fluids, and treatments as prescribed and document accordingly',
      'Monitor patient vital signs, recognise deterioration, and escalate appropriately',
      'Counsel and educate patients and families on maternal and newborn health',
      'Maintain accurate and timely nursing records in accordance with NCK standards',
      'Support safe mother–baby attachment and infant and young child feeding (IYCF)',
    ],
    requirements: [
      'Diploma in Kenya Registered Community Health Nursing (KRCHN) or Kenya Registered Midwifery (KRM)',
      'Valid and current NCK practising licence',
      'BEmONC certification is a strong added advantage',
      'Experience in a busy maternity or inpatient ward setting preferred',
      'Strong interpersonal skills and a patient-first attitude',
      'Ability to work flexible shifts including nights and weekends',
    ],
  },
  {
    id: 3,
    title: 'Medical Laboratory Technologist',
    department: 'Laboratory Services',
    type: 'Full-time',
    deadline: '30 June 2026',
    open: true,
    shortDescription:
      'Conduct diagnostic laboratory analyses in haematology, biochemistry, microbiology, and serology to support accurate patient care.',
    about:
      'We are seeking a meticulous and experienced Medical Laboratory Technologist to support our growing laboratory services. The successful candidate will ensure accurate, timely, and quality-assured laboratory results that underpin clinical decision-making across all departments.',
    responsibilities: [
      'Perform clinical laboratory tests including haematology, biochemistry, serology, urinalysis, and microbiology',
      'Operate, calibrate, and maintain laboratory equipment according to manufacturer protocols',
      'Implement and maintain internal quality control (IQC) and participate in external quality assurance (EQA) programmes',
      'Collect, label, and process specimens following correct standard operating procedures (SOPs)',
      'Report critical values to clinicians promptly and document appropriately',
      'Maintain accurate laboratory registers and contribute to DHIS2/HMIS data entry',
      'Ensure proper disposal of laboratory waste in line with biosafety guidelines',
    ],
    requirements: [
      'Diploma in Medical Laboratory Sciences from a Kenya Medical Training College or equivalent',
      'Valid and current KMLTTB registration',
      'Minimum 1 year of experience in a clinical laboratory setting',
      'Knowledge of quality management systems (ISO 15189 or equivalent) is an advantage',
      'Proficiency in CD4, viral load testing, and TB diagnostic tools is desirable',
      'High attention to detail and a strong commitment to accuracy',
    ],
  },
  {
    id: 4,
    title: 'Pharmacy Technologist',
    department: 'Pharmacy',
    type: 'Full-time',
    deadline: '30 June 2026',
    open: true,
    shortDescription:
      'Dispense medications accurately, manage drug inventory, and counsel patients on safe medication use.',
    about:
      'We are recruiting a Pharmacy Technologist to support our pharmacy department in providing safe, effective, and rational pharmaceutical services. The ideal candidate will combine technical dispensing expertise with a commitment to patient education and medicine supply chain integrity.',
    responsibilities: [
      'Accurately dispense prescribed medications and provide clear patient counselling on their use',
      'Receive, inspect, and store pharmaceutical supplies in accordance with storage conditions and PPB requirements',
      'Conduct regular stock counts, manage expiry tracking, and prepare reorder requests through KEMSA and alternative suppliers',
      'Maintain the pharmacy ledger, dispensing registers, and relevant HMIS records',
      'Support rational medicine use (RMU) initiatives and flag potential drug interactions to clinicians',
      'Ensure compliance with cold chain protocols for vaccines and temperature-sensitive medicines',
      'Assist in the preparation and submission of pharmacy reports to the Medical Superintendent',
    ],
    requirements: [
      'Diploma in Pharmacy Technology from KMTC or an equivalent recognised institution',
      'Valid registration with the Pharmacy and Poisons Board (PPB)',
      'Minimum 1 year of experience in a hospital or institutional pharmacy setting',
      'Familiarity with KEMSA supply chain systems and essential medicines protocols',
      'Strong numeracy and inventory management skills',
      'High level of integrity and attention to detail',
    ],
  },
  {
    id: 5,
    title: 'Nutritionist / Dietetics Officer',
    department: 'Nutrition & Dietetics',
    type: 'Full-time',
    deadline: '30 June 2026',
    open: true,
    shortDescription:
      'Provide therapeutic nutritional assessment and counselling for inpatients, outpatients, and HIV/TB and maternal nutrition programmes.',
    about:
      "St. Paul's Mission Hospital is seeking a qualified Nutritionist/Dietetics Officer to lead and support nutrition services across our inpatient, outpatient, and community-facing programmes. This role is central to our HIV/TB care continuum, maternal health services, and the management of acute malnutrition.",
    responsibilities: [
      'Conduct nutritional screening, assessment, and counselling for admitted and outpatient clients',
      'Provide therapeutic feeding support for malnourished patients including IMAM protocols',
      'Deliver nutrition education and counselling for pregnant and lactating mothers (MIYCN)',
      'Collaborate with clinical teams to integrate nutrition care into HIV/TB management plans',
      'Prepare and submit monthly nutrition reports and contribute to DHIS2 data entry',
      'Support community nutrition outreach and health education activities',
      'Maintain accurate nutrition consultation records and document outcomes',
    ],
    requirements: [
      'Diploma or Degree in Food, Nutrition & Dietetics from a recognised institution',
      'Valid Kenya Nutritionists and Dieticians Institute (KNDI) practising licence',
      'Experience with IMAM, MIYCN, or community nutrition programmes is an advantage',
      'Familiarity with HIV/TB nutritional care guidelines',
      'Strong counselling, communication, and reporting skills',
    ],
  },
  {
    id: 6,
    title: 'Health Records & Information Officer',
    department: 'Health Records',
    type: 'Full-time',
    deadline: '31 May 2026',
    open: false,  // ← Position closed — change to true to reopen
    shortDescription:
      'Manage patient health records, ensure data quality, and support HMIS reporting including DHIS2 entry and medical coding.',
    about:
      'This position is currently closed. We are not accepting new applications for this role at this time. Please check back for future openings or browse our other available positions.',
    responsibilities: [
      'Manage patient registration, health record creation, filing, and retrieval processes',
      'Ensure completeness, accuracy, and confidentiality of all patient health records',
      'Perform ICD-10 and SNOMED medical coding for inpatient and outpatient encounters',
      'Compile, analyse, and submit timely HMIS reports and DHIS2 data entries',
      'Support the implementation and maintenance of the hospital EMR system',
      'Conduct regular data quality audits and implement corrective actions',
      'Train clinical staff on proper documentation and record-keeping standards',
    ],
    requirements: [
      'Diploma in Health Records and Information Management from KMTC or equivalent',
      'Valid Kenya Health Records and Information Management Board (KHRIMB) registration',
      'Proficiency in DHIS2, KenyaEMR, or other facility EMR systems',
      'Experience with ICD-10 coding and health data analysis',
      'Strong organisational skills and a high degree of accuracy',
      'Commitment to data confidentiality and patient privacy',
    ],
  },
];

export default jobs;

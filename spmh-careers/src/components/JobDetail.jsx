// JobDetail.jsx — right panel

import { benefits } from '../jobs';

// ── Empty state (no job selected) ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p className="text-gray-500 font-semibold text-sm">Select a position to view details</p>
      <p className="text-gray-400 text-xs mt-1.5 max-w-xs">
        Choose a role from the list on the left to see the full job description and requirements.
      </p>
    </div>
  );
}

// ── Section heading ────────────────────────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
      {children}
    </h3>
  );
}

// ── Bullet list item ───────────────────────────────────────────────────────────
function BulletItem({ children, check = false }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
      {check ? (
        <svg className="w-4 h-4 text-[#7B1A2E] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7B1A2E]/60 shrink-0" />
      )}
      <span>{children}</span>
    </li>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function JobDetail({ job, onBack, onApply, mobileView }) {
  return (
    <div
      className={[
        // Layout — flex column so sticky footer works
        'flex-1 flex flex-col min-w-0',
        'overflow-hidden',
        // Mobile visibility — show only when mobileView === 'detail'; always show on md+
        mobileView === 'detail' ? 'flex' : 'hidden',
        'md:flex',
      ].join(' ')}
    >
      {!job ? (
        <EmptyState />
      ) : (
        <>
          {/* ── Scrollable content area ─────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">

            {/* Mobile back button */}
            <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#7B1A2E] hover:opacity-70 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Positions
              </button>
            </div>

            {/* Job header */}
            <div className="px-6 pt-6 pb-5 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h1>
                {job.open ? (
                  <span className="shrink-0 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                    Open
                  </span>
                ) : (
                  <span className="shrink-0 text-xs font-semibold bg-red-50 text-[#7B1A2E] border border-red-200 px-3 py-1 rounded-full">
                    Position Closed
                  </span>
                )}
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2">
                <MetaChip icon="department">{job.department}</MetaChip>
                <MetaChip icon="type">{job.type}</MetaChip>
                <MetaChip icon="location">Homa Bay, Kenya</MetaChip>
                <MetaChip icon="deadline" faded={!job.open}>
                  {job.open ? `Deadline: ${job.deadline}` : `Closed: ${job.deadline}`}
                </MetaChip>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-8">

              {/* About the role */}
              <section>
                <SectionHeading>About the Role</SectionHeading>
                <p className="text-sm text-gray-600 leading-relaxed">{job.about}</p>
              </section>

              {/* Key responsibilities */}
              <section>
                <SectionHeading>Key Responsibilities</SectionHeading>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((r, i) => (
                    <BulletItem key={i}>{r}</BulletItem>
                  ))}
                </ul>
              </section>

              {/* Requirements */}
              <section>
                <SectionHeading>Requirements & Qualifications</SectionHeading>
                <ul className="space-y-2.5">
                  {job.requirements.map((r, i) => (
                    <BulletItem key={i} check>{r}</BulletItem>
                  ))}
                </ul>
              </section>

              {/* What we offer */}
              <section>
                <SectionHeading>What We Offer</SectionHeading>
                <ul className="space-y-2.5">
                  {benefits.map((b, i) => (
                    <BulletItem key={i} check>{b}</BulletItem>
                  ))}
                </ul>
              </section>

              {/* How to apply note */}
              <section className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <strong className="text-gray-700">How to apply:</strong> Complete the application form
                  by clicking the button below. Attach your CV (PDF or Word, max 5MB) and an optional cover
                  letter. Only shortlisted candidates will be contacted. St. Paul's Mission Hospital is an
                  equal opportunity employer.
                </p>
              </section>

            </div>
          </div>

          {/* ── Sticky apply footer ──────────────────────────────────────── */}
          <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
            {job.open ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{job.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Application closes {job.deadline}</p>
                </div>
                <button
                  onClick={onApply}
                  className="shrink-0 bg-[#7B1A2E] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#5a1220] active:bg-[#3d0d14] transition"
                >
                  Apply for This Position
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-1">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  This position is <strong className="text-gray-700">no longer accepting applications</strong>.
                  Please check other open positions.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Meta chip helper ───────────────────────────────────────────────────────────
function MetaChip({ children, icon, faded = false }) {
  const icons = {
    department: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
    type: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
    location: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
    ),
    deadline: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  };

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border',
        faded
          ? 'bg-gray-50 text-gray-400 border-gray-200'
          : 'bg-red-50/60 text-[#7B1A2E] border-red-100',
      ].join(' ')}
    >
      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icons[icon]}
      </svg>
      {children}
    </span>
  );
}

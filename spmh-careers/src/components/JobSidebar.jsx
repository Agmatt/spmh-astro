// JobSidebar.jsx — left panel

import JobListItem from './JobListItem';

export default function JobSidebar({ jobs, selectedJob, onSelect, mobileView }) {
  const openCount = jobs.filter((j) => j.open).length;

  return (
    <aside
      className={[
        // Layout
        'flex flex-col shrink-0',
        'w-full md:w-72 lg:w-80',
        // Border
        'border-r border-gray-200',
        // Scroll
        'overflow-y-auto',
        // Mobile visibility — show only when mobileView === 'list'; always show on md+
        mobileView === 'list' ? 'flex' : 'hidden',
        'md:flex',
      ].join(' ')}
    >
      {/* Sidebar header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Open Positions
        </h2>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {openCount} {openCount === 1 ? 'vacancy' : 'vacancies'} · Homa Bay, Kenya
        </p>
      </div>

      {/* Job list */}
      <div className="flex-1">
        {jobs.map((job) => (
          <JobListItem
            key={job.id}
            job={job}
            isActive={selectedJob?.id === job.id}
            onClick={onSelect}
          />
        ))}
      </div>

      {/* Sidebar footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Only shortlisted candidates will be contacted.
          Applications are handled with full confidentiality.
        </p>
      </div>
    </aside>
  );
}

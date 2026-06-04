// JobListItem.jsx — compact sidebar card

export default function JobListItem({ job, isActive, onClick }) {
  return (
    <button
      onClick={() => job.open && onClick(job)}
      className={[
        'w-full text-left px-4 py-4 border-b border-gray-100 transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7B1A2E]',
        isActive
          ? 'bg-[#7B1A2E]/5 border-l-[3px] border-l-[#7B1A2E]'
          : 'border-l-[3px] border-l-transparent',
        job.open
          ? 'hover:bg-gray-50 cursor-pointer'
          : 'opacity-60 cursor-default',
      ].join(' ')}
      aria-current={isActive ? 'true' : undefined}
      disabled={!job.open}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p
          className={[
            'text-sm font-semibold leading-snug',
            isActive ? 'text-[#7B1A2E]' : 'text-gray-800',
            !job.open && 'line-through decoration-gray-400',
          ].join(' ')}
        >
          {job.title}
        </p>
        {job.open ? (
          <span className="shrink-0 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full leading-none mt-0.5">
            Open
          </span>
        ) : (
          <span className="shrink-0 text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full leading-none mt-0.5">
            Closed
          </span>
        )}
      </div>

      {/* Department */}
      <p className="text-xs text-gray-500 mb-2.5">{job.department}</p>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          {/* Briefcase icon */}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {job.type}
        </span>
        <span className="text-gray-300">·</span>
        <span className="flex items-center gap-1">
          {/* Calendar icon */}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {job.open ? `Closes ${job.deadline}` : `Closed ${job.deadline}`}
        </span>
      </div>
    </button>
  );
}

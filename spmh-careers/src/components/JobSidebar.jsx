// JobSidebar.jsx — left panel
import { useState } from 'react';
import JobListItem from './JobListItem';

export default function JobSidebar({
  jobs,
  selectedJob,
  onSelect,
  mobileView,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter jobs based on active search
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openCount = filteredJobs.filter((j) => j.open).length;

  return (
    <aside
      className={`flex flex-col shrink-0 w-full md:w-80 lg:w-96 bg-gray-50 border-r border-gray-200/80 overflow-hidden ${
        mobileView === 'list' ? 'flex' : 'hidden'
      } md:flex`}>
      {/* Modern Sidebar Header with Integrated Search */}
      <div className='bg-white px-5 py-4 border-b border-gray-200/60 shadow-sm z-10 shrink-0'>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
            Open Positions
          </h2>
          <span className='inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-[#7B1A2E]'>
            {openCount} {openCount === 1 ? 'vacancy' : 'vacancies'}
          </span>
        </div>

        {/* Minimal Search Bar */}
        <div className='relative'>
          <input
            type='text'
            placeholder='Search roles or departments...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1A2E]/20 focus:border-[#7B1A2E] placeholder-gray-400 transition-all duration-200'
          />
          <svg
            className='absolute left-3 top-2.5 h-4 w-4 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
      </div>

      {/* Independently Scrolling Job Cards List */}
      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar'>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobListItem
              key={job.id}
              job={job}
              isActive={selectedJob?.id === job.id}
              onClick={onSelect}
            />
          ))
        ) : (
          <div className='text-center py-12 px-4'>
            <p className='text-sm font-medium text-gray-500'>
              No vacancies match your search.
            </p>
            <p className='text-xs text-gray-400 mt-1'>
              Try checking for different terms or departments.
            </p>
          </div>
        )}
      </div>

      {/* Styled Informational Sticky Footer */}
      <div className='bg-white border-t border-gray-200/60 px-5 py-3 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]'>
        <div className='flex items-start gap-2'>
          <svg
            className='w-3.5 h-3.5 text-[#7B1A2E] shrink-0 mt-0.5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <p className='text-[11px] text-gray-500 leading-normal'>
            Applications are fully confidential. Only shortlisted professionals
            will receive direct contact.
          </p>
        </div>
      </div>
    </aside>
  );
}

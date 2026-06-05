// App.jsx — root layout and state management

import { useState } from 'react';
import jobs from './jobs';
import JobSidebar from './components/JobSidebar';
import JobDetail from './components/JobDetail';
import ApplyModal from './components/ApplyModal';

export default function App() {
  // Which job is selected in the detail panel
  const [selectedJob, setSelectedJob] = useState(null);

  // Mobile-only: controls whether we show the list or the detail panel
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'detail'

  // Whether the apply modal is open
  const [applyOpen, setApplyOpen] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setMobileView('detail'); // on mobile: switch to detail view
  };

  const handleBack = () => {
    setMobileView('list'); // on mobile: back to list
  };

  const handleOpenApply = () => {
    setApplyOpen(true);
  };

  const handleCloseApply = () => {
    setApplyOpen(false);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    // h-screen + overflow-hidden = viewport-locked, each panel scrolls independently
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="shrink-0 bg-[#7B1A2E] border-b border-[#5a1220] z-30">
        <div className="h-14 px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Cross icon */}
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                St. Paul's Mission Hospital
              </p>
              <p className="text-red-200 text-[10px] leading-tight">Careers Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-red-200 text-xs">
              Safe Hands, Caring Hearts
            </span>
            <span className="hidden sm:inline-block text-red-400 text-xs">·</span>
            <span className="hidden sm:inline-block text-red-200 text-xs">
              Homa Bay, Kenya
            </span>
          </div>
        </div>
      </header>

      {/* ── Main two-panel layout ────────────────────────────────────────── */}
      <main className="flex-1 flex overflow-hidden">
        <JobSidebar
          jobs={jobs}
          selectedJob={selectedJob}
          onSelect={handleSelectJob}
          mobileView={mobileView}
        />
        <JobDetail
          job={selectedJob}
          onBack={handleBack}
          onApply={handleOpenApply}
          mobileView={mobileView}
        />
      </main>

      {/* ── Apply modal (portal-style, rendered at root) ─────────────────── */}
      {applyOpen && selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={handleCloseApply}
        />
      )}
    </div>
  );
}

// App.jsx — Main Application Frame

import { useState } from 'react';
import jobs from './jobs';
import JobSidebar from './components/JobSidebar';
import JobDetail from './components/JobDetail';
import ApplyModal from './components/ApplyModal';

export default function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [mobileView, setMobileView] = useState('list');
  const [applyOpen, setApplyOpen] = useState(false);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setMobileView('detail');
  };

  const handleBack = () => {
    setMobileView('list');
  };

  const handleOpenApply = () => {
    setApplyOpen(true);
  };

  const handleCloseApply = () => {
    setApplyOpen(false);
  };

  return (
    <div className='min-h-screen flex flex-col bg-[#f4f8ff] antialiased'>
      {/* ── Centered Institutional Intro ───────────────────────────────── */}
      <section className='w-full pt-12 pb-6 px-4 text-center'>
        <div className='max-w-2xl mx-auto space-y-2'>
          <p className='text-xs font-bold uppercase tracking-wider text-[#5a6f8c]'>
            Catholic Diocese of Homa Bay
          </p>
          <h1 className='text-3xl font-extrabold text-[#0d47a1]'>
            Join Our Mission
          </h1>
          <p className='text-base font-medium text-[#125276]'>
            Safe Hands, Caring Hearts—Help us deliver quality healthcare to Homa
            Bay and beyond
          </p>
          <p className='text-sm text-[#5a6f8c]'>
            We're hiring across clinical, administrative, and community roles
          </p>
        </div>
      </section>

      {/* ── Main Workspace Application Canvas ───────────────────────────── */}
      <div className='flex-1 w-full max-w-7xl mx-auto p-0 md:p-6 lg:p-8'>
        <main className='h-[calc(100vh-4rem)] md:h-[650px] lg:h-[750px] flex overflow-hidden bg-white border border-[#c5d8f7] rounded-none md:rounded-2xl shadow-sm'>
          <JobSidebar
            jobs={jobs}
            selectedJob={selectedJob}
            onSelect={handleSelectJob}
            mobileView={mobileView}
          />
          <div className='flex-1 flex flex-col min-w-0 bg-[#f4f8ff]/30'>
            <JobDetail
              job={selectedJob}
              onBack={handleBack}
              onApply={handleOpenApply}
              mobileView={mobileView}
            />
          </div>
        </main>
      </div>

      {/* ── Restored Original Footer ────────────────────────────────────── */}
      <footer className='bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto'>
        <div className='max-w-7xl mx-auto px-6 py-12 md:py-16'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12'>
            {/* Branding Column */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-white'>
                <span className='font-bold text-base tracking-tight'>
                  St. Paul's Mission Hospital
                </span>
              </div>
              <p className='text-xs text-slate-400 font-semibold uppercase tracking-wider text-red-400'>
                Safe Hands, Caring Hearts
              </p>
              <p className='text-sm text-slate-400 leading-relaxed max-w-sm'>
                Serving Homa Bay and beyond with quality healthcare and
                compassion. Join our dedicated clinical and support teams.
              </p>
            </div>

            {/* Quick Links Column */}
            <div className='space-y-4'>
              <h4 className='text-xs font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-2'>
                Quick Links
              </h4>
              <ul className='space-y-2.5 text-sm'>
                <li>
                  <a
                    href='spmh.netlify.app'
                    className='hover:text-white transition-colors duration-200 flex items-center gap-1.5'>
                    Main Website
                    <svg
                      className='w-3 h-3 text-slate-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href='https://spmh.netlify.app/about-us/history'
                    className='hover:text-white transition-colors duration-200'>
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href='https://spmh.netlify.app/services/clinical'
                    className='hover:text-white transition-colors duration-200'>
                    Services
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Information Column */}
            <div className='space-y-4'>
              <h4 className='text-xs font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-2'>
                Contact
              </h4>
              <ul className='space-y-3 text-sm'>
                <li className='flex items-center gap-2.5'>
                  <svg
                    className='w-4 h-4 text-slate-500 shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                  <span className='text-slate-400'>hr@spmh.co.ke</span>
                </li>
                <li className='flex items-center gap-2.5'>
                  <svg
                    className='w-4 h-4 text-slate-500 shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    />
                  </svg>
                  <span className='text-slate-400'>+254111817447 </span>
                </li>
                <li className='flex items-center gap-2.5'>
                  <svg
                    className='w-4 h-4 text-slate-500 shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                  </svg>
                  <span className='text-slate-400'>Homa Bay, Kenya</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Subfooter Copyright Area */}
          <div className='border-t border-slate-800 mt-12 pt-6 text-center items-center  text-xs text-slate-500'>
            <div>
              &copy; 2026 St. Paul's Mission Hospital. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* ── Modal Portal Frame ──────────────────────────────────────────── */}
      {applyOpen && selectedJob && (
        <ApplyModal job={selectedJob} onClose={handleCloseApply} />
      )}
    </div>
  );
}

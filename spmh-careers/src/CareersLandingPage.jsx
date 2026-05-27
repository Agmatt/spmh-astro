import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function CareersLandingPage() {
  // State management for form and UI
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    coverLetter: '',
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  // Job listings data - this is what you'll maintain and update
  const jobs = [
    {
      id: 1,
      title: 'Registered Nurse (RN) - Inpatient Ward',
      department: 'Inpatient Ward',
      type: 'Full-time',
      experience: '2+ years',
      description:
        'Provide compassionate patient care in our inpatient ward. Assist physicians, monitor patient vital signs, and ensure safe hands, caring hearts in every interaction.',
      requirements: [
        'Valid RN license',
        '2+ years clinical experience',
        'Strong communication skills',
        'Commitment to patient-centered care',
      ],
    },
    {
      id: 2,
      title: 'Laboratory Technician',
      department: 'Laboratory',
      type: 'Full-time',
      experience: '1+ year',
      description:
        'Conduct clinical laboratory tests and maintain equipment. Ensure accuracy and quality in all diagnostic procedures supporting patient care.',
      requirements: [
        'Laboratory certification or diploma',
        '1+ years laboratory experience',
        'Proficiency with lab equipment',
        'Attention to detail',
      ],
    },
    {
      id: 3,
      title: 'Administrative Officer',
      department: 'Administration',
      type: 'Full-time',
      experience: '1+ year',
      description:
        'Support hospital administration with scheduling, documentation, and coordination. Help us run smoothly so clinicians can focus on care.',
      requirements: [
        'High school diploma + relevant training',
        '1+ years office administration experience',
        'Proficiency in MS Office and email',
        'Organizational skills',
      ],
    },
    {
      id: 4,
      title: 'Community Health Worker',
      department: 'Community Outreach',
      type: 'Full-time',
      experience: 'No formal experience required',
      description:
        'Bridge SPMH and the community. Conduct health education, support patient follow-ups, and extend our mission beyond the hospital.',
      requirements: [
        'Community presence and respect',
        'Passion for health education',
        'Willingness to learn',
        'Bilingual (English + Luo/Swahili preferred)',
      ],
    },
    {
      id: 5,
      title: 'Pharmacist',
      department: 'Pharmacy',
      type: 'Full-time',
      experience: '1+ year',
      description:
        'Manage medications, counsel patients, and ensure safe pharmaceutical practice. Your expertise protects patient safety every day.',
      requirements: [
        'Valid pharmacy license',
        '1+ years experience in patient care setting',
        'Knowledge of Kenyan pharmaceutical regulations',
        'Patient counseling experience',
      ],
    },
    {
      id: 6,
      title: 'Volunteer Coordinator',
      department: 'Administration',
      type: 'Part-time',
      experience: 'Flexible',
      description:
        "Recruit, train, and support volunteers who extend SPMH's mission. Build community engagement and institutional capacity.",
      requirements: [
        'Experience with volunteer programs',
        'Excellent organizational skills',
        'Community engagement experience',
        'Passion for mission-driven work',
      ],
    },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

 const handleSubmit = async (e) => {
   e.preventDefault();
   if (submitting) return;
   setSubmitting(true);
   setSubmitStatus(null);

   // Validate
   if (
     !formData.fullName ||
     !formData.email ||
     !formData.phone ||
     !formData.position
   ) {
     setSubmitStatus({
       type: 'error',
       message: 'Please fill in all required fields.',
     });
     setSubmitting(false);
     return;
   }

   try {
     const submitData = new FormData();
     submitData.append('fullName', formData.fullName);
     submitData.append('email', formData.email);
     submitData.append('phone', formData.phone);
     submitData.append('position', formData.position);
     submitData.append('coverLetter', formData.coverLetter);
     if (formData.file) {
       submitData.append('file', formData.file);
     }

     const response = await fetch('http://localhost:5000/api/apply', {
       method: 'POST',
       body: submitData,
     });

     const data = await response.json();

     if (response.ok) {
       // 1. Show success message
       setSubmitStatus({
         type: 'success',
         message:
           'Application submitted successfully! Check your email for confirmation.',
       });
       // 2. Clear the form
       setFormData({
         fullName: '',
         email: '',
         phone: '',
         position: '',
         coverLetter: '',
         file: null,
       });
     } else {
       setSubmitStatus({
         type: 'error',
         message: data.message || 'Submission failed. Please try again.',
       });
     }
   } catch (error) {
     setSubmitStatus({
       type: 'error',
       message: 'Network error. Please check your connection and try again.',
     });
   }

   setSubmitting(false);
 };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50'>
      {/* HERO SECTION */}
      <section className='relative overflow-hidden'>
        {/* Decorative background elements */}
        <div className='absolute top-0 right-0 w-96 h-96 bg-maroon-100 rounded-full opacity-10 blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full opacity-10 blur-3xl'></div>

        <div className='relative max-w-6xl mx-auto px-6 py-20 text-center'>
          {/* Logo/Branding */}
          <div className='mb-8 inline-block'>
            <div className='text-sm font-semibold text-maroon-600 bg-maroon-50 px-4 py-2 rounded-full'>
              Catholic Diocese of Homa Bay
            </div>
          </div>

          {/* Main headline */}
          <h1 className='text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight'>
            Join Our <span className='text-maroon-600'>Mission</span>
          </h1>

          {/* Tagline */}
          <p className='text-xl text-slate-600 mb-8 max-w-2xl mx-auto'>
            Safe Hands, Caring Hearts—Help us deliver quality healthcare to Homa
            Bay and beyond
          </p>

          {/* CTA Button */}
          <button
            onClick={() => {
              document
                .getElementById('jobs-section')
                .scrollIntoView({ behavior: 'smooth' });
            }}
            className='inline-flex items-center gap-2 bg-maroon-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-maroon-700 transition-colors shadow-lg hover:shadow-xl'>
            Explore Open Positions
            <ChevronDown size={20} />
          </button>

          {/* Subtext */}
          <p className='text-slate-500 text-sm mt-6'>
            We're hiring across clinical, administrative, and community roles
          </p>
        </div>
      </section>

      {/* JOBS SECTION */}
      <section id='jobs-section' className='max-w-6xl mx-auto px-6 py-20'>
        <div className='mb-12'>
          <h2 className='text-4xl font-bold text-slate-900 mb-4'>
            Open Positions
          </h2>
          <p className='text-lg text-slate-600'>
            Find a role that matches your skills and passion for healthcare
          </p>
        </div>

        {/* Job Cards Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {jobs.map((job) => (
            <div
              key={job.id}
              className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-200 overflow-hidden cursor-pointer group'
              onClick={() => {
                setSelectedJob(job);
                setFormData((prev) => ({ ...prev, position: job.title }));
                setShowForm(true);
              }}>
              {/* Card header */}
              <div className='bg-gradient-to-r from-maroon-600 to-maroon-700 text-white p-6'>
                <h3 className='text-xl font-bold mb-2'>{job.title}</h3>
                <div className='flex flex-wrap gap-3 text-sm'>
                  <span className='flex items-center gap-1'>
                    <MapPin size={16} /> {job.department}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Clock size={16} /> {job.type}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className='p-6'>
                <p className='text-slate-700 mb-4'>{job.description}</p>

                {/* Quick requirements preview */}
                <div className='mb-4'>
                  <p className='text-sm font-semibold text-slate-900 mb-2'>
                    Key Requirements:
                  </p>
                  <ul className='space-y-1'>
                    {job.requirements.slice(0, 2).map((req, idx) => (
                      <li key={idx} className='text-sm text-slate-600'>
                        • {req}
                      </li>
                    ))}
                    {job.requirements.length > 2 && (
                      <li className='text-sm text-slate-600'>
                        • +{job.requirements.length - 2} more
                      </li>
                    )}
                  </ul>
                </div>

                {/* Apply button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJob(job);
                    setFormData((prev) => ({ ...prev, position: job.title }));
                    setShowForm(true);
                  }}
                  className='w-full bg-maroon-600 text-white py-2 rounded-lg font-semibold hover:bg-maroon-700 transition-colors'>
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* APPLICATION FORM MODAL */}
      {showForm && selectedJob && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto'>
          <div className='bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8'>
            {/* Modal header */}
            <div className='bg-gradient-to-r from-maroon-600 to-maroon-700 text-white p-6 flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold'>Application Form</h2>
                <p className='text-maroon-100 mt-1'>{selectedJob.title}</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedJob(null);
                  setSubmitStatus(null);
                }}
                className='text-2xl font-bold hover:text-maroon-200 transition'>
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className='p-8'>
              {/* Status messages */}
              {submitStatus && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle
                      className='text-green-600 flex-shrink-0'
                      size={20}
                    />
                  ) : (
                    <AlertCircle
                      className='text-red-600 flex-shrink-0'
                      size={20}
                    />
                  )}
                  <p
                    className={
                      submitStatus.type === 'success'
                        ? 'text-green-800'
                        : 'text-red-800'
                    }>
                    {submitStatus.message}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Full Name */}
                <div>
                  <label className='block text-sm font-semibold text-slate-900 mb-2'>
                    Full Name *
                  </label>
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder='Your full name'
                    className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-maroon-600 focus:ring-1 focus:ring-maroon-600'
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className='block text-sm font-semibold text-slate-900 mb-2'>
                    Email Address *
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='your.email@example.com'
                    className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-maroon-600 focus:ring-1 focus:ring-maroon-600'
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className='block text-sm font-semibold text-slate-900 mb-2'>
                    Phone Number *
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder='+254 7XX XXX XXX'
                    className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-maroon-600 focus:ring-1 focus:ring-maroon-600'
                    required
                  />
                </div>

                {/* Position (read-only) */}
                <div>
                  <label className='block text-sm font-semibold text-slate-900 mb-2'>
                    Position Applying For *
                  </label>
                  <input
                    type='text'
                    value={selectedJob.title}
                    disabled
                    className='w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600'
                  />
                </div>

                {/* Cover Letter */}
                <div>
                  <label className='block text-sm font-semibold text-slate-900 mb-2'>
                    Cover Letter / Why do you want to join us?
                  </label>
                  <textarea
                    name='coverLetter'
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    placeholder="Tell us why you're passionate about this role and SPMH's mission..."
                    rows='5'
                    className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-maroon-600 focus:ring-1 focus:ring-maroon-600 resize-none'></textarea>
                </div>

                {/* File Upload */}
                <div>
                  <label className='block text-sm font-semibold text-slate-900 mb-2'>
                    Upload CV or Resume (Optional)
                  </label>
                  <input
                    type='file'
                    name='file'
                    onChange={handleFileChange}
                    accept='.pdf,.doc,.docx'
                    className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-maroon-600'
                  />
                  <p className='text-xs text-slate-500 mt-2'>
                    Accepted formats: PDF, DOC, DOCX (max 5MB)
                  </p>
                </div>

                {/* Buttons */}
                <div className='flex gap-4 pt-4'>
                  <button
                    type='submit'
                    disabled={submitting}
                    className='flex-1 bg-maroon-600 text-white py-3 rounded-lg font-semibold hover:bg-maroon-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setShowForm(false);
                      setSelectedJob(null);
                      setSubmitStatus(null);
                    }}
                    className='flex-1 bg-slate-200 text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors'>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className='bg-slate-900 text-white'>
        <div className='max-w-6xl mx-auto px-6 py-12'>
          <div className='grid md:grid-cols-3 gap-12 mb-8'>
            {/* About */}
            <div>
              <h3 className='font-bold text-lg mb-3'>
                St. Paul's Mission Hospital
              </h3>
              <p className='text-slate-400 text-sm'>
                Safe Hands, Caring Hearts. Serving Homa Bay and beyond with
                quality healthcare and compassion.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className='font-semibold mb-3'>Contact</h4>
              <p className='text-slate-400 text-sm flex items-center gap-2 mb-2'>
                <Mail size={16} /> hr@spmh.example.com
              </p>
              <p className='text-slate-400 text-sm flex items-center gap-2 mb-2'>
                <Mail size={16} /> +254 722 XXXXXX
              </p>
              <p className='text-slate-400 text-sm'>Homa Bay, Kenya</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className='font-semibold mb-3'>Quick Links</h4>
              <ul className='space-y-2 text-slate-400 text-sm'>
                <li>
                  <a
                    href='http://127.0.0.1:4321/'
                    className='hover:text-white transition'>
                    Main Website
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition'>
                    About Us
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition'>
                    Services
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-slate-700 pt-8 text-center text-slate-400 text-sm'>
            <p>&copy; 2026 St. Paul's Mission Hospital. All rights reserved.</p>
            <p className='mt-2'>Catholic Diocese of Homa Bay</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

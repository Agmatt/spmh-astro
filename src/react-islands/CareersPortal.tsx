import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kqvmcuhanypjfzujahst.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxdm1jdWhhbnlwamZ6dWphaHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODMxNzMsImV4cCI6MjA5ODE1OTE3M30.tsmzyuup7fgFQLKGVjHeB0C_Vc9dMWXWSiucOj8N2sM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CareersPortal = () => {
    const [selectedPosition, setSelectedPosition] = useState('gp');
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const positions = [
        {
            id: 'gp',
            title: 'General Practitioner',
            department: 'Clinical',
            experience: '2+ years',
            salary: 'Competitive',
            description: `Join SPMH as a General Practitioner and make a direct impact on community health. You'll provide comprehensive medical care to diverse patients, from routine check-ups to complex diagnoses.

Key Responsibilities:
• Conduct patient consultations and examinations
• Diagnose and treat common illnesses and injuries
• Develop treatment plans and prescribe medications
• Refer patients to specialists when necessary
• Maintain accurate medical records
• Participate in outreach programs
• Mentor junior medical staff

What We're Looking For:
• Valid medical license and registration
• 2+ years of clinical experience
• Strong communication and patient care skills
• Ability to work in a team environment
• Commitment to continuous learning

Why Join Us:
• Competitive salary package
• Health insurance for you and family
• Professional development opportunities
• Flexible working arrangements
• Supportive, collaborative team`,
        },
        {
            id: 'nurse',
            title: 'Registered Nurse',
            department: 'Clinical',
            experience: '1+ years',
            salary: 'Competitive',
            description: `As a Registered Nurse at SPMH, you'll be the backbone of our patient care delivery. You'll work alongside doctors and specialists to ensure every patient receives excellent nursing care.

Key Responsibilities:
• Assess and monitor patient health conditions
• Administer medications and treatments
• Assist with medical procedures
• Provide patient education and support
• Collaborate with healthcare team members
• Maintain patient confidentiality
• Document all patient interactions

What We're Looking For:
• Valid nursing license
• 1+ year of clinical experience
• Compassion and strong interpersonal skills
• Attention to detail and organizational abilities
• Ability to handle high-pressure situations

Why Join Us:
• Competitive salary with benefits
• Career advancement opportunities
• Continuing education support
• Flexible shift patterns
• Dedicated mentorship program`,
        },
        {
            id: 'midwife',
            title: 'Midwife',
            department: 'Maternity',
            experience: '2+ years',
            salary: 'Competitive',
            description: `Join our Maternity Department as a Midwife and be part of one of life's most special moments. We're looking for experienced, compassionate midwives to provide exceptional care to mothers and newborns.

Key Responsibilities:
• Provide prenatal, labor, and postnatal care
• Conduct routine deliveries and assist with complications
• Support mothers during labor and delivery
• Provide newborn care and assessment
• Educate mothers on nutrition and childcare
• Maintain detailed pregnancy and delivery records
• Support family-centered care practices

What We're Looking For:
• Valid midwifery certification/license
• 2+ years of midwifery experience
• Strong clinical knowledge and skills
• Excellent communication abilities
• Empathy and patient advocacy commitment

Why Join Us:
• Competitive salary and benefits
• Modern maternity facilities
• Ongoing professional development
• Supportive, caring team environment
• Opportunities to specialize further`,
        },
        {
            id: 'surgeon',
            title: 'Surgeon',
            department: 'Surgical',
            experience: '3+ years',
            salary: 'Competitive',
            description: `SPMH is seeking a skilled Surgeon to lead our surgical services and provide expert surgical care to our patients. You'll work with state-of-the-art facilities and a dedicated surgical team.

Key Responsibilities:
• Perform surgical procedures and operations
• Evaluate patients and develop surgical plans
• Lead surgical teams during procedures
• Manage pre- and post-operative patient care
• Stay updated with latest surgical techniques
• Teach and mentor junior surgeons
• Ensure surgical best practices and safety

What We're Looking For:
• Valid surgical license and qualifications
• 3+ years of surgical experience
• Expertise in general surgery (or specialty)
• Strong decision-making and problem-solving skills
• Leadership and team management abilities

Why Join Us:
• Excellent salary package
• Health insurance and benefits
• Access to modern surgical equipment
• Professional development opportunities
• Collaborative surgical environment`,
        },
        {
            id: 'lab',
            title: 'Laboratory Technician',
            department: 'Laboratory',
            experience: '1+ years',
            salary: 'Competitive',
            description: `Our Laboratory Department is looking for a meticulous Laboratory Technician to perform critical diagnostic tests and support clinical decision-making.

Key Responsibilities:
• Perform laboratory tests and analysis
• Operate and maintain lab equipment
• Prepare samples and specimens
• Document test results accurately
• Follow quality assurance protocols
• Ensure lab safety and cleanliness
• Report findings to medical staff

What We're Looking For:
• Laboratory technician certification
• 1+ year of laboratory experience
• Strong attention to detail
• Knowledge of lab safety protocols
• Proficiency with lab equipment
• Excellent record-keeping skills

Why Join Us:
• Competitive salary
• Health insurance coverage
• Training on new equipment
• Career growth opportunities
• Professional certification support`,
        },
        {
            id: 'dentist',
            title: 'Dentist',
            department: 'Dental',
            experience: '1+ years',
            salary: 'Competitive',
            description: `Join our Dental Department and provide quality dental care to our community. We're looking for passionate dentists to deliver comprehensive oral health services.

Key Responsibilities:
• Conduct dental examinations and diagnoses
• Perform dental procedures and treatments
• Educate patients on oral hygiene
• Maintain dental equipment and office
• Manage patient records and documentation
• Collaborate with dental hygienists
• Stay current with dental developments

What We're Looking For:
• Valid dental license
• 1+ year of dental practice experience
• Strong clinical and communication skills
• Patient-focused approach
• Commitment to quality care

Why Join Us:
• Competitive compensation
• Health insurance benefits
• Modern dental facilities
• Professional development support
• Supportive team environment`,
        },
    ];

    const currentPosition = positions.find(p => p.id === selectedPosition);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.phone || !cvFile) {
            setError('Please fill in all fields and upload your CV');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const fileName = `${Date.now()}-${cvFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('applications')
                .upload(`cvs/${fileName}`, cvFile);

            if (uploadError) {
                setError(`Error uploading CV: ${uploadError.message}`);
                setLoading(false);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from('applications')
                .getPublicUrl(`cvs/${fileName}`);

            const { error: dbError } = await supabase
                .from('applications')
                .insert([
                    {
                        position_id: selectedPosition,
                        full_name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        cv_url: publicUrlData?.publicUrl || null,
                        status: 'pending',
                    },
                ]);

            if (dbError) {
                setError(`Error submitting application: ${dbError.message}`);
                setLoading(false);
                return;
            }

            setSubmitted(true);
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setShowApplicationForm(false);
        setFormData({ fullName: '', email: '', phone: '' });
        setCvFile(null);
        setError('');
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700">
                            ✓
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Application submitted</h2>
                    <p className="text-muted mb-6">
                        Thank you for applying! We've received your application for the {currentPosition?.title} position. Our team will review it and contact you soon.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            resetForm();
                        }}
                        className="w-full btn-primary rounded-lg"
                    >
                        View other positions
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-24">
            <div className="grid lg:grid-cols-3 gap-6 min-h-screen">
                {/* SIDEBAR - Left */}
                <aside className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-border p-4 md:p-6 sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-primary mb-6">Open positions</h2>
                        <div className="space-y-3">
                            {positions.map((position) => (
                                <button
                                    key={position.id}
                                    onClick={() => {
                                        setSelectedPosition(position.id);
                                        setShowApplicationForm(false);
                                        resetForm();
                                    }}
                                    className={`w-full text-left px-4 py-4 rounded-lg border-2 transition-all ${selectedPosition === position.id
                                        ? 'border-primary bg-primary text-white shadow-md'
                                        : 'border-border text-primary hover:border-primary hover:bg-primary/5'
                                        }`}
                                >
                                    <p className="font-bold text-sm">{position.title}</p>
                                    <p className={`text-xs mt-1 ${selectedPosition === position.id ? 'text-white/80' : 'text-muted'}`}>
                                        {position.department}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT - Right */}
                <main className="lg:col-span-2">
                    {!showApplicationForm ? (
                        <div className="bg-white rounded-lg border border-border p-4 md:p-8 sticky top-6">
                            {/* Job Header */}
                            <div className="mb-8 pb-8 border-b border-border">
                                <h1 className="text-4xl font-bold text-primary mb-4">{currentPosition?.title}</h1>
                                <div className="grid grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <p className="text-xs text-muted font-medium mb-1">Department</p>
                                        <p className="text-lg font-bold text-primary">{currentPosition?.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted font-medium mb-1">Experience</p>
                                        <p className="text-lg font-bold text-primary">{currentPosition?.experience}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted font-medium mb-1">Salary</p>
                                        <p className="text-lg font-bold text-primary">{currentPosition?.salary}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="mb-12">
                                <div className="text-muted whitespace-pre-line leading-relaxed text-sm">
                                    {currentPosition?.description}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 sticky bottom-0 bg-white pt-6 border-t border-border">
                                <button
                                    onClick={() => setShowApplicationForm(true)}
                                    className="flex-1 btn-primary rounded-lg"
                                >
                                    Apply now
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Application Form */
                        <div className="bg-white rounded-lg border border-border p-8">
                            <div className="mb-8">
                                <button
                                    onClick={() => setShowApplicationForm(false)}
                                    className="text-primary font-medium hover:underline mb-4 text-sm"
                                >
                                    ← Back to job details
                                </button>
                                <h2 className="text-3xl font-bold text-primary mb-2">Apply for this position</h2>
                                <p className="text-muted">
                                    Position: <span className="font-bold text-primary">{currentPosition?.title}</span>
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Full name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Phone number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+254 712 345 678"
                                        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Upload CV *</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            required
                                        />
                                        <p className="text-xs text-muted mt-2">PDF, DOC, DOCX (Max 5MB)</p>
                                    </div>
                                    {cvFile && (
                                        <p className="text-sm text-green-600 mt-2">✓ {cvFile.name} selected</p>
                                    )}
                                </div>

                                <div className="space-y-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Submitting...' : 'Submit application'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowApplicationForm(false)}
                                        disabled={loading}
                                        className="w-full btn-secondary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Back to job
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CareersPortal;
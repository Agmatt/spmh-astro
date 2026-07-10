import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tzliykelldkbweogledq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CareersPortal = () => {
    // ==========================================
    // 1. ALL STATE MANAGEMENT (Unified)
    // ==========================================
    const [positions, setPositions] = useState<any[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<string>('');
    const [loadingJobs, setLoadingJobs] = useState<boolean>(true);

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

    // ==========================================
    // 2. FETCH ACTIVE JOBS FROM SUPABASE
    // ==========================================
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoadingJobs(true);
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('is_active', true); // Only grab active openings

                if (error) throw error;
                setPositions(data || []);
            } catch (err) {
                console.error('Error fetching jobs from database:', err);
            } finally {
                setLoadingJobs(false);
            }
        };

        fetchJobs();
    }, []);

    // ==========================================
    // 3. AUTO-SELECT FIRST JOB OR FALLBACK
    // ==========================================
    useEffect(() => {
        if (positions.length > 0 && !selectedPosition) {
            // Automatically highlight the first available database job
            setSelectedPosition(positions[0].id);
        } else if (positions.length === 0) {
            // Force fallback if the table returns completely empty
            setSelectedPosition('general');
        }
    }, [positions, selectedPosition]);

    // ==========================================
    // 4. DERIVE CURRENT SELECTION / DEFAULT OBJECT
    // ==========================================
    const currentPosition = positions.find(p => p.id === selectedPosition) || {
        id: 'general',
        title: 'Join Our Talent Pool',
        department: 'General Application',
        experience: 'Any experience level',
        description: `We do not have any active openings matching this selection right now, but we are always on the lookout for dedicated professionals to join our community. 

Submit your details and CV here. Our human resources team will keep your profile on file and reach out to you directly as soon as a suitable vacancy arises.`
    };

    // ==========================================
    // 5. INTERACTION HANDLERS
    // ==========================================
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

    // ==========================================
    // 6. CONDITIONAL RENDER: INITIAL DATABASE LOADING
    // ==========================================
    if (loadingJobs) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-muted font-medium">Loading career opportunities...</p>
                </div>
            </div>
        );
    }

    // ==========================================
    // 7. CONDITIONAL RENDER: SUCCESS MODAL
    // ==========================================
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
                        Thank you for reaching out! We've received your data for the {currentPosition.title}. Our team will review your profile for future opportunities.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            resetForm();
                        }}
                        className="w-full btn-primary rounded-lg"
                    >
                        Return to overview
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // 8. MAIN UI LAYOUT RENDER
    // ==========================================
    return (
        <div className="w-full max-w-7xl mx-auto py-24">
            <div className="grid lg:grid-cols-3 gap-6 min-h-screen">

                {/* SIDEBAR - Left */}
                <aside className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-border p-4 md:p-6 sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-primary mb-6">Open positions</h2>
                        <div className="space-y-3">
                            {positions.length === 0 ? (
                                <div className="p-4 border-2 border-dashed border-border rounded-lg text-center">
                                    <p className="text-sm font-bold text-primary mb-1">No active listings</p>
                                    <p className="text-xs text-muted mb-3">We aren't actively hiring for specific roles right now.</p>
                                    <button
                                        onClick={() => {
                                            setSelectedPosition('general');
                                            setShowApplicationForm(false);
                                        }}
                                        className={`w-full text-xs font-bold py-2 rounded border transition-all ${selectedPosition === 'general'
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-transparent text-primary border-primary/30 hover:bg-primary/5'
                                            }`}
                                    >
                                        General Application
                                    </button>
                                </div>
                            ) : (
                                positions.map((position) => (
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
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT - Right */}
                <main className="lg:col-span-2">
                    {!showApplicationForm ? (
                        <div className="bg-white rounded-lg border border-border p-4 md:p-8 sticky top-6">
                            {/* Job Header */}
                            <div className="mb-8 pb-8 border-b border-border">
                                <h1 className="text-4xl font-bold text-primary mb-4">{currentPosition.title}</h1>
                                <div className="grid grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <p className="text-xs text-muted font-medium mb-1">Department</p>
                                        <p className="text-lg font-bold text-primary">{currentPosition.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted font-medium mb-1">Experience</p>
                                        <p className="text-lg font-bold text-primary">{currentPosition.experience}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="mb-12">
                                <div className="text-muted whitespace-pre-line leading-relaxed text-sm">
                                    {currentPosition.description}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 sticky bottom-0 bg-white pt-6 border-t border-border">
                                <button
                                    onClick={() => setShowApplicationForm(true)}
                                    className="flex-1 btn-primary rounded-lg"
                                >
                                    {selectedPosition === 'general' ? 'Submit Profile' : 'Apply now'}
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
                                    {`← Back to description`}
                                </button>
                                <h2 className="text-3xl font-bold text-primary mb-2">
                                    {selectedPosition === 'general' ? 'Join Talent Pool' : 'Apply for this position'}
                                </h2>
                                <p className="text-muted">
                                    Targeting: <span className="font-bold text-primary">{currentPosition.title}</span>
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
                                        type="type"
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
                                        Back
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
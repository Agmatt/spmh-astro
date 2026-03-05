// import { useState } from "react"

// const departments = [
//   "General Outpatient",
//   "Emergency & Trauma",
//   "Maternity & Newborn",
//   "Mother & Child Clinic",
//   "Physiotherapy & Rehabilitation",
//   "Surgery",
//   "Pharmacy & Wellness",
//   "Comprehensive Care Centre (CCC)",
//   "Medical",
// ]

// type FormState = {
//   name: string
//   phone: string
//   department: string
//   date: string
// }

// type Status = "idle" | "submitting" | "success" | "error"

// export default function AppointmentCTA() {
//   const [form, setForm] = useState<FormState>({
//     name: "", phone: "", department: "", date: "",
//   })
//   const [errors, setErrors] = useState<Partial<FormState>>({})
//   const [status, setStatus] = useState<Status>("idle")

//   const validate = () => {
//     const e: Partial<FormState> = {}
//     if (!form.name.trim()) e.name = "Please enter your name"
//     if (!form.phone.trim()) e.phone = "Phone number is required"
//     if (!form.department) e.department = "Please select a department"
//     return e
//   }

//   const handleChange = (field: keyof FormState, val: string) => {
//     setForm(f => ({ ...f, [field]: val }))
//     if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const errs = validate()
//     if (Object.keys(errs).length) { setErrors(errs); return }
//     setStatus("submitting")
//     // Simulate API call
//     await new Promise(r => setTimeout(r, 1400))
//     setStatus("success")
//   }

//   const inputBase =
//     "w-full bg-white/10 border border-white/20 text-white placeholder:text-white/35 px-4 py-3 text-sm outline-none focus:border-white/60 focus:bg-white/15 transition-all duration-200"
//   const labelBase = "block text-white/60 text-[0.65rem] tracking-[0.14em] uppercase font-semibold mb-1.5"
//   const errorClass = "text-accent-light text-[0.7rem] mt-1"

//   return (
//     <section id="book" className="bg-slate-700 py-24 relative overflow-hidden">

//       {/* Background cross watermark */}
//       <div className="absolute right-10 top-1/2 -translate-y-1/2 size-72 opacity-[0.04] pointer-events-none hidden lg:block">
//         <div className="absolute left-1/2 top-0 -translate-x-1/2 w-10 h-full bg-white rounded"></div>
//         <div className="absolute top-1/2 left-0 -translate-y-1/2 h-10 w-full bg-white rounded"></div>
//       </div>

      

//       <div className="relative max-w-7xl mx-auto px-2 md:px-6 lg:px-16">
//         <div className="grid lg:grid-cols-5 gap-16 items-start">

//           {/* Left: copy — 2 cols */}
//           <div className="lg:col-span-2">
//             <p className="text-primary-light text-xs tracking-[0.22em] uppercase font-semibold mb-4">
//               Book an Appointment
//             </p>
//             <h2 className="font-display text-white text-4xl lg:text-5xl font-normal leading-tight mb-6">
//               Your next step<br />
//               <span className="font-semibold italic text-primary-light">starts here.</span>
//             </h2>
//             <p className="text-white/55 text-[0.95rem] leading-relaxed mb-10">
//               Book a consultation with one of our specialists. We'll confirm your slot within 24 hours.
//             </p>

//             {/* Contact alternatives */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-4 group">
//                 <div className="size-10 bg-white/8 flex items-center justify-center group-hover:bg-primary transition-colors duration-200 shrink-0">
//                   <svg className="size-4 text-primary-light" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-white/40 text-[0.62rem] tracking-widest uppercase">Prefer to call?</p>
//                   <p className="text-white/80 text-sm font-medium">+254 700 000 000</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 group">
//                 <div className="size-10 bg-accent/20 flex items-center justify-center group-hover:bg-accent transition-colors duration-200 shrink-0">
//                   <span className="relative flex size-2">
//                     <span className="absolute inline-flex size-full rounded-full bg-accent/80 animate-ping"></span>
//                     <span className="relative inline-flex size-2 rounded-full bg-accent"></span>
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-white/40 text-[0.62rem] tracking-widest uppercase">Emergency?</p>
//                   <p className="text-white/80 text-sm font-medium">Walk in — we're always open</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right: form — 3 cols */}
//           <div className="lg:col-span-3">

//             {status === "success" ? (
//               <div className="border border-white/20 bg-white/8 p-12 text-center">
//                 <div className="size-14 bg-primary/20 flex items-center justify-center mx-auto mb-6">
//                   <svg className="size-7 text-primary-light" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//                 <h3 className="font-display text-white text-2xl mb-3">Appointment Requested</h3>
//                 <p className="text-white/55 text-sm leading-relaxed">
//                   Thank you, {form.name.split(" ")[0]}. We'll confirm your {form.department} appointment within 24 hours.
//                 </p>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-5">

//                 <div className="grid sm:grid-cols-2 gap-5">
//                   <div>
//                     <label className={labelBase}>Full Name</label>
//                     <input
//                       type="text"
//                       value={form.name}
//                       onChange={e => handleChange("name", e.target.value)}
//                       placeholder="Jane Doe"
//                       className={inputBase}
//                     />
//                     {errors.name && <p className={errorClass}>{errors.name}</p>}
//                   </div>
//                   <div>
//                     <label className={labelBase}>Phone Number</label>
//                     <input
//                       type="tel"
//                       value={form.phone}
//                       onChange={e => handleChange("phone", e.target.value)}
//                       placeholder="+254 700 000 000"
//                       className={inputBase}
//                     />
//                     {errors.phone && <p className={errorClass}>{errors.phone}</p>}
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelBase}>Department</label>
//                   <select
//                     value={form.department}
//                     onChange={e => handleChange("department", e.target.value)}
//                     className={`${inputBase} appearance-none cursor-pointer`}
//                   >
//                     <option value="">Select a department…</option>
//                     {departments.map(d => <option key={d} value={d}>{d}</option>)}
//                   </select>
//                   {errors.department && <p className={errorClass}>{errors.department}</p>}
//                 </div>

//                 <div>
//                   <label className={labelBase}>Preferred Date <span className="normal-case tracking-normal font-normal opacity-60">(optional)</span></label>
//                   <input
//                     type="date"
//                     value={form.date}
//                     onChange={e => handleChange("date", e.target.value)}
//                     className={inputBase}
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={status === "submitting"}
//                   className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white
//                              font-semibold text-sm tracking-wide py-4 transition-all duration-200
//                              hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30
//                              flex items-center justify-center gap-3"
//                 >
//                   {status === "submitting" ? (
//                     <>
//                       <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
//                       </svg>
//                       Sending request…
//                     </>
//                   ) : (
//                     <>
//                       Book Appointment
//                       <svg className="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
//                         <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                       </svg>
//                     </>
//                   )}
//                 </button>

//                 <p className="text-white/30 text-[0.68rem] text-center leading-relaxed">
//                   We'll confirm within 24 hours. For emergencies, please walk in directly.
//                 </p>

//               </form>
//             )}

//           </div>

//         </div>
//       </div>

//     </section>
//   )
// }

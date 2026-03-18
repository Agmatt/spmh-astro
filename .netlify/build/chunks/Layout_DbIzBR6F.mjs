import { c as createComponent, m as maybeRenderHead, b as renderScript, a as renderTemplate, d as addAttribute, r as renderComponent, v as Fragment, e as createAstro, w as renderSlot, x as renderHead } from './astro/server_FwoxJmSS.mjs';
import 'piccolore';
import 'clsx';
/* empty css                           */

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="sticky top-0 z-[100] bg-white border-b border-slate-100 shadow-sm"> <div class="container mx-auto px-6 py-3 flex items-center justify-between"> <a href="/" class="flex items-center space-x-3 group" title="Home"> <img src="/logos/logo.png" alt="SPMH Logo" class="h-12 w-auto transition-transform duration-300 group-hover:scale-105"> <div class="flex flex-col"> <span class="text-[#125276] font-black tracking-tighter leading-none text-lg uppercase">St. Paul's</span> <span class="text-[#860f0f] text-[10px] font-bold tracking-[0.2em] uppercase">Mission Hospital</span> </div> </a> <!-- Dropdown menu --> <div class="hidden lg:flex items-center space-x-4 lg:space-x-8"> <div class="relative group py-4" data-dropdown="desktop"> <button class="flex items-center text-slate-600 font-bold text-sm hover:text-[#125276] transition-colors focus:outline-none">
About Us
<svg class="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <ul class="absolute top-full left-0 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-3 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-[110]"> <li> <a href="/about-us/history" class="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#125276]">History</a> </li> <li> <a href="/about-us/organization" class="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#125276]">Organization</a> </li> <li> <a href="/about-us/mission-vision-values" class="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#125276]">Our Mission</a> </li> <li> <a href="/about-us/strategic-plan" class="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50">Strategic Plan 2030</a> </li> <li> <a href="/about-us/contact" class="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#125276]">Contact</a> </li> <li> <a href="/about-us/tenders" class="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#125276]">Tenders</a> </li> </ul> </div> <div class="relative group py-4" data-dropdown="desktop"> <button class="flex items-center text-slate-600 font-bold text-sm hover:text-[#125276] transition-colors focus:outline-none">
Our Services
<svg class="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <ul class="absolute top-full left-0 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-3 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-[110]"> <li> <a href="/services/clinical" class="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#125276]">Clinical Services</a> </li> <li> <a href="/services/patient-support" class="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#125276]">Patient Support</a> </li> <li> <a href="/services/appointment" class="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#125276]">Appointment</a> </li> </ul> </div> <a href="/get-involved" class="text-slate-600 font-bold text-sm hover:text-[#125276] py-4 transition-colors">Get Involved</a> <a href="/news-and-media" class="text-slate-600 font-bold text-sm hover:text-[#125276] py-4 transition-colors">News & Media</a> <a href="tel:+254111817447" class="flex items-center gap-3 px-6 py-2.5 bg-[#860f0f] text-white rounded-full hover:bg-[#6d0c0c] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ml-4"> <span class="relative flex h-2 w-2"> <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span> <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span> </span> <span class="text-xs font-black uppercase tracking-widest">+254 111 817447</span> </a> </div> <div class="lg:hidden flex items-center"> <button id="mobile-menu-btn" class="text-[#125276] p-2 hover:bg-slate-50 rounded-lg focus:outline-none"> <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path> </svg> </button> </div> </div> <!-- Humbuger menu --> <div id="mobile-menu" class="hidden lg:hidden bg-[#FDFCF8] border-t border-slate-100 shadow-inner max-h-screen overflow-y-auto"> <div class="px-6 py-8 space-y-4"> <div class="space-y-2"> <button class="mobile-dropdown-btn w-full flex justify-between items-center p-4 rounded-xl bg-white border border-slate-100 text-[#125276] font-black uppercase tracking-tighter text-sm" data-target="mob-about">
About Us
<svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M19 9l-7 7-7-7"></path></svg> </button> <ul id="mob-about" class="hidden px-4 py-2 space-y-3 bg-white/50 rounded-b-xl border-x border-b border-slate-50"> <li> <a href="/about-us/history" class="block py-2 text-slate-600 text-sm font-medium">History</a> </li> <li> <a href="/about-us/organization" class="block py-2 text-slate-600 text-sm font-medium">Organization</a> </li> <li> <a href="/about-us/mission-vision-values" class="block py-2 text-slate-600 text-sm font-medium">Our Mission</a> </li> <li> <a href="/about-us/strategic-plan" class="block py-2 text-slate-600 text-sm font-medium">Strategic Plan</a> </li> <li> <a href="/about-us/contact" class="block py-2 text-slate-600 text-sm font-medium">Contact</a> </li> <li> <a href="/about-us/tenders" class="block py-2 text-slate-600 text-sm font-medium">Tenders</a> </li> </ul> </div> <div class="space-y-2"> <button class="mobile-dropdown-btn w-full flex justify-between items-center p-4 rounded-xl bg-white border border-slate-100 text-[#125276] font-black uppercase tracking-tighter text-sm" data-target="mob-services">
Our Services
<svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M19 9l-7 7-7-7"></path></svg> </button> <ul id="mob-services" class="hidden px-4 py-2 space-y-3 bg-white/50 rounded-b-xl border-x border-b border-slate-50"> <li> <a href="/services/clinical" class="block py-2 text-slate-600 text-sm font-medium">Clinical Services</a> </li> <li> <a href="/services/patient-support" class="block py-2 text-slate-600 text-sm font-medium">Patient Support</a> </li> <li> <a href="/services/appointment" class="block py-2 text-slate-600 text-sm font-medium">Appointment</a> </li> </ul> </div> <a href="/get-involved" class="block p-4 text-[#125276] font-black uppercase tracking-tighter text-sm">Get Involved</a> <a href="/news-and-media" class="block p-4 text-[#125276] font-black uppercase tracking-tighter text-sm">News & Media</a> <a href="tel:+254111817447" class="block w-full text-center p-5 bg-[#860f0f] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg mt-6">
Call Emergency
</a> </div> </div> </nav> <!-- CORRECTED SCRIPT — replace your existing <script> block with this --> ${renderScript($$result, "E:/PROJECT/SPMH/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "E:/PROJECT/SPMH/src/components/Navbar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const quickLinks = [
    { label: "Our Mission", href: "/about-us/mission-vision-values" },
    { label: "History", href: "/about-us/history" },
    { label: "Clinical Services", href: "/services/clinical" },
    { label: "Patient Affairs", href: "/services/patient-affairs" },
    { label: "News & Media", href: "/news-and-media" },
    { label: "Careers", href: "/get-involved/careers" },
    { label: "Tenders", href: "/about-us/tenders" },
    { label: "FAQ", href: "/faq" }
  ];
  const contact = [
    {
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      label: "Address",
      value: "P . O Box 426, Gov. Cyprian Awiti Street\nHoma Bay, Kenya",
      href: "https://maps.google.com/?q=St+Paul+Mission+Hospital+Homa+Bay",
      external: true
    },
    {
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z",
      label: "Phone",
      value: "+254 111 817447",
      href: "tel:+254111817447",
      external: false
    },
    {
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      label: "Email",
      value: "hospital.stpauls@yahoo.com",
      href: "mailto:hospital.stpauls@yahoo.com",
      external: false
    }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="bg-secondary relative overflow-hidden"> <!-- ── Main grid ── --> <div class="relative max-w-7xl mx-auto px-6 lg:px-16 pt-14 pb-10"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6"> <!-- Brand column — 4 cols --> <div class="sm:col-span-2 lg:col-span-4 flex flex-col gap-5"> <!-- Logo + name --> <a href="/" class="flex items-center gap-3 group w-fit"> <img src="/logos/logo.png" alt="St. Paul's Mission Hospital" class="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-200"> <div class="flex flex-col leading-tight"> <span class="text-white font-black tracking-tighter text-base uppercase">
St. Paul's
</span> <span class="text-white text-[0.6rem] font-bold tracking-[0.2em] uppercase">
Mission Hospital
</span> </div> </a> <!-- Tagline --> <div class="border-l-2 border-primary/40 pl-4"> <p class="font-display text-white/70 text-sm italic leading-relaxed">
Serving the Homa Bay community with compassionate, affordable, and dignified healthcare since 1983.
</p> </div> <!-- Accreditation trust signals --> <div class="flex flex-col gap-2"> <div class="flex items-center gap-2"> <svg class="size-3.5 text-primary-light shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <span class="text-white/70 text-[0.62rem] tracking-wide">
SHA Accredited · Level 4 Facility
</span> </div> <div class="flex items-center gap-2"> <svg class="size-3.5 text-primary-light shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <span class="text-white/70 text-[0.62rem] tracking-wide">
Catholic Diocese of Homa Bay · KEC–CHC
</span> </div> </div> </div> <!-- Quick Links — 3 cols --> <div class="lg:col-span-3 lg:col-start-6"> <h3 class="text-white/70 text-[0.62rem] tracking-[0.22em] uppercase font-bold mb-5">
Quick Links
</h3> <ul class="grid grid-cols-2 sm:grid-cols-1 gap-y-3"> ${quickLinks.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="group flex items-center gap-2.5 text-white/60 hover:text-white
                       text-sm transition-colors duration-200"> <!-- Animated dash --> <span class="w-3 h-px bg-white/20 group-hover:w-5 group-hover:bg-primary-light
                             transition-all duration-300 shrink-0"></span> ${link.label} </a> </li>`)} </ul> </div> <!-- Contact — 4 cols --> <div class="lg:col-span-4 lg:col-start-9"> <h3 class="text-white/40 text-[0.62rem] tracking-[0.22em] uppercase font-bold mb-5">
Contact Us
</h3> <ul class="space-y-5"> ${contact.map((c) => renderTemplate`<li> <a${addAttribute(c.href, "href")}${addAttribute(c.external ? "_blank" : "_self", "target")}${addAttribute(c.external ? "noopener noreferrer" : "", "rel")} class="group flex items-start gap-3 w-fit"> <!-- Icon box — aligned to top of multi-line text --> <div class="size-7 bg-white/8 flex items-center justify-center shrink-0
                            group-hover:bg-primary transition-colors duration-200 mt-0.5"> <svg class="size-3.5 text-primary-light" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(c.icon, "d")}></path> </svg> </div> <div> <p class="text-white/30 text-[0.58rem] tracking-widest uppercase mb-0.5"> ${c.label} </p> <p class="text-white/70 group-hover:text-white text-sm leading-relaxed
                             whitespace-pre-line transition-colors duration-200"> ${c.value} </p> </div> </a> </li>`)} </ul> </div> </div> </div> <!-- ── Bottom bar: copyright + utility links ── --> <div class="border-t border-white/10"> <div class="max-w-7xl mx-auto px-6 lg:px-16 py-5
                flex flex-col sm:flex-row items-center justify-between gap-3"> <p class="text-white/70 text-[0.62rem] tracking-wide text-center sm:text-left">
© ${year} St. Paul's Mission Hospital, Homa Bay | All rights reserved | <span class="text-teal-300">Designed by The Editorial Team</span> </p> <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1"> ${[
    { label: "Strategic Plan", href: "/about-us/strategic-plan" },
    { label: "Contact", href: "/about-us/contact" },
    { label: "Tenders", href: "/about-us/tenders" }
  ].map((l, i, arr) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <a${addAttribute(l.href, "href")} class="text-white/80 hover:text-white/60 text-[0.62rem] tracking-wide
                      transition-colors duration-200"> ${l.label} </a> ${i < arr.length - 1 && renderTemplate`<span class="text-white/15 text-xs hidden sm:inline">·</span>`}` })}`)} </div> </div> </div> </footer>`;
}, "E:/PROJECT/SPMH/src/components/Footer.astro", void 0);

const $$PatientAffairs = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="fixed md:bottom-6 md:left-8 z-[100]"> <a href="/services/patient-affairs" class="flex items-center gap-3 px-4 py-3 bg-primary shadow-2xl rounded-full transition-all duration-600" aria-label="Patient Feedback"> <div class="relative flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-white group-hover:text-white"> <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path> </svg> </div> <div class="flex flex-col"> <span class="text-[9px] font-black uppercase tracking-widest text-white leading-none mb-0.5">
Feedback
</span> <span class="text-[10px] font-bold text-white uppercase tracking-tighter leading-none whitespace-nowrap hidden xs:block">
Patient Affairs
</span> </div> </a> </div>`;
}, "E:/PROJECT/SPMH/src/components/PatientAffairs.astro", void 0);

const $$WhatsappFloat = createComponent(($$result, $$props, $$slots) => {
  const PHONE = "254111817447";
  const WA_LINK = `https://wa.me/${PHONE}?text=${encodeURIComponent(
    "Hello, I would like to book an appointment at St. Paul's Mission Hospital."
  )}`;
  return renderTemplate`<!--
  z-[200] — sits above navbar (z-100) and all page content
  The outer div provides the pulse ring; the inner <a> is the button itself.
  No tooltip, no label — icon only as requested.
-->${maybeRenderHead()}<div class="fixed bottom-6 right-6 z-[200]"> <!-- Pulse ring — draws attention without being intrusive --> <span class="absolute inset-0 rounded-full bg-[#25D366] opacity-30"></span> <a${addAttribute(WA_LINK, "href")} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" class="relative flex items-center justify-center
           size-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d]
           shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25
           transition-all duration-300 hover:scale-110"> <svg class="size-7 text-white" fill="currentColor" viewBox="0 0 24 24"> <path d="M11.99 2C6.477 2 2 6.477 2 12c0 1.99.578 3.844 1.576 5.403L2 22l4.757-1.547A9.958 9.958 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.99 2z"></path> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path> </svg> </a> </div>`;
}, "E:/PROJECT/SPMH/src/components/WhatsappFloat.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "St Pauls Mission Hospital" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["", ' <html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>', '</title><link rel="icon" type="image/svg+xml" href="/file.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet"><link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/bold/style.css">', '<!-- in your Layout.astro <head> or before </body> --><script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"><\/script>', "</head> <body> ", " ", " ", " ", " ", " ", " </body></html>"])), renderScript($$result, "E:/PROJECT/SPMH/src/Layout/Layout.astro?astro&type=script&index=0&lang.ts"), title, renderScript($$result, "E:/PROJECT/SPMH/src/Layout/Layout.astro?astro&type=script&index=1&lang.ts"), renderHead(), renderComponent($$result, "Navbar", $$Navbar, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "PatientAffairs", $$PatientAffairs, {}), renderComponent($$result, "Footer", $$Footer, {}), renderComponent($$result, "WhatsappFloat", $$WhatsappFloat, {}), renderScript($$result, "E:/PROJECT/SPMH/src/Layout/Layout.astro?astro&type=script&index=2&lang.ts"));
}, "E:/PROJECT/SPMH/src/Layout/Layout.astro", void 0);

export { $$Layout as $ };

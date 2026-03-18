import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript, d as addAttribute } from '../../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DbIzBR6F.mjs';
export { renderers } from '../../renderers.mjs';

const $$Gallery = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Gallery" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="py-16 bg-gray-50"> <div class="container mx-auto px-2 md:px-4 max-w-6xl"> <h2 class="text-3xl font-bold text-gray-800 mb-10 text-center">
Facilities & Infrastructure
</h2> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> ${["3.jpg", "49.jpg", "50.jpg", "52.jpg", "48.jpg", "46.jpg"].map(
    (img, i) => renderTemplate`<div class="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition duration-300"> <img${addAttribute(`/img/${img}`, "src")} loading="lazy" decoding="async"${addAttribute(`Facility ${i + 1}`, "alt")} class="w-full h-64 object-cover cursor-pointer transform group-hover:scale-110 transition duration-500" data-lightbox> <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-3">  </div> </div>`
  )} </div> </div> </section>  <section class="py-16 bg-white"> <div class="container mx-auto px-2 md:px-4 max-w-6xl"> <h2 class="text-3xl font-bold text-gray-800 mb-10 text-center">
Our Staff & Team
</h2> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> ${[
    "8.jpg",
    "11.jpg",
    "2.jpg",
    "39.jpg",
    "22.jpg",
    "24.jpg",
    "38.jpg",
    "10.jpg",
    "27.jpg",
    "34.jpg",
    "37.jpg",
    "40.jpg",
    "26.jpg",
    "19.jpg",
    "21.jpg",
    "43.jpg",
    "44.jpg",
    "45.jpg"
  ].map((img, i) => renderTemplate`<div class="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition duration-300"> <img${addAttribute(`/img/${img}`, "src")} loading="lazy" decoding="async"${addAttribute(`Staff ${i + 1}`, "alt")} class="w-full h-64 object-cover cursor-pointer transform group-hover:scale-110 transition duration-500" data-lightbox> <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-3">  </div> </div>`)} </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="container mx-auto px-2 md:px-4 max-w-6xl"> <h2 class="text-3xl font-bold text-gray-800 mb-10 text-center">
Community & Outreach
</h2> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> ${["51.jpg", "53.jpg", "community3.jpg"].map((img, i) => renderTemplate`<div class="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition duration-300"> <img${addAttribute(`/img/${img}`, "src")} loading="lazy" decoding="async"${addAttribute(`Community ${i + 1}`, "alt")} class="w-full h-64 object-cover cursor-pointer transform group-hover:scale-110 transition duration-500" data-lightbox> <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-3">  </div> </div>`)} </div> </div> </section>  <section class="py-20 bg-white"> <div class="container mx-auto px-4 max-w-4xl text-center"> <h2 class="text-3xl font-bold text-gray-800 mb-8">Video Highlight</h2> <div class="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-lg"> <iframe src="https://www.youtube.com/embed/your-video-id" loading="lazy" decoding="async" title="Hospital Video" class="w-full h-full" allowfullscreen></iframe> </div> </div> </section>  <section class="bg-green-5py-20 text-center"> <div class="container mx-auto px-4"> <h2 class="text-3xl font-bold mb-4">Discover More</h2> <p class="mb-6 text-lg opacity-90">
Explore our full story and see how we transform healthcare in our
        community.
</p> <a href="/services/clinical" class="btn-primary my-6">
View Our Services
</a> </div> </section>  <div id="lightbox" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 hidden"> <img id="lightbox-img" src="" alt="Expanded view" class="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl"> </div> ${renderScript($$result2, "E:/PROJECT/SPMH/src/pages/news-and-media/gallery.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "E:/PROJECT/SPMH/src/pages/news-and-media/gallery.astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/news-and-media/gallery.astro";
const $$url = "/news-and-media/gallery";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Gallery,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

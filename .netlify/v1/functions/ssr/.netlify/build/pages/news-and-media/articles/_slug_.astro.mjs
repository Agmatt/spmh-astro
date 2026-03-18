import { c as createComponent, e as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/Layout_DbIzBR6F.mjs';
import { r as renderEntry, g as getCollection } from '../../../chunks/_astro_content_CB-0rDMv.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const getStaticPaths = async () => {
  const articles = await getCollection("articles", ({ data }) => !data.draft);
  return articles.map((article) => ({
    params: { slug: article.slug },
    props: { article }
  }));
};
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { article } = Astro2.props;
  const { Content } = await renderEntry(article);
  function formatDate(date) {
    return date.toLocaleDateString("en-KE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }
  const allArticles = await getCollection("articles", ({ data }) => !data.draft);
  const related = allArticles.filter(
    (a) => a.slug !== article.slug && a.data.category === article.data.category
  ).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()).slice(0, 3);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${article.data.title} | St. Paul's Mission Hospital` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="bg-surface border-b border-border/60"> <div class="max-w-4xl mx-auto px-4 lg:px-8 py-3"> <nav class="flex items-center gap-2 text-[0.6rem] font-semibold tracking-[0.12em] uppercase text-muted/50"> <a href="/news-and-media" class="hover:text-primary transition-colors duration-200">News & Media</a> <span>›</span> <a href="/news-and-media/articles" class="hover:text-primary transition-colors duration-200">Articles</a> <span>›</span> <span class="text-muted/30 truncate max-w-[200px]">${article.data.title}</span> </nav> </div> </div>  <header class="bg-white border-b border-border/60"> <div class="max-w-4xl mx-auto px-4 lg:px-8 py-10 lg:py-14"> <span class="text-primary text-[0.6rem] font-bold tracking-[0.2em] uppercase mb-4 block"> ${article.data.category} </span> <h1 class="font-display text-secondary text-3xl sm:text-4xl lg:text-5xl font-semibold
                 leading-tight mb-6"> ${article.data.title} </h1> <p class="text-muted text-base leading-relaxed max-w-2xl mb-8 italic"> ${article.data.excerpt} </p> <div class="flex flex-wrap items-center gap-6 pt-6 border-t border-border/50"> <div> <p class="text-muted/40 text-[0.58rem] tracking-widest uppercase">
By
</p> <p class="text-secondary text-sm font-semibold mt-0.5"> ${article.data.author} </p> </div> <div> <p class="text-muted/40 text-[0.58rem] tracking-widest uppercase">
Published
</p> <p class="text-secondary text-sm font-semibold mt-0.5"> ${formatDate(article.data.date)} </p> </div> </div> </div> </header>  ${article.data.image && renderTemplate`<div class="max-w-4xl mx-auto px-6 lg:px-8 py-8"> <div class="overflow-hidden aspect-[16/9]"> <img${addAttribute(article.data.image, "src")}${addAttribute(article.data.title, "alt")} class="w-full h-full object-cover" loading="eager"> </div> </div>`} <article class="max-w-4xl mx-auto px-4 lg:px-8 pb-16"> <div class="prose prose-lg max-w-none
                prose-headings:font-display prose-headings:text-secondary
                prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-muted prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-secondary
                prose-img:rounded-none prose-img:shadow-md
                prose-blockquote:border-primary prose-blockquote:text-muted
                prose-blockquote:not-italic prose-blockquote:font-normal"> ${renderComponent($$result2, "Content", Content, {})} </div> </article>  ${related.length > 0 && renderTemplate`<section class="bg-surface border-t border-border/60 py-12 lg:py-16"> <div class="max-w-7xl mx-auto px-4 lg:px-16"> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-3 flex items-center gap-3"> <span class="w-8 h-px bg-primary inline-block"></span>
More in ${article.data.category} </p> <h2 class="font-display text-secondary text-2xl font-normal leading-snug mb-8">
Related${" "} <span class="font-semibold italic text-primary">articles.</span> </h2> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"> ${related.map((rel) => renderTemplate`<a${addAttribute(`/news-and-media/articles/${rel.slug}`, "href")} class="group flex flex-col bg-white border border-border/60
                      hover:border-primary/30 hover:shadow-md hover:shadow-primary/5
                      transition-all duration-300"> ${rel.data.image && renderTemplate`<div class="overflow-hidden aspect-[16/10]"> <img${addAttribute(rel.data.image, "src")}${addAttribute(rel.data.title, "alt")} class="w-full h-full object-cover
                           transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy"> </div>`} <div class="p-5"> <span class="text-primary text-[0.58rem] font-bold tracking-[0.18em] uppercase"> ${rel.data.category} </span> <h3 class="font-display text-secondary font-semibold text-sm leading-snug mt-1.5
                           group-hover:text-primary transition-colors duration-200"> ${rel.data.title} </h3> <p class="text-muted/50 text-[0.6rem] mt-3"> ${formatDate(rel.data.date)} </p> </div> </a>`)} </div> </div> </section>`} <div class="max-w-7xl mx-auto px-4 lg:px-16 py-8 border-t border-border/60"> <a href="/news-and-media/articles" class="inline-flex items-center gap-2 text-primary text-xs font-bold
              tracking-[0.1em] uppercase hover:gap-3 transition-all duration-200"> <svg class="size-3.5 rotate-180" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg>
Back to all articles
</a> </div> ` })}`;
}, "E:/PROJECT/SPMH/src/pages/news-and-media/articles/[slug].astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/news-and-media/articles/[slug].astro";
const $$url = "/news-and-media/articles/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

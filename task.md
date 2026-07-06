# Tasks — Personal Portfolio Project

## Stage 1 — Layout framework (MVP) with 3D Scene
- [x] Create `src/components/Header.jsx` with logo & responsive drawer
- [x] Create `src/components/Footer.jsx` with watermark & copyright
- [x] Create initial `src/components/ProjectCard.jsx`
- [x] Create `src/sections/Hero.jsx`
- [x] Create `src/sections/About.jsx` with text & stats grid
- [x] Create `src/sections/Services.jsx` with 5 service cards & Lucide icons
- [x] Create `src/sections/Portfolio.jsx`
- [x] Create `src/sections/TechStack.jsx` with technologies grid
- [x] Create `src/sections/Contact.jsx` with contacts links
- [x] Create `src/components/StaticWatermark.jsx` (SVG watermark & Suspense placeholder)
- [x] Add capability, WebGL support & screen checks in `src/sections/Hero.jsx`
- [x] Create `src/sections/ThreeDHeroScene.jsx` (Octahedron meshes, global mousemove listener, custom dpr)
- [x] Integrate IntersectionObserver in `ThreeDHeroScene.jsx` to pause animation out of viewport
- [x] Load `ThreeDHeroScene` lazily inside `Hero.jsx` under `Suspense`

## Stage 2 — Multi-language (RU/UZ/EN)
- [x] Connect `react-i18next` with `ru.json`, `uz.json`, `en.json`
- [x] Create `LanguageSwitcher.jsx` and integrate into Header
- [x] Translate all sections, ensuring identical key mappings

## Stage 3 — Portfolio Grid & Filters
- [x] Setup category filters in `Portfolio.jsx` (All, ERP/CRM, Bots, AI, Automation)
- [x] Create `ProjectModal.jsx` (dialog role, focus trap, focus restore, escape key, overlay click)
- [x] Clean up `projects.js` to only contain structural, non-translatable fields
- [x] Implement hook `useTilt.js` for interactive CSS 3D tilt effects on cards
- [x] Bind cards to click handler with tilt reset

## Stage 4 — Integrations & SEO
- [x] Configure Telegram deep-links with prefilled message, mailto and tel links
- [x] Add Open Graph, locale alternates (ru_RU, uz_UZ, en_US), and Twitter meta tags in `index.html`
- [x] Generate brand placeholder `og-image.png` and save to `public/`
- [x] Create `public/robots.txt` and `public/sitemap.xml` pointing to domain
- [x] Integrate Yandex Metrika with a placeholder deploy checklist comment
- [x] Update `WORKFLOW.md` with checklist items for domain, tracking code, and contacts replacement
- [x] Run `npm run build` to verify compilation and chunk splitting

## Stage 5 — Polish (Upcoming)
- [ ] Investigate ThreeDHeroScene bundle optimization (tweak three.js imports to decrease size)
- [ ] Add subtle scroll transition animations (fade/slide)
- [ ] Run performance profiling (verify Lighthouse score ≥ 85)
- [ ] Conduct cross-browser testing (Chrome, Safari, Firefox)
- [ ] Verify final checklist before deployment

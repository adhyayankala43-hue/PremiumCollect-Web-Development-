---
name: master-website
description: >-
  The Master Website Engineering & Design Skill. A single unified, end-to-end playbook synthesizing all website skills:
  deep internet research & competitive teardowns, design tokens (OKLCH/HSL) & UI UX Pro Max intelligence,
  zero-cost AI visual asset generation (Pollinations/Perchance), responsive bento architectures & container queries,
  Next.js App Router & modern framework scaffolding, 60fps micro-interactions & magnetic motion, fullstack Zod APIs,
  Base44 cloud app & realtime actor architecture, Core Web Vitals (LCP/INP/CLS) 95+ optimization, WCAG 2.2 AA accessibility,
  technical SEO & JSON-LD schemas, strict security hardening (CSP/CORS/cookies), and agentic multi-viewport browser testing.
---

# Master Website Engineering & Design Skill

The definitive, unified master skill for architecting, designing, developing, optimizing, hardening, testing, and shipping world-class websites and web applications. This master playbook compiles and integrates the entire **Pro Website Skills Suite** into a cohesive, production-ready system.

---

## Master Table of Contents

1. [The Unified Web Engineering Lifecycle](#1-the-unified-web-engineering-lifecycle)
2. [Pillar 1: Deep Web Research & Competitive Intelligence](#2-pillar-1-deep-web-research--competitive-intelligence)
3. [Pillar 2: Visual Aesthetics, Design Systems & Tokens](#3-pillar-2-visual-aesthetics-design-systems--tokens)
4. [Pillar 3: Zero-Cost AI Visual Asset Generation & Prompting](#4-pillar-3-zero-cost-ai-visual-asset-generation--prompting)
5. [Pillar 4: Modern Frontend Architecture & Responsive Engineering](#5-pillar-4-modern-frontend-architecture--responsive-engineering)
6. [Pillar 5: 60fps Micro-Interactions, Motion & Feedback](#6-pillar-5-60fps-micro-interactions-motion--feedback)
7. [Pillar 6: Fullstack APIs, Backend Architecture & Base44 Cloud Platform](#7-pillar-6-fullstack-apis-backend-architecture--base44-cloud-platform)
8. [Pillar 7: Performance Optimization & Core Web Vitals (95+ Lighthouse)](#8-pillar-7-performance-optimization--core-web-vitals-95-lighthouse)
9. [Pillar 8: Web Accessibility & WCAG 2.2 AA Compliance](#9-pillar-8-web-accessibility--wcag-22-aa-compliance)
10. [Pillar 9: Technical SEO, Structured Data & Metadata](#10-pillar-9-technical-seo-structured-data--metadata)
11. [Pillar 10: Web Security Hardening & Defensive Standards](#11-pillar-10-web-security-hardening--defensive-standards)
12. [Pillar 11: Agentic Browser Testing & Automated QA](#12-pillar-11-agentic-browser-testing--automated-qa)
13. [Pillar 12: Comprehensive 50-Point Pre-Delivery Checklist](#13-pillar-12-comprehensive-50-point-pre-delivery-checklist)
14. [Master Toolchain & Reference Index](#14-master-toolchain--reference-index)

---

## 1. The Unified Web Engineering Lifecycle

Every production web project follows a battle-tested 6-phase lifecycle. Never jump straight to coding without establishing research, tokens, and visual assets first.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE MASTER WEB ENGINEERING LIFECYCLE                          │
├───────────────────┬───────────────────┬───────────────────┬─────────────────────────────┤
│ 1. RESEARCH &     │ 2. DESIGN &       │ 3. ASSET          │ 4. ARCHITECTURE &           │
│    INTELLIGENCE   │    TOKENS         │    SYNTHESIS      │    COMPONENTS               │
├───────────────────┼───────────────────┼───────────────────┼─────────────────────────────┤
│ • Dork queries    │ • OKLCH/HSL scale │ • Zero placeholders│ • Next.js App Router/Vite   │
│ • Site teardowns  │ • Surface depth   │ • Pollinations/Flux│ • Responsive Bento Grids    │
│ • Stack vetting   │ • Fluid clamp()   │ • 6 core archetypes│ • 60fps micro-interactions  │
│ • Avoid gotchas   │ • UI UX Pro Max   │ • Palette sync    │ • Accessible shadcn/ui      │
├───────────────────┴───────────────────┴───────────────────┴─────────────────────────────┤
│ 5. FULLSTACK & OPTIMIZATION           │ 6. HARDENING, SEO & VERIFICATION                │
├───────────────────────────────────────┼─────────────────────────────────────────────────┤
│ • Zod-validated API envelopes         │ • Strict CSP, CORS, & Secure Cookies            │
│ • Core Web Vitals: LCP<2.5s, INP<200ms│ • JSON-LD Schemas & OpenGraph / Twitter Cards   │
│ • Image preloading & font subsets     │ • WCAG 2.2 AA contrast & keyboard focus traps   │
│ • Database connection pooling         │ • Agentic browser testing across 3 viewports    │
└───────────────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 2. Pillar 1: Deep Web Research & Competitive Intelligence

Synthesizes: [`web-research-intelligence`](file:///d:/Antigravity%20IDE/skills/web-research-intelligence/SKILL.md)

### 2.1 Multi-Angle Search Query Precision
Never run a single generic query when resolving architectural decisions or novel errors. Search across 3 distinct vectors:
1. **Error / Symptom Vector**: `"<exact error string>" "Next.js" "hydration"`
2. **Root Cause Vector**: `site:github.com/vercel/next.js/issues inurl:issues "Hydration failed because"`
3. **Community Consensus Vector**: `site:stackoverflow.com OR site:reddit.com/r/webdev "hydration mismatch" "suppressHydrationWarning"`

Use the search query generation script:
```bash
node web-research-intelligence/scripts/query-web-research.js "<topic>"
```

### 2.2 Competitive Website & UI/UX Teardowns
When matching the feel of world-class products (Linear, Stripe, Apple, Vercel):
1. **Extract Tech Stack, Headers, Fonts & CDNs**:
   ```bash
   node web-research-intelligence/scripts/inspect-website.js https://example.com
   ```
2. **Extract Raw Color Palettes & CSS Tokens**:
   ```bash
   node web-research-intelligence/scripts/extract-site-palette.js https://example.com
   ```
3. **Deconstruct the Core Dimensions**:
   - **Background Hex**: Distinguish pitch black (`#000000`) from deep charcoal/slate (`#090d16`, `#0b0f19`).
   - **Border Subtlety**: Check hair-thin borders (`1px solid rgba(255, 255, 255, 0.08)` or `rgba(0, 0, 0, 0.06)`).
   - **Depth**: Backdrop filters (`backdrop-filter: blur(16px)`), layered inset shadows.
   - **Motion Curves**: Hover scaling (`1.02`), easing (`cubic-bezier(0.16, 1, 0.3, 1)`), transitions (`150ms-250ms`).

### 2.3 The 6-Point Library Scorecard
Before selecting npm packages (e.g., Zustand vs Jotai, Prisma vs Drizzle, Tailwind vs Vanilla CSS):
- **Maintenance**: Last commit within 30 days, active maintainers, responsive issue triage.
- **Bundle Impact**: Under 15KB gzipped, fully tree-shakeable (`"sideEffects": false`).
- **TypeScript**: First-class native `.d.ts` types, not loose `@types/`.
- **Runtime Environment**: Works seamlessly in Node, Edge, and Browser environments without polyfills.
- **Breaking Risk**: Mature SemVer cadence, minimal churn across minor releases.
- **Battle-Tested**: Documented production adoption at scale.

### 2.4 High-Frequency Web "Gotchas" Pre-Flight
- **Hydration Mismatches**: Guard client-only features (`localStorage`, non-deterministic dates/IDs) behind `mounted` checks:
  ```tsx
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <SkeletonLoader />;
  ```
- **Mobile 100vh Cutoffs**: Never use plain `height: 100vh`. Use dynamic viewport units:
  ```css
  min-height: 100vh;
  min-height: 100dvh;
  ```
- **Z-Index Stacking Contexts**: Avoid arbitrary `z-[9999]`. Enforce CSS stacking isolation on parent containers:
  ```css
  isolation: isolate;
  ```

---

## 3. Pillar 2: Visual Aesthetics, Design Systems & Tokens

Synthesizes: [`web-design-system`](file:///d:/Antigravity%20IDE/skills/web-design-system/SKILL.md), [`ui-ux-pro-max`](file:///d:/Antigravity%20IDE/skills/ui-ux-pro-max/SKILL.md), [`ui-styling`](file:///d:/Antigravity%20IDE/skills/.agents/skills/ui-styling/SKILL.md)

### 3.1 Non-Negotiable Aesthetic Standards
- **Zero Generic Colors**: Pure primary colors (`#0000FF`, `#00FF00`, `#FF0000`) are banned. Use calibrated HSL or OKLCH palettes.
- **Modern Typography Hierarchy**: Never rely on system defaults. Pair premium typefaces (Inter, Plus Jakarta Sans, Outfit, DM Sans) with fluid clamp scales.
- **Layered Surface Depth**: Establish 4 discrete surface tiers with subtle hairline borders and ambient shadows.
- **Contrast Ratios**: Maintain strict 4.5:1 text-to-background contrast minimums across both light and dark themes.

### 3.2 Production Design Token Architecture (CSS Variables)

Place this token foundation in your root CSS stylesheet:

```css
:root {
  /* Color Space: Curated OKLCH / HSL Slate & Indigo */
  --bg-primary: oklch(0.14 0.02 260);
  --bg-secondary: oklch(0.18 0.025 260);
  --surface-1: oklch(0.20 0.03 260 / 0.7);
  --surface-2: oklch(0.24 0.035 260 / 0.8);
  --surface-3: oklch(0.28 0.04 260 / 0.9);
  --surface-border: oklch(0.98 0 0 / 0.08);
  --surface-border-hover: oklch(0.98 0 0 / 0.16);

  /* Brand Accents */
  --primary: oklch(0.65 0.22 265);
  --primary-hover: oklch(0.70 0.24 265);
  --accent: oklch(0.75 0.18 190);
  --accent-glow: oklch(0.75 0.18 190 / 0.25);

  /* Typography Colors */
  --text-primary: oklch(0.98 0.005 260);
  --text-secondary: oklch(0.78 0.015 260);
  --text-muted: oklch(0.55 0.02 260);

  /* Fluid Typography Scale */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Plus Jakarta Sans', var(--font-sans);
  --text-display: clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem);
  --text-h1: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);
  --text-h2: clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem);
  --text-h3: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
  --text-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-sm: clamp(0.85rem, 0.8rem + 0.2vw, 0.925rem);

  /* Depth, Elevation & Shadows */
  --shadow-sm: 0 2px 4px oklch(0 0 0 / 0.2);
  --shadow-md: 0 8px 16px -4px oklch(0 0 0 / 0.3), 0 2px 6px -1px oklch(0 0 0 / 0.2);
  --shadow-lg: 0 20px 32px -8px oklch(0 0 0 / 0.4), 0 4px 12px -2px oklch(0 0 0 / 0.2);
  --shadow-glow: 0 0 40px -10px var(--accent-glow);

  /* Micro-Motion & Transitions */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
}
```

### 3.3 Glassmorphic Surface Cards

```css
.glass-card {
  background: var(--surface-1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--surface-border);
  border-radius: 1rem;
  box-shadow: var(--shadow-md);
  transition: transform var(--duration-normal) var(--ease-spring),
              border-color var(--duration-normal) ease,
              box-shadow var(--duration-normal) var(--ease-spring);
}

.glass-card:hover {
  transform: translateY(-3px);
  border-color: var(--surface-border-hover);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}
```

### 3.4 UI/UX Pro Max Design Intelligence Search
Query the built-in design database for instant styling, color, and font recommendations:
```bash
# Search by product type / industry
python ui-ux-pro-max/scripts/search.py "fintech landing page" --domain style

# Search font pairings
python ui-ux-pro-max/scripts/search.py "modern technical" --domain font

# Search UX best practices
python ui-ux-pro-max/scripts/search.py "data table filtering" --domain ux
```

---

## 4. Pillar 4: Zero-Cost AI Visual Asset Generation & Prompting

Synthesizes: [`free-ai-image-generation`](file:///d:/Antigravity%20IDE/skills/free-ai-image-generation/SKILL.md), [`website-visual-asset-design`](file:///d:/Antigravity%20IDE/skills/website-visual-asset-design/SKILL.md), [`banner-design`](file:///d:/Antigravity%20IDE/skills/.agents/skills/banner-design/SKILL.md)

### 4.1 Zero-Placeholder Mandate
**Never use generic gray placeholder boxes, broken images, or Lorem Ipsum visuals.** Synthesize hyper-targeted, high-fidelity imagery matched directly to your design tokens.

### 4.2 Instant URL Schema (Pollinations.ai)
Embed production visuals directly into HTML/JSX without API keys or accounts:

```text
https://image.pollinations.ai/prompt/{ENCODED_PROMPT}?width={WIDTH}&height={HEIGHT}&nologo=true&seed={SEED}&model={MODEL}
```

- **Models**: `flux` (state-of-the-art detail, typography, photorealism) or `turbo` (ultra-fast rendering).
- **Parameters**: `nologo=true` (removes watermarks), `seed=12345` (locks reproducible output).

### 4.3 The 6 Core Web Asset Archetypes & Prompt Templates

#### 1. Hero Banners (16:9 / 21:9 — 1920x1080 or 1280x720)
```text
https://image.pollinations.ai/prompt/Cinematic%20futuristic%20fintech%20dashboard%20concept%20with%20glowing%20holographic%20charts%2C%20deep%20slate%20navy%20background%2C%20electric%20cyan%20and%20violet%20accent%20lighting%2C%20hyper-detailed%20glassmorphism%2C%208k%20resolution%2C%20Octane%20Render%2C%20unreal%20engine%205%20lighting?width=1280&height=720&nologo=true&model=flux&seed=8492
```

#### 2. 3D Feature Grid Illustrations (1:1 Square — 800x800)
```text
https://image.pollinations.ai/prompt/Isolated%20isometric%203D%20glassmorphic%20shield%20with%20pulsing%20holographic%20neon%20padlock%2C%20translucent%20frosted%20glass%2C%20iridescent%20specular%20reflections%2C%20studio%20lighting%2C%20dark%20solid%20isolated%20background%2C%203D%20Blender%20render%2C%20minimalist?width=800&height=800&nologo=true&model=flux&seed=4921
```

#### 3. User Avatars & Team Testimonials (1:1 Circle Crop — 400x400)
```text
https://image.pollinations.ai/prompt/Modern%20editorial%20studio%20portrait%20of%20a%20confident%20female%20software%20architect%2C%20soft%20warm%20rim%20lighting%2C%20subtle%20dark%20studio%20gradient%20backdrop%2C%20sharp%20focus%20on%20eyes%2C%20shot%20on%2085mm%20f1.4%20lens%2C%20photorealistic?width=400&height=400&nologo=true&model=flux&seed=3019
```

#### 4. Open Graph Social Share Cards (1.91:1 — 1200x630)
```text
https://image.pollinations.ai/prompt/High-impact%20modern%20tech%20brand%20cover%20artwork%2C%20abstract%20flowing%20geometric%20liquid%20metal%20ribbons%20in%20deep%20navy%20and%20vibrant%20purple%2C%20generous%20clean%20negative%20space%20on%20the%20left%2C%208k%20resolution?width=1200&height=630&nologo=true&model=flux&seed=7712
```

#### 5. Ambient Mesh Backgrounds & Textures (16:9 — 1920x1080)
```text
https://image.pollinations.ai/prompt/Subtle%20dark%20mode%20mesh%20gradient%20background%2C%20deep%20indigo%20and%20obsidian%20with%20soft%20cyan%20ambient%20glow%2C%20ultra-smooth%20color%20blending%2C%20fine%20film%20grain%20texture%2C%20minimalist%20luxury%20wallpaper?width=1920&height=1080&nologo=true&model=flux&seed=1824
```

#### 6. E-Commerce & Product Showcases (4:3 — 800x600)
```text
https://image.pollinations.ai/prompt/Sleek%20minimalist%20matte%20black%20wireless%20audio%20device%20resting%20on%20a%20chiseled%20dark%20granite%20pedestal%2C%20soft%20directional%20light%2C%20reflections%2C%20luxury%20commercial%20product%20photography?width=800&height=600&nologo=true&model=flux&seed=5510
```

### 4.4 Local Image Generation CLI Helpers
When assets must be downloaded and stored locally:
```bash
# Generate single asset via Pollinations CLI
node free-ai-image-generation/scripts/generate-pollinations.js "prompt" -w 1200 -h 630 -o public/og-card.jpg

# Multi-provider failover (Pollinations -> Perchance)
node free-ai-image-generation/scripts/unified-image-gen.js "prompt" -o public/hero.jpg

# Batch generate entire website asset manifest
node website-visual-asset-design/scripts/batch-generate-site-assets.js --manifest website-visual-asset-design/examples/design-asset-manifest.json --outDir public/images/
```

---

## 5. Pillar 4: Modern Frontend Architecture & Responsive Engineering

Synthesizes: [`modern-frontend-frameworks`](file:///d:/Antigravity%20IDE/skills/modern-frontend-frameworks/SKILL.md), [`responsive-web-architecture`](file:///d:/Antigravity%20IDE/skills/responsive-web-architecture/SKILL.md)

### 5.1 Scaffolding Rules (Non-Interactive Mode)
When initializing new applications, use automated non-interactive flags:
```bash
# Next.js 15+ App Router
npx -y create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# Vite + React 19 + TypeScript
npx -y create-vite@latest my-app --template react-ts
```

### 5.2 Atomic & Modular Directory Structure
```text
src/
├── app/                  # Next.js App Router routes & layouts
├── components/
│   ├── ui/               # Primitive design system components (Button, Modal, Input)
│   ├── features/         # Domain-specific components (PricingTable, HeroSection)
│   └── layouts/          # Header, Navigation, Footer, Sidebar
├── hooks/                # Custom React hooks (useScrollDirection, useMediaQuery)
├── lib/                  # Utilities (cn, fetcher, formatters, schema validation)
├── stores/               # State management (Zustand stores)
└── types/                # Shared TypeScript interfaces & types
```

### 5.3 Responsive Bento Grid Pattern
An auto-fitting bento grid adapting seamlessly from mobile to desktop:

```css
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.5rem 0;
}

@media (min-width: 640px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(12, 1fr);
  }
  .bento-col-4 { grid-column: span 4; }
  .bento-col-6 { grid-column: span 6; }
  .bento-col-8 { grid-column: span 8; }
  .bento-col-12 { grid-column: span 12; }
}
```

### 5.4 Container Query Component Pattern
Allow UI cards to style themselves based on their parent container's width, independent of viewport size:

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 480px) {
  .card-inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }
  .card-image {
    width: 40%;
    aspect-ratio: 16 / 9;
  }
}
```

### 5.5 High-Performance State Management with Zustand
```typescript
import { create } from 'zustand';

interface UIState {
  isNavOpen: boolean;
  activeFilter: string;
  toggleNav: () => void;
  setFilter: (filter: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isNavOpen: false,
  activeFilter: 'all',
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
  setFilter: (filter) => set({ activeFilter: filter }),
}));
```

---

## 6. Pillar 5: 60fps Micro-Interactions, Motion & Feedback

Synthesizes: [`ui-micro-interactions`](file:///d:/Antigravity%20IDE/skills/ui-micro-interactions/SKILL.md)

### 6.1 The 60fps Animation Rules
1. **GPU Acceleration Only**: Animate ONLY `transform` and `opacity`. NEVER animate `width`, `height`, `top`, `left`, `margin`, or `padding` during hover or scroll interactions.
2. **Timing Curves**: Use `cubic-bezier(0.16, 1, 0.3, 1)` for snappy, organic spring-like deceleration.
3. **Duration Budgets**: 150ms-250ms for micro-interactions (buttons, tooltips); 300ms-400ms for drawers and modals.
4. **Accessibility Compliance**: Honor `prefers-reduced-motion`:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

### 6.2 Magnetic Shimmer Button

```css
.btn-shimmer {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: #ffffff;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px oklch(0.65 0.22 265 / 0.35);
  transition: transform var(--duration-fast) var(--ease-spring),
              box-shadow var(--duration-fast) var(--ease-spring);
  will-change: transform;
}

.btn-shimmer::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    60deg,
    transparent 30%,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 600ms ease;
}

.btn-shimmer:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px oklch(0.65 0.22 265 / 0.45);
}

.btn-shimmer:hover::after {
  transform: translateX(100%);
}

.btn-shimmer:active {
  transform: translateY(0) scale(0.98);
}
```

### 6.3 3D Tilt Card Effect
```javascript
export function initTilt(element) {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}
```

### 6.4 Skeleton Loading Shimmer
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-1) 25%,
    var(--surface-2) 50%,
    var(--surface-1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: 0.375rem;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 7. Pillar 6: Fullstack APIs, Backend Architecture & Base44 Cloud Platform

Synthesizes: [`fullstack-api-backend`](file:///d:/Antigravity%20IDE/skills/fullstack-api-backend/SKILL.md), [`base44-cli`](file:///d:/Antigravity%20IDE/skills/base44-cli/SKILL.md), [`base44-sdk`](file:///d:/Antigravity%20IDE/skills/base44-sdk/SKILL.md), [`base44-troubleshooter`](file:///d:/Antigravity%20IDE/skills/base44-troubleshooter/SKILL.md), [`base44-remote-dev`](file:///d:/Antigravity%20IDE/skills/base44-remote-dev/SKILL.md), [`base44-sandbox`](file:///d:/Antigravity%20IDE/skills/base44-sandbox/SKILL.md)

### 7.1 Standardized API Envelopes
Every backend endpoint must return predictable JSON envelopes:

```typescript
// Success Envelope
type ApiResponse<T> = {
  success: true;
  data: T;
  meta?: { page?: number; total?: number; tookMs?: number };
};

// Error Envelope
type ApiErrorResponse = {
  success: false;
  error: {
    code: 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'INTERNAL_ERROR';
    message: string;
    details?: unknown;
  };
};
```

### 7.2 Production Next.js App Router Route Handler with Zod
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const FeedbackSchema = z.object({
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
  rating: z.number().int().min(1).max(5),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = FeedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Input validation failed',
            details: result.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    // Persist data using singleton client pool
    const savedRecord = { id: crypto.randomUUID(), ...result.data, createdAt: new Date() };

    return NextResponse.json({ success: true, data: savedRecord }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      },
      { status: 500 }
    );
  }
}
```

### 7.3 Cloud-Native Backend & Realtime Architecture (Base44 Platform)

For applications utilizing the **Base44** cloud backend (entities, backend functions, WebSockets, realtime actors, and AI agents):

#### 1. CLI vs SDK Responsibility Boundary
- **Use `base44-cli`** for project initialization, resource provisioning, and cloud deployment:
  - **Mandatory Session Start Check**: Verify auth status with `npx base44 whoami`. If not logged in, request user run `npx base44 login`.
  - **Existing Provisioned App**: Run `npx base44 scaffold` (DO NOT run `create` as it duplicates apps).
  - **New App from Scratch**: Run `npx base44 create`.
  - **Resource Deployment**: Run `npx base44 deploy` or `npx base44 entities push`.
  - *Never invoke bare `base44` — always use package manager prefix (`npx base44 <command>`).*
- **Use `base44-sdk`** for feature implementation in projects with `base44/config.jsonc` or `@base44/sdk`:
  ```javascript
  import { createClient } from "@base44/sdk";
  // Always use appId (never clientId or id)
  const base44 = createClient({ appId: "your-app-id" });
  ```

#### 2. Strict API Verification (Preventing Hallucinations)
Base44 employs distinct API signatures. Never substitute Firebase or Supabase patterns:

| Action | ❌ Incorrect (Hallucinated) | ✅ Correct Base44 SDK Method |
| :--- | :--- | :--- |
| **OAuth Authentication** | `signInWithGoogle()` / `signInWithProvider()` | `base44.auth.loginWithProvider('google')` |
| **Email/Password Login** | `signInWithEmailAndPassword(e, p)` | `base44.auth.loginViaEmailPassword(email, pw)` |
| **User Registration** | `createUser()` / `signUp()` | `base44.auth.register({ email, password })` |
| **Active Session** | `onAuthStateChanged()` / `currentUser` | `await base44.auth.me()` |
| **Function Execution** | `functions.call('name', data)` | `base44.functions.invoke('name', data)` |
| **Entity Create** | `db.collection('Task').add()` | `await base44.entities.Task.create({ title: "Deploy" })` |
| **Entity List** | `db.collection('Task').get()` | `await base44.entities.Task.list()` |
| **Entity Update** | `db.collection('Task').doc(id).update()` | `await base44.entities.Task.update(id, { done: true })` |

#### 3. Realtime Collaborative Actors (WebSockets)
Actors provide stateful realtime synchronization for multiplayer canvases, presence, live chat, and auctions:
```javascript
// Connect to a stateful room actor
const room = base44.actors.Room.get("room-session-99");

// Subscribe to incoming realtime events
room.on("cursor-update", ({ userId, x, y }) => {
  updateRemoteCursor(userId, x, y);
});

// Broadcast client actions to all peers
room.send("cursor-update", { userId: currentUserId, x: clientX, y: clientY });
```

#### 4. Observability, Troubleshooting & Remote Sandboxes
- **Log Inspection**:
  ```bash
  npx base44 functions logs <function-name> --limit 50
  npx base44 workflows runs
  ```
- **Remote Cloud Sandbox Development (`base44-sandbox` / `base44-remote-dev`)**:
  When connected via MCP or `npx base44 sandbox`, file modifications automatically sync and ship instantly without manual git push or deployment commands.

---

## 8. Pillar 7: Performance Optimization & Core Web Vitals (95+ Lighthouse)

Synthesizes: [`web-performance-optimization`](file:///d:/Antigravity%20IDE/skills/web-performance-optimization/SKILL.md)

### 8.1 Core Web Vitals Thresholds
- **LCP (Largest Contentful Paint)**: < 2.5 seconds (Good)
- **INP (Interaction to Next Paint)**: < 200 milliseconds (Good)
- **CLS (Cumulative Layout Shift)**: < 0.1 (Good)

### 8.2 Image Optimization (Defeating the #1 LCP Killer)
1. **Preload the Hero Asset**:
   ```html
   <link rel="preload" as="image" href="/images/hero-banner.webp" fetchpriority="high" type="image/webp">
   ```
2. **Explicit Dimensions to Eliminate Layout Shifts (CLS = 0)**:
   ```html
   <img
     src="/images/hero-banner.webp"
     alt="Fintech analytics workspace platform interface"
     width="1280"
     height="720"
     fetchpriority="high"
     decoding="async"
     style="aspect-ratio: 16 / 9; width: 100%; height: auto;"
   />
   ```
3. **Lazy-Load Below-the-Fold Media**: Always apply `loading="lazy"` and `decoding="async"` to non-hero images.

### 8.3 Font Optimization
- Preload critical font files in HTML `<head>`:
  ```html
  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  ```
- Enforce `font-display: swap` to prevent FOIT (Flash of Invisible Text).

### 8.4 INP Optimization (Interaction to Next Paint)
Break up long JavaScript tasks (> 50ms) using `scheduler.yield()`:
```javascript
async function processBatch(items) {
  for (const item of items) {
    heavyCalculation(item);
    if ('scheduler' in window && 'yield' in window.scheduler) {
      await window.scheduler.yield();
    } else {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
}
```

### 8.5 Automated Performance Audits
```bash
node web-performance-optimization/scripts/audit-performance.js dist/index.html
```

---

## 9. Pillar 8: Web Accessibility & WCAG 2.2 AA Compliance

Synthesizes: [`web-accessibility-wcag`](file:///d:/Antigravity%20IDE/skills/web-accessibility-wcag/SKILL.md)

### 9.1 Non-Negotiable Accessibility Rules
- **4.5:1 Text Contrast**: Normal text (< 18pt / 24px) must maintain at least 4.5:1 contrast against its background; large text must meet 3:1.
- **100% Keyboard Navigability**: Every interactive element must be reachable and triggerable via `Tab`, `Enter`, and `Space`.
- **Visible Focus Rings**: Never use `outline: none` without providing an accessible `:focus-visible` replacement:
  ```css
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  ```
- **Semantic Landmark HTML**: Use `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, and `<footer>`.

### 9.2 Accessible Skip-to-Content Link
```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
.skip-link {
  position: absolute;
  top: -100px;
  left: 1rem;
  background: var(--primary);
  color: #fff;
  padding: 0.5rem 1rem;
  z-index: 10000;
  border-radius: 0.25rem;
  transition: top 150ms ease;
}
.skip-link:focus {
  top: 1rem;
}
</style>
```

### 9.3 Screen-Reader Only Utility (`sr-only`)
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 9.4 Accessible Modal Dialog with Focus Trap
```html
<div
  id="accessible-modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
  class="modal-backdrop"
>
  <div class="modal-card">
    <h2 id="modal-title">Confirm Subscription</h2>
    <p id="modal-desc">Are you sure you want to upgrade to the Pro plan?</p>
    <div class="modal-actions">
      <button id="cancel-btn">Cancel</button>
      <button id="confirm-btn">Confirm</button>
    </div>
  </div>
</div>
```

---

## 10. Pillar 9: Technical SEO, Structured Data & Metadata

Synthesizes: [`seo-and-metadata`](file:///d:/Antigravity%20IDE/skills/seo-and-metadata/SKILL.md)

### 10.1 High-Ranking Head Boilerplate

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Analytics — Next-Generation Financial Intelligence Platform</title>
  <meta name="description" content="Empower your engineering and finance teams with real-time financial telemetry, AI-driven projections, and automated ledger auditing.">
  <link rel="canonical" href="https://example.com/analytics">

  <!-- Open Graph -->
  <meta property="og:site_name" content="Apex Analytics">
  <meta property="og:title" content="Apex Analytics — Next-Generation Financial Intelligence">
  <meta property="og:description" content="Real-time financial telemetry, AI projections, and automated ledger auditing.">
  <meta property="og:image" content="https://example.com/images/og-share-card.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com/analytics">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@ApexAnalytics">
  <meta name="twitter:title" content="Apex Analytics — Next-Generation Financial Intelligence">
  <meta name="twitter:description" content="Real-time financial telemetry, AI projections, and automated ledger auditing.">
  <meta name="twitter:image" content="https://example.com/images/og-share-card.jpg">
</head>
```

### 10.2 Production JSON-LD Structured Data (Organization & FAQPage)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Apex Analytics",
      "url": "https://example.com",
      "logo": "https://example.com/logo.png",
      "sameAs": [
        "https://twitter.com/ApexAnalytics",
        "https://github.com/apex-analytics"
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://example.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How quickly can we integrate Apex Analytics?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Apex connects directly with existing databases and APIs in under 15 minutes with our native TypeScript SDK."
          }
        }
      ]
    }
  ]
}
</script>
```

---

## 11. Pillar 10: Web Security Hardening & Defensive Standards

Synthesizes: [`web-security-hardening`](file:///d:/Antigravity%20IDE/skills/web-security-hardening/SKILL.md)

### 11.1 Production HTTP Security Response Headers

Configure your web server, reverse proxy, or Next.js `headers()` configuration:

```json
{
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://image.pollinations.ai; connect-src 'self' https://image.pollinations.ai; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()"
}
```

### 11.2 XSS Sanitization & Secure Cookie Policies
- **Sanitize Dynamic HTML**: Always pass untrusted strings through DOMPurify before inserting into the DOM:
  ```javascript
  import DOMPurify from 'dompurify';
  element.innerHTML = DOMPurify.sanitize(untrustedContent);
  ```
- **Cookie Security Flags**: Session and auth cookies must always specify:
  ```text
  Set-Cookie: session_token=xyz; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=86400
  ```

---

## 12. Pillar 11: Agentic Browser Testing & Automated QA

Synthesizes: [`browser-testing-qa`](file:///d:/Antigravity%20IDE/skills/browser-testing-qa/SKILL.md)

### 12.1 Multi-Viewport Verification Matrix
Before marking any website task complete, verify layout integrity across the 3 core viewports:
1. **Mobile**: `375 x 812` (iPhone X / SE / modern smartphone)
2. **Tablet**: `768 x 1024` (iPad portrait)
3. **Desktop**: `1440 x 900` (MacBook / High-res monitor)

### 12.2 Automated QA Smoke Test Script
Execute automated verification:
```bash
node browser-testing-qa/scripts/smoke-test.js http://localhost:3000
```

The script monitors:
- HTTP 200/304 status code responses.
- Presence of zero unhandled `console.error` logs.
- Validation that critical landmark tags (`<main>`, `<nav>`) exist.
- Verification that all `<img>` tags possess valid `alt` attributes and explicit aspect ratios.

---

## 13. Pillar 12: Comprehensive 50-Point Pre-Delivery Checklist

Run through this complete checklist prior to final sign-off:

```markdown
### 1. Visual Aesthetics & Tokens
- [ ] No generic/raw primary colors (e.g. #0000FF, #00FF00); HSL or OKLCH used.
- [ ] Modern typography scale configured with fluid clamp() functions.
- [ ] Surface depth hierarchy established (Surface 1 through Surface 4).
- [ ] Hairline borders (0.08 alpha) and ambient multi-layered shadows applied.
- [ ] Dark and light themes both tested with accessible color contrast.

### 2. Assets & Media
- [ ] Zero placeholder boxes or broken images.
- [ ] High-converting hero banner generated (16:9 or 21:9) and matched to tokens.
- [ ] 3D feature cards, testimonial avatars, and OG share card embedded.
- [ ] Hero image preloaded with fetchpriority="high"; below-the-fold media lazy-loaded.
- [ ] Explicit width/height or aspect-ratio set on all images (CLS = 0).

### 3. Responsive Layout & Architecture
- [ ] Tested and verified on mobile (375px), tablet (768px), and desktop (1440px).
- [ ] Bento grid adapts from 1 column on mobile to multi-column on desktop.
- [ ] Navigation drawer works smoothly on touch devices with focus management.
- [ ] No horizontal scrollbars or overflow bugs at any screen width.

### 4. Micro-Interactions & Animation
- [ ] Animations strictly limited to transform and opacity (60fps guaranteed).
- [ ] Magnetic buttons include hover elevation and active scale feedback.
- [ ] Skeleton loaders display during loading/hydration states.
- [ ] @media (prefers-reduced-motion: reduce) thoroughly respected.

### 5. Performance & Core Web Vitals
- [ ] LCP < 2.5s, INP < 200ms, CLS < 0.1 verified.
- [ ] Primary font subset preloaded with font-display: swap.
- [ ] Long JS execution tasks broken up with scheduler.yield().
- [ ] Critical above-the-fold CSS inlined.

### 6. Accessibility (WCAG 2.2 AA)
- [ ] 4.5:1 text contrast maintained everywhere.
- [ ] Skip-to-content link present and functional.
- [ ] 100% keyboard navigable with visible :focus-visible rings.
- [ ] Modal dialogs trap focus and close on Escape key.
- [ ] Descriptive alt text on all images; .sr-only utilities used for icons.

### 7. Technical SEO & Security
- [ ] Unique <title> (50-60 chars) and meta description (150-160 chars) present.
- [ ] Open Graph and Twitter Card tags verified with 1200x630 card.
- [ ] JSON-LD structured data (Organization, FAQPage, WebSite) validated.
- [ ] Strict Content Security Policy (CSP) and security headers configured.
- [ ] Zero unhandled console errors or hydration warnings.
```

---

## 14. Master Toolchain & Reference Index

### 14.1 Workspace Helper Scripts

| Script Path | Purpose | Execution Command |
| :--- | :--- | :--- |
| [`inspect-website.js`](file:///d:/Antigravity%20IDE/skills/web-research-intelligence/scripts/inspect-website.js) | Scrapes tech stack, fonts, headers, and meta tags of live websites. | `node web-research-intelligence/scripts/inspect-website.js <url>` |
| [`extract-site-palette.js`](file:///d:/Antigravity%20IDE/skills/web-research-intelligence/scripts/extract-site-palette.js) | Extracts hex/hsl colors from websites into CSS variables. | `node web-research-intelligence/scripts/extract-site-palette.js <url>` |
| [`query-web-research.js`](file:///d:/Antigravity%20IDE/skills/web-research-intelligence/scripts/query-web-research.js) | Generates optimized multi-angle Google Dork queries. | `node web-research-intelligence/scripts/query-web-research.js "<topic>"` |
| [`search.py`](file:///d:/Antigravity%20IDE/skills/ui-ux-pro-max/scripts/search.py) | UI/UX design intelligence CLI for styles, palettes, and fonts. | `python ui-ux-pro-max/scripts/search.py "<query>" --domain style` |
| [`generate-pollinations.js`](file:///d:/Antigravity%20IDE/skills/free-ai-image-generation/scripts/generate-pollinations.js) | Downloads AI-generated imagery locally via Pollinations.ai. | `node free-ai-image-generation/scripts/generate-pollinations.js "<prompt>"` |
| [`unified-image-gen.js`](file:///d:/Antigravity%20IDE/skills/free-ai-image-generation/scripts/unified-image-gen.js) | Zero-cost multi-provider image generation with failover. | `node free-ai-image-generation/scripts/unified-image-gen.js "<prompt>"` |
| [`batch-generate-site-assets.js`](file:///d:/Antigravity%20IDE/skills/website-visual-asset-design/scripts/batch-generate-site-assets.js) | Synthesizes an entire website asset suite from a JSON manifest. | `node website-visual-asset-design/scripts/batch-generate-site-assets.js` |
| [`audit-performance.js`](file:///d:/Antigravity%20IDE/skills/web-performance-optimization/scripts/audit-performance.js) | Audits HTML files for Core Web Vitals, image tags, and CSS. | `node web-performance-optimization/scripts/audit-performance.js <html-file>` |
| [`check-a11y.js`](file:///d:/Antigravity%20IDE/skills/web-accessibility-wcag/scripts/check-a11y.js) | Lints markup for WCAG 2.2 AA accessibility violations. | `node web-accessibility-wcag/scripts/check-a11y.js <html-file>` |
| [`smoke-test.js`](file:///d:/Antigravity%20IDE/skills/browser-testing-qa/scripts/smoke-test.js) | Runs automated browser smoke tests and console monitoring. | `node browser-testing-qa/scripts/smoke-test.js <url>` |
| [`base44-cli`](file:///d:/Antigravity%20IDE/skills/base44-cli/SKILL.md) | Manages Base44 authentication, entity schema push, and resource deploy. | `npx base44 whoami` / `npx base44 deploy` |
| [`base44-troubleshooter`](file:///d:/Antigravity%20IDE/skills/base44-troubleshooter/SKILL.md) | Fetches backend function execution logs and workflow run history. | `npx base44 functions logs <fn> --limit 50` |

### 14.2 Specialized Reference Manuals & Guides

- **Base44 Cloud Platform**: [Base44 CLI Manual](file:///d:/Antigravity%20IDE/skills/base44-cli/SKILL.md) | [SDK Quick Reference](file:///d:/Antigravity%20IDE/skills/base44-sdk/references/QUICK_REFERENCE.md) | [Realtime Actors](file:///d:/Antigravity%20IDE/skills/base44-sdk/references/actors.md) | [Troubleshooter](file:///d:/Antigravity%20IDE/skills/base44-troubleshooter/SKILL.md)
- **Design Systems & Tokens**: [Design Tokens Guide](file:///d:/Antigravity%20IDE/skills/web-design-system/references/tokens-guide.md) | [Base Tokens CSS](file:///d:/Antigravity%20IDE/skills/web-design-system/examples/design-tokens.css)
- **Micro-Interactions**: [Animation Principles](file:///d:/Antigravity%20IDE/skills/ui-micro-interactions/references/animation-principles.md) | [Components CSS](file:///d:/Antigravity%20IDE/skills/ui-micro-interactions/examples/interactive-components.css)
- **Responsive Architecture**: [Layout Cheatsheet](file:///d:/Antigravity%20IDE/skills/responsive-web-architecture/references/layout-cheatsheet.md) | [Responsive Nav Template](file:///d:/Antigravity%20IDE/skills/responsive-web-architecture/examples/responsive-nav.html)
- **Performance & Vitals**: [Core Web Vitals Handbook](file:///d:/Antigravity%20IDE/skills/web-performance-optimization/references/core-web-vitals.md)
- **Frameworks & Scaffolding**: [Next.js & Vite Architecture](file:///d:/Antigravity%20IDE/skills/modern-frontend-frameworks/references/nextjs-vite-patterns.md) | [Project Scaffold Config](file:///d:/Antigravity%20IDE/skills/modern-frontend-frameworks/examples/project-scaffold.json)
- **Accessibility**: [WCAG 2.2 AA Checklist](file:///d:/Antigravity%20IDE/skills/web-accessibility-wcag/references/wcag-audit-checklist.md)
- **Technical SEO**: [JSON-LD Schema Templates](file:///d:/Antigravity%20IDE/skills/seo-and-metadata/references/schema-templates.md) | [SEO Head Template](file:///d:/Antigravity%20IDE/skills/seo-and-metadata/examples/seo-head-template.html)
- **Security Hardening**: [Security Headers Handbook](file:///d:/Antigravity%20IDE/skills/web-security-hardening/references/security-headers-guide.md) | [Headers Config](file:///d:/Antigravity%20IDE/skills/web-security-hardening/examples/security-headers.json)
- **Visual Assets**: [Asset Prompt Recipes](file:///d:/Antigravity%20IDE/skills/website-visual-asset-design/references/web-asset-prompt-recipes.md) | [Token Matching](file:///d:/Antigravity%20IDE/skills/website-visual-asset-design/references/ui-design-token-matching.md) | [Asset Showcase](file:///d:/Antigravity%20IDE/skills/website-visual-asset-design/examples/asset-showcase.html)
- **Web Research**: [Advanced Search Operators](file:///d:/Antigravity%20IDE/skills/web-research-intelligence/references/advanced-web-search-operators.md) | [Site Teardowns](file:///d:/Antigravity%20IDE/skills/web-research-intelligence/references/competitive-website-teardown-guide.md) | [Web Gotchas](file:///d:/Antigravity%20IDE/skills/web-research-intelligence/references/high-frequency-web-gotchas.md)

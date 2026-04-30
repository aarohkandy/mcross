# MCROSS AI Handoff

Last updated: 2026-04-30  
Repo: `C:\Users\aak\Downloads\mcross`  
GitHub: `https://github.com/aarohkandy/mcross.git`  
Branch at write time: `main`  
HEAD at write time: `959145e57d294d12cece437172c2d89306c9d432`

This file is intended to let another AI pick up the project with minimal extra discovery.

## 1. What This Project Is

`mcross` is a minimal landing page for a roof cleaning business.

It is:
- a single-page Next.js App Router site
- quote-first, with the form as the primary conversion target
- visually dark, premium, and sparse
- styled around black backgrounds with muted moss/green accents
- designed to feel alive, but not noisy

The user repeatedly pushed toward:
- less clutter
- less text
- stronger desktop composition
- full-screen hero layout
- subtle motion only
- aggressive performance optimization

The user is sensitive to:
- background effects that are too flashy
- anything that looks like "AI slop"
- heavy GPU or CPU usage
- having to repeat the same instruction multiple times

## 2. Tech Stack

- Next.js `16.2.4`
- React `19.2.4`
- TypeScript `strict`
- Tailwind CSS v4 via `@import "tailwindcss";`
- App Router only

Important files:
- `package.json`
- `next.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

## 3. Project Rules / Local Instructions

### AGENTS.md
The repo has a local rule:

> This is NOT the Next.js you know. Read the relevant guide in `node_modules/next/dist/docs/` before writing code.

So before doing framework-specific work, check:
- `node_modules/next/dist/docs/`

### Workflow expectation
The user explicitly asked that completed changes get pushed to GitHub.

Expected workflow:
1. edit
2. run `npm run lint`
3. run `npm run build`
4. commit
5. push to `main`

## 4. File Structure That Matters

App files:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/favicon.ico`

Components:
- `src/components/contact-form.tsx`
- `src/components/hero-backdrop.tsx`
- `src/components/hero-life.tsx`
- `src/components/intro-splash.tsx`

Assets:
- `public/founders-inc-mark.svg`
- `public/mcross-favicon.svg`

Meta / docs:
- `README.md`
- `AGENTS.md`
- `CLAUDE.md` (just points at `AGENTS.md`)

There is also:
- `src/app/api/property-preview`

At the time of writing, that path exists but appears unused.

## 5. Current UX / Visual Direction

### Overall page
The site is a one-screen hero:
- top-left: `MCROSS`
- top-right: "Backed by Founders Inc."
- left: large headline
- right: signup / quote form

### Current headline
Defined in `src/app/page.tsx`:
- `Roof Cleaning,`
- `Faster, Cheaper,`
- `Better.`

### Background
The background is layered but restrained:
- static dark gradients
- muted moss glow
- soft grain
- a very lightweight Conway/Game-of-Life-inspired canvas layer

The background used to be much heavier and was simplified several times after performance complaints.

### Intro animation
`src/components/intro-splash.tsx` renders an opening overlay with:
- green-tinted screen
- vertical wash sections
- randomized delays
- curved lower edges
- short fade-out

The intro was iterated many times. Be careful when touching it.

## 6. Current Conversion / Lead Flow

The site does not currently have a real backend, database, or Supabase integration.

The quote form submits via FormSubmit from the client.

Relevant file:
- `src/components/contact-form.tsx`

Current behavior:
1. User fills out:
   - `name`
   - `address`
   - `phone`
   - `email`
2. The form POSTs to:
   - `https://formsubmit.co/ajax/akandy@stanford.edu`
3. Extra data sent:
   - `_subject = "New MCROSS quote request"`
   - `_url = current page URL`
   - `_replyto = user email`
   - `_cc = aarohkandy@gmail.com,hongyiren2009@outlook.com` if configured
4. On success:
   - the form resets
   - a success panel shows
5. On failure:
   - an error panel tells the user to call or email instead

Important:
- no local persistence
- no Supabase storage
- no server route handling leads
- FormSubmit needs to be properly activated to work reliably

### Known text bug
`contact-form.tsx` currently contains mojibake in the success message.

Current broken text:
- `Weâ€™ll review the address and follow up with availability.`

Intended text:
- `We'll review the address and follow up with availability.`

This is a real bug and worth fixing.

## 7. Current Business Data

Defined in `src/app/page.tsx`:

- primary email: `akandy@stanford.edu`
- phone display: `425-623-0392`
- phone href: `tel:+14256230392`
- cc emails:
  - `aarohkandy@gmail.com`
  - `hongyiren2009@outlook.com`

If contact details change, update `src/app/page.tsx`.

## 8. Current Founders Inc. Badge

The user wanted a "Backed by Founders Inc." badge on the site.

Implementation:
- markup: `src/app/page.tsx`
- styling: `src/app/globals.css`
- asset: `public/founders-inc-mark.svg`

Important context:
- the user supplied the logo as an image in chat
- earlier attempts used inline SVG approximations and the user hated them
- the current version uses a dedicated local asset file
- the badge has an opaque pill background so the Game of Life animation does not show through it

If the user later provides an official transparent asset, replacing `public/founders-inc-mark.svg` is the cleanest upgrade path.

## 9. Current Favicon

The user also provided a separate icon to use as the favicon.

Current implementation:
- `src/app/favicon.ico` was regenerated to match the requested icon
- `public/mcross-favicon.svg` was added
- `src/app/layout.tsx` includes metadata icon links for the SVG

Why both exist:
- some browsers prefer `favicon.ico`
- others can use the SVG favicon

Current head output includes:
- `/favicon.ico`
- `/mcross-favicon.svg`

## 10. Background Animation / Performance History

This matters a lot because the user got very frustrated by performance regressions.

### What happened historically
The background went through many versions:
- heavy blurred CSS layers
- more dramatic animated concepts
- larger canvas experiments
- noisy effects

At one point the user reported extremely high GPU usage and was angry about it.

### Current strategy
Current performance strategy is:
- most of the background stays static
- motion stays subtle
- internal buffers stay tiny
- avoid high-frequency full-screen expensive effects

### Current Life implementation
Relevant file:
- `src/components/hero-life.tsx`

Current technical choices:
- canvas size: `96 x 54`
- one `Uint8Array` current state
- one `Uint8Array` next state
- one `Float32Array` display buffer
- one reused `ImageData`
- startup warmup steps
- faster startup ticks followed by slower steady-state ticks
- no React rerender loop
- client-only canvas drawing
- pauses when the document is hidden

Current timing:
- startup tick: `82ms`
- startup ticks: `12`
- steady tick: `180ms`
- startup warmup steps: `4`

This balance was chosen because the user wanted the background to feel alive without bringing back the earlier GPU pain.

## 11. Layout + Styling Notes

### Fonts
Defined in `src/app/layout.tsx`:
- `Bebas Neue` for headings
- `Manrope` for body text

### Layout behavior
Most layout sizing is driven by CSS variables in `src/app/globals.css`.

Important classes:
- `.hero-layout`
- `.hero-copy`
- `.hero-form-shell`
- `.hero-lockup`
- `.contact-panel`
- `.founders-badge`

The page is tuned primarily for desktop hero composition, then adapted downward with media queries.

### Scrollbars
The user disliked visible scrollbars, so:
- `.site-shell` hides scrollbars
- `body` itself is overflow-hidden
- scrolling happens inside the shell

## 12. Metadata / Hydration Notes

`src/app/layout.tsx` currently sets:
- `suppressHydrationWarning` on `<body>`

Reason:
- the user saw hydration warnings caused by browser extensions injecting attributes into the body
- specifically Grammarly-style extension attributes

This was a practical suppression, not primarily a site-logic fix.

## 13. Build / Dev Commands

Install:
```bash
npm install
```

Run dev:
```bash
npm run dev
```

Run lint:
```bash
npm run lint
```

Run production build:
```bash
npm run build
```

Expected results at handoff time:
- `npm run lint` passes
- `npm run build` passes

## 14. Git / Deployment State

Remote:
- `origin https://github.com/aarohkandy/mcross.git`

Branch:
- `main`

Recent commits before this handoff:
- `959145e` Update site favicon
- `2773c7f` Use Founders Inc logo asset
- `8d8d28c` Refine Founders Inc endorsement
- `a981e4e` Improve quote form status messaging
- `0c9d127` Add Founders Inc backing mark
- `0bca01a` Clean landing page and route leads
- `7361728` Make hero layout aspect-aware
- `8cb7af0` Sharpen hero life background

At the time this file was written, the working tree was clean.

## 15. Known Rough Edges / Things Another AI Should Notice

1. `contact-form.tsx` has mojibake in the success message:
   - broken: `Weâ€™ll`
   - intended: `We'll`

2. The project still relies on FormSubmit, not a real backend.
   - If the user wants actual lead storage, the next obvious step is:
     - create a server route
     - add validation
     - optionally add Supabase or Resend or both

3. `src/app/api/property-preview` appears empty or unused.
   - It may be leftover scaffolding.

4. The favicon was recreated locally from the user's supplied icon.
   - If exact brand accuracy matters, replace the recreated asset with an official file.

5. The Founders Inc. badge asset is local and may still be an approximation.
   - If the user later provides an official transparent asset, swap it in.

6. The intro overlay and the Life background were both heavily iterated.
   - Be careful changing either.
   - The user is likely to notice regressions immediately.

## 16. User Taste / Working Preferences

The user generally prefers:
- direct action over long planning
- minimal clutter
- full-screen desktop composition
- premium black plus muted green aesthetics
- subtle motion
- faster pages
- no obvious glassmorphism
- quote-first UX
- GitHub kept up to date automatically

The user does not like:
- overly cute or generic landing-page patterns
- noisy backgrounds
- unnecessary dividers or boxes
- narrow mobile-looking desktop layouts
- slow or heavy animation
- having to repeat "push it to GitHub"

## 17. Good Next Steps If Asked To Continue

If another AI needs to continue productively, the most likely valuable next tasks are:

1. Replace FormSubmit with a real lead pipeline
   - server route
   - validation
   - persistence
   - optional email

2. Fix the text encoding bug in `contact-form.tsx`

3. Clean unused artifacts like empty API folders if the user wants cleanup

4. If visual refinements are requested:
   - keep them subtle
   - test desktop first
   - verify background performance

5. If changing icons or logos:
   - prefer real asset files over hand-drawn approximations

## 18. Short Practical Summary

If you are another AI taking over:
- this is a single-page Next.js landing page
- the quote form is the main point of the site
- the user cares a lot about aesthetics and performance
- push to GitHub when done
- read local Next docs before major framework-specific edits
- avoid reintroducing heavy animation
- treat branding assets carefully
- current lead flow is client-side FormSubmit, not a real backend

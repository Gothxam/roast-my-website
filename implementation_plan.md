# Roast My Website MVP Implementation Plan

The objective is to build a full-stack platform where users can input a URL and receive a highly detailed, "roasted" feedback report covering Design, UX, Performance, SEO, and Accessibility.

## User Review Required
> [!IMPORTANT]
> - **OpenAI API Key**: We will need an OpenAI API Key configured in the `.env` file for the backend to generate the roasts.
> - **System Dependencies**: Lighthouse and Puppeteer require a working Chrome/Chromium installation on the backend machine.

## Proposed Architecture

### Backend (Express)
The backend will use Node.js and Express. It will define an endpoint `POST /api/analyze` which will coordinate several analysis tools:
1. **Puppeteer**: Fetch page HTML, extract metadata (title, meta description), headings structure, and wait for network idle to ensure the page has loaded.
2. **Lighthouse**: Run a headless Chrome audit on the given URL to compute scores for Performance, Accessibility, Best Practices, and SEO.
3. **Axe-core**: (Optional via Lighthouse, but we might inject it via Puppeteer for extra UI-centric accessibility findings, or just rely on Lighthouse's built-in axe integration which is usually sufficient). We'll use Lighthouse for A11y to keep it simple and reliable.
4. **OpenAI**: Send the combined results (metadata, structural issues, lighthouse scores) to an LLM (GPT-4o or gpt-3.5-turbo) with a system prompt instructing it to act as a harsh but helpful "senior frontend developer" roasting the site and providing actionable suggestions.

### Frontend (Next.js + Tailwind + Framer Motion)
A modern, dynamic Next.js application focusing on premium aesthetics.
- **Landing Page**: Visually striking hero section, an input field for the URL, and a CTA.
- **Loading State**: An engaging multi-step loader (e.g., "Warming up the oven...", "Summoning the senior dev...", "Running Lighthouse audits...") since the backend analysis might take 10-20 seconds.
- **Results Page**:
  - Overall Score Dial (0-100)
  - Category breakdown bars (Design, Performance, SEO, UX, Accessibility)
  - The "Roast" text container
  - Actionable Improvement Suggestions list
  - (Optional) Thumbnail of the website captured via Puppeteer.

## Setup Steps
1. Create `backend` folder, init npm, install `express`, `cors`, `puppeteer`, `lighthouse`, `chrome-launcher`, `openai`, `dotenv`.
2. Create `frontend` folder using `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`.
3. Install `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge` in the frontend.

## Verification Plan
1. Send a known URL (e.g., `example.com` or `google.com`) through the system.
2. Verify that Lighthouse and Puppeteer successfully run without hanging.
3. Verify that OpenAI successfully summarizes the audit findings into a roast.
4. Verify that the frontend correctly displays the scores, the roast, and suggestions with the intended animations and premium design.

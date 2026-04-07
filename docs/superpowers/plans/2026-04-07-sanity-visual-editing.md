# Sanity Visual Editing + Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add side-by-side preview and click-to-edit visual editing to the Dimensione Dolce Sanity CMS, so the client sees live changes while editing in the Studio.

**Architecture:** Switch Astro from static (`output: 'static'`) to server mode (`output: 'server'`) with Vercel adapter. Static pages keep `export const prerender = true` for zero performance regression. Add `@sanity/astro` integration with stega encoding + `VisualEditing` component for click-to-edit overlays. Add `presentationTool` to Sanity Studio for the side-by-side iframe preview. Create `/api/draft` endpoint for authenticated draft mode.

**Tech Stack:** Astro 6 (server mode), `@sanity/astro`, `@astrojs/vercel`, `@astrojs/react`, `sanity/presentation`, `@sanity/preview-url-secret`

---

### Task 1: Install dependencies and switch to server mode

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`

- [ ] **Step 1: Install required packages**

```bash
npm install @sanity/astro @astrojs/react @astrojs/vercel @sanity/preview-url-secret
```

- [ ] **Step 2: Update `astro.config.mjs`**

Replace the entire file with:

```js
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  build: {
    format: 'file',
  },
  integrations: [
    sanity({
      projectId: 'gk5zqp4d',
      dataset: 'production',
      useCdn: false,
      stega: {
        studioUrl: 'https://dimensionedolce.sanity.studio',
      },
    }),
    react(),
  ],
});
```

- [ ] **Step 3: Verify build still works**

```bash
npx astro build 2>&1 | tail -5
```

Expected: 13 pages built, no errors.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "feat: switch to server mode with Sanity and React integrations"
```

---

### Task 2: Mark static pages with `prerender = true`

**Files:**
- Modify: `src/pages/shop.astro`
- Modify: `src/pages/product-pistacchio.astro`
- Modify: `src/pages/product-cioccolato.astro`
- Modify: `src/pages/product-crema.astro`
- Modify: `src/pages/torte-su-misura.astro`
- Modify: `src/pages/spedizioni-faq.astro`
- Modify: `src/pages/privacy.astro`
- Modify: `src/pages/cookie-policy.astro`

These 8 pages are static (no CMS data). They must be prerendered for performance.

- [ ] **Step 1: Add `export const prerender = true` to each static page**

For each of the 8 files listed above, add this line in the frontmatter (between the `---` fences):

```astro
---
export const prerender = true;
---
```

If the page has no frontmatter (empty `---` block), add it:

```astro
---
export const prerender = true;
---
```

If the page has existing frontmatter (like imports), add the line after the imports:

```astro
---
import SomeLayout from '../layouts/SomeLayout.astro';
export const prerender = true;
---
```

- [ ] **Step 2: Verify build**

```bash
npx astro build 2>&1 | tail -20
```

Expected: 8 pages show as "prerendered", 5 CMS pages are server-rendered. No errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/shop.astro src/pages/product-pistacchio.astro src/pages/product-cioccolato.astro src/pages/product-crema.astro src/pages/torte-su-misura.astro src/pages/spedizioni-faq.astro src/pages/privacy.astro src/pages/cookie-policy.astro
git commit -m "perf: prerender static pages for zero performance regression"
```

---

### Task 3: Create Sanity API read token

**Files:**
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Create a read token via Sanity API**

```bash
TOKEN=$(python3 -c "import json; print(json.load(open('$HOME/.config/sanity/config.json'))['authToken'])")

curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.sanity.io/v2024-01-01/projects/gk5zqp4d/tokens" \
  -d '{"label": "Astro Preview", "roleName": "viewer"}' | python3 -m json.tool
```

Copy the `key` value from the response.

- [ ] **Step 2: Add token to `.env`**

Add this line to `/Users/torresi.studio/dimensione-dolce/.env`:

```
SANITY_API_READ_TOKEN=<paste token here>
```

- [ ] **Step 3: Update `.env.example`**

```
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-read-token
```

- [ ] **Step 4: Add token to Vercel**

```bash
vercel env add SANITY_API_READ_TOKEN production <<< "<paste token>"
```

- [ ] **Step 5: Commit**

```bash
git add .env.example
git commit -m "docs: add SANITY_API_READ_TOKEN to env example"
```

---

### Task 4: Create draft mode API endpoint

**Files:**
- Create: `src/pages/api/draft.ts`

This endpoint validates the preview URL secret from Sanity Studio and enables draft mode.

- [ ] **Step 1: Create the draft mode endpoint**

Create `/Users/torresi.studio/dimensione-dolce/src/pages/api/draft.ts`:

```typescript
import type { APIRoute } from 'astro';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { createClient } from '@sanity/client';

export const GET: APIRoute = async ({ request, redirect, cookies }) => {
  const token = import.meta.env.SANITY_API_READ_TOKEN;
  if (!token) {
    return new Response('Missing SANITY_API_READ_TOKEN', { status: 500 });
  }

  const client = createClient({
    projectId: 'gk5zqp4d',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  });

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(client, request.url);

  if (!isValid) {
    return new Response('Invalid preview URL', { status: 401 });
  }

  cookies.set('__sanity_preview', 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  return redirect(redirectTo, 307);
};
```

- [ ] **Step 2: Verify build**

```bash
npx astro build 2>&1 | tail -5
```

Expected: Build succeeds. The `/api/draft` route appears as a server route.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/draft.ts
git commit -m "feat: add draft mode API endpoint for visual editing"
```

---

### Task 5: Update Sanity client to support draft mode with stega

**Files:**
- Modify: `src/lib/sanity.ts`

The client must use stega encoding when in preview mode (so overlays know which field to edit) and fetch draft content when the preview cookie is set.

- [ ] **Step 1: Rewrite `src/lib/sanity.ts`**

Replace the entire file with:

```typescript
import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = import.meta.env.SANITY_PROJECT_ID || 'gk5zqp4d';
const dataset = import.meta.env.SANITY_DATASET || 'production';
const token = import.meta.env.SANITY_API_READ_TOKEN || '';

export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: false,
    })
  : null;

export function getClient(preview = false): SanityClient | null {
  if (!sanityClient) return null;
  if (preview && token) {
    return sanityClient.withConfig({
      token,
      perspective: 'previewDrafts',
      useCdn: false,
      stega: {
        enabled: true,
        studioUrl: 'https://dimensionedolce.sanity.studio',
      },
    });
  }
  return sanityClient;
}

export async function fetchSanity<T>(query: string, preview = false): Promise<T | null> {
  const client = getClient(preview);
  if (!client) return null;
  try {
    return await client.fetch<T>(query);
  } catch {
    return null;
  }
}

export function urlFor(source: SanityImageSource) {
  if (!sanityClient) return null;
  return imageUrlBuilder(sanityClient).image(source);
}
```

- [ ] **Step 2: Verify build**

```bash
npx astro build 2>&1 | tail -5
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/sanity.ts
git commit -m "feat: add preview/stega support to Sanity client"
```

---

### Task 6: Update CMS pages to detect preview mode

**Files:**
- Modify: `src/pages/index.astro` (frontmatter only)
- Modify: `src/pages/menu.astro` (frontmatter only)
- Modify: `src/pages/chi-siamo.astro` (frontmatter only)
- Modify: `src/pages/catering-eventi.astro` (frontmatter only)
- Modify: `src/pages/contatti.astro` (frontmatter only)

Each CMS page must check the preview cookie and pass it to `fetchSanity`.

- [ ] **Step 1: Update frontmatter of each CMS page**

For `src/pages/index.astro`, change the frontmatter to:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { fetchSanity } from '../lib/sanity';
import { homePageQuery } from '../lib/queries';

const preview = Astro.cookies.get('__sanity_preview')?.value === 'true';
const page = await fetchSanity<any>(homePageQuery, preview);
---
```

For `src/pages/menu.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { fetchSanity } from '../lib/sanity';
import { menuPageQuery } from '../lib/queries';

const preview = Astro.cookies.get('__sanity_preview')?.value === 'true';
const page = await fetchSanity<any>(menuPageQuery, preview);
---
```

For `src/pages/chi-siamo.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { fetchSanity } from '../lib/sanity';
import { aboutPageQuery } from '../lib/queries';

const preview = Astro.cookies.get('__sanity_preview')?.value === 'true';
const page = await fetchSanity<any>(aboutPageQuery, preview);
---
```

For `src/pages/catering-eventi.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { fetchSanity } from '../lib/sanity';
import { cateringPageQuery } from '../lib/queries';

const preview = Astro.cookies.get('__sanity_preview')?.value === 'true';
const page = await fetchSanity<any>(cateringPageQuery, preview);
---
```

For `src/pages/contatti.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { fetchSanity } from '../lib/sanity';
import { contactPageQuery, siteSettingsQuery } from '../lib/queries';

const preview = Astro.cookies.get('__sanity_preview')?.value === 'true';
const contactPage = await fetchSanity<any>(contactPageQuery, preview);
const siteSettings = await fetchSanity<any>(siteSettingsQuery, preview);
---
```

- [ ] **Step 2: Verify build**

```bash
npx astro build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro src/pages/menu.astro src/pages/chi-siamo.astro src/pages/catering-eventi.astro src/pages/contatti.astro
git commit -m "feat: detect preview mode in CMS pages for draft content"
```

---

### Task 7: Add VisualEditing component to BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

The `VisualEditing` component renders click-to-edit overlays when in preview mode.

- [ ] **Step 1: Update BaseLayout.astro**

Add the import and component just before the closing `</body>` tag. In the frontmatter, add the preview detection. The component is a React component (that's why we need `@astrojs/react`).

Add to the frontmatter (between `---` fences):

```astro
---
import { VisualEditing } from '@sanity/astro/visual-editing';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
const preview = Astro.cookies.get('__sanity_preview')?.value === 'true';
---
```

Add just before `</body>`:

```astro
    {preview && <VisualEditing client:only="react" zIndex={1000} />}
```

Note: `client:only="react"` is required because this is a React component that must run client-side only.

- [ ] **Step 2: Verify build**

```bash
npx astro build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add VisualEditing overlays to BaseLayout"
```

---

### Task 8: Add Presentation tool to Sanity Studio

**Files:**
- Modify: `sanity.config.ts`

This adds the side-by-side preview panel to the Studio where the client sees the live site while editing.

- [ ] **Step 1: Update `sanity.config.ts`**

Replace the entire file with:

```typescript
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './src/sanity/schemas';
import { structure } from './src/sanity/structure';

export default defineConfig({
  name: 'dimensione-dolce',
  title: 'Dimensione Dolce',
  projectId: 'gk5zqp4d',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: 'https://dimensione-dolce.vercel.app',
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
```

- [ ] **Step 2: Redeploy Sanity Studio**

```bash
npx sanity deploy -y
```

Expected: Studio deploys successfully with the new Presentation tab.

- [ ] **Step 3: Commit**

```bash
git add sanity.config.ts
git commit -m "feat: add Presentation tool to Sanity Studio for visual preview"
```

---

### Task 9: Add `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` env var and deploy

**Files:**
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Add env var to `.env`**

```
PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true
```

- [ ] **Step 2: Update `.env.example`**

```
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-read-token
PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true
```

- [ ] **Step 3: Add env vars to Vercel**

```bash
vercel env add PUBLIC_SANITY_VISUAL_EDITING_ENABLED production <<< "true"
```

- [ ] **Step 4: Push and deploy**

```bash
git add .env.example
git commit -m "feat: enable visual editing env var"
git push
```

- [ ] **Step 5: Verify deployment**

Wait for Vercel to deploy. Then open `https://dimensionedolce.sanity.studio`, click the "Presentation" tab — the site should appear in an iframe with the editing panel alongside.

---

### Task 10: End-to-end verification

- [ ] **Step 1: Test Presentation preview**

Go to `https://dimensionedolce.sanity.studio` → click the "Presentation" tab at the top. The live site should load in an iframe on the right. Navigate pages in the iframe.

- [ ] **Step 2: Test click-to-edit**

In the Presentation view, hover over a text element on the site (e.g., "Benvenuti nella nostra dimensione"). A blue overlay should appear. Click it — the Studio should navigate to the corresponding field in the content editor.

- [ ] **Step 3: Test live preview**

In the Studio content editor, change the "Benvenuti" title text. The iframe preview should update in real-time (or after a short delay) without needing to publish.

- [ ] **Step 4: Test production site is unaffected**

Open `https://dimensione-dolce.vercel.app` directly in a browser. The site should look and behave exactly as before — no overlays, no stega encoding visible, no performance difference on prerendered pages.

#!/usr/bin/env node
/**
 * Dimensione Dolce — AI Image Generator
 * Uses Gemini 3.1 Flash Image Preview (Nano Banana 2)
 * Same pattern as shoe-designer-studio edge functions
 */

import fs from 'fs';
import path from 'path';

const API_KEY = 'AIzaSyBv3Kgb_fuswzHr8IXbvcSKMV1jOxnbxr4';
const MODEL = 'gemini-2.5-flash-image'; // Gemini image generation model
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const OUTPUT_DIR = path.join(import.meta.dirname, 'assets', 'img');

// Reference images from brand folder
const BRAND_DIR = '/Volumes/T7 Shield/PROGETTI NOVEMBRE 2024/Dimensione Dolce Brand_Folder/Links';
const REF_IMAGES = {
  pistacchio: path.join(BRAND_DIR, 'ChatGPT Image Feb 1, 2026 at 07_38_53 PM.png'),
  box: path.join(BRAND_DIR, 'DimensioneDolce Panettone Box 2 rendering.jpg'),
  pistacchioPhoto: path.join(BRAND_DIR, 'Pistacchio.png'),
};

function readImageAsBase64(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  return { data: buffer.toString('base64'), mimeType };
}

async function generateImage(prompt, referenceImages = [], retries = 2) {
  const parts = [];

  // Add reference images
  for (const ref of referenceImages) {
    try {
      const img = readImageAsBase64(ref);
      parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
    } catch (e) {
      console.warn(`  Warning: Could not read ${ref}: ${e.message}`);
    }
  }

  // Add text prompt
  parts.push({ text: prompt });

  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: 0.7,
      responseModalities: ['IMAGE', 'TEXT'],
    },
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`  Generating... (attempt ${attempt + 1})`);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API ${res.status}: ${errText.slice(0, 200)}`);
      }

      const json = await res.json();

      // Extract image from response (same pattern as shoe-designer-studio)
      let outputImage = null;
      let outputText = null;

      for (const candidate of json.candidates || []) {
        for (const part of candidate.content?.parts || []) {
          if (part.inlineData) outputImage = part.inlineData.data;
          if (part.text) outputText = part.text;
        }
        if (outputImage) break;
      }

      if (!outputImage) {
        if (outputText) console.log(`  Model text: ${outputText.slice(0, 100)}`);
        throw new Error('No image in response');
      }

      return outputImage;
    } catch (err) {
      console.warn(`  Attempt ${attempt + 1} failed: ${err.message}`);
      if (attempt < retries) {
        const delay = 3000 * Math.pow(2, attempt);
        console.log(`  Retrying in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

function saveImage(base64Data, filename) {
  const buffer = Buffer.from(base64Data, 'base64');
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`  Saved: ${filePath} (${(buffer.length / 1024).toFixed(0)}KB)`);
  return filePath;
}

// Image generation tasks
const TASKS = [
  {
    name: 'hero-classico',
    filename: 'hero-classico.png',
    refs: [REF_IMAGES.pistacchio],
    prompt: `Generate a professional food photography image of an Italian PANETTONE CLASSICO (traditional Milan Christmas cake).
The panettone should be whole, tall and domed, with golden-brown crust, sitting on an elegant dark marble surface.
Warm, moody lighting from the left side. Shallow depth of field.
The background should be dark and atmospheric with warm tones.
Style: editorial food photography, luxury artisan bakery aesthetic.
NO text, NO logos. Just the product. High resolution, photorealistic.`,
  },
  {
    name: 'hero-pistacchio',
    filename: 'hero-pistacchio.png',
    refs: [REF_IMAGES.pistacchio, REF_IMAGES.pistacchioPhoto],
    prompt: `Using this pistachio panettone as reference, generate a stunning food photography image showing the SAME pistachio panettone, sliced to reveal the pistachio cream filling inside.
Place it on an elegant surface with scattered pistachios around it.
Warm golden lighting, shallow depth of field, dark moody background.
Style: editorial food photography, luxury Italian patisserie.
Keep the exact same look of the panettone in the reference - golden crust, green pistachio cream filling, pistachios on top.
NO text, NO logos. Photorealistic.`,
  },
  {
    name: 'hero-cioccolato',
    filename: 'hero-cioccolato.png',
    refs: [REF_IMAGES.pistacchio],
    prompt: `Generate a professional food photography image of an Italian PANETTONE AL CIOCCOLATO (triple chocolate panettone).
The panettone should be cut in half to reveal dark chocolate chunks, milk chocolate swirls, and gianduja inside the fluffy dough.
Rich dark chocolate ganache drizzle on top with cocoa powder dusting.
Place on a dark wood surface with broken chocolate pieces scattered around.
Dramatic dark lighting, warm tones, shallow depth of field.
Style: luxury chocolate advertising, editorial food photography.
NO text, NO logos. Photorealistic.`,
  },
  {
    name: 'product-classico',
    filename: 'product-classico.png',
    refs: [REF_IMAGES.box],
    prompt: `Generate a clean product photography image of an Italian PANETTONE CLASSICO (traditional).
The panettone is whole, tall domed shape, golden-brown crust with a slight crack on top.
Clean white/light background for e-commerce style.
Soft, even lighting. The panettone sits in its traditional brown paper baking mold (pirottino).
Professional product photography, clean and minimal.
NO text, NO logos, NO packaging. Just the panettone on white background. Photorealistic.`,
  },
  {
    name: 'product-pistacchio',
    filename: 'product-pistacchio.png',
    refs: [REF_IMAGES.pistacchio, REF_IMAGES.pistacchioPhoto],
    prompt: `Using this pistachio panettone as style reference, generate a product photography image of the SAME panettone.
Show it from a slightly different angle - 3/4 view, with the cut side visible showing the pistachio cream filling.
Clean light background, professional product photography lighting.
Keep the exact same visual style: golden crust, vivid green pistachio cream, scattered pistachios on top.
NO text, NO logos. Clean product shot. Photorealistic.`,
  },
  {
    name: 'product-cioccolato',
    filename: 'product-cioccolato.png',
    refs: [REF_IMAGES.pistacchio],
    prompt: `Generate a product photography image of a PANETTONE AL TRIPLO CIOCCOLATO.
Cut in half showing the inside: dark chocolate chunks, cocoa-infused dough, chocolate cream filling.
Glossy dark chocolate ganache on top. In traditional brown paper baking mold.
Clean light background, professional product photography.
Rich brown and dark chocolate colors dominate.
NO text, NO logos. Clean product shot on light background. Photorealistic.`,
  },
  {
    name: 'patisserie-1',
    filename: 'patisserie-colomba.png',
    refs: [],
    prompt: `Generate a professional food photography image of an Italian COLOMBA PASQUALE (Easter dove-shaped cake).
The colomba has its distinctive dove shape, covered with pearl sugar and almonds on top.
Golden brown, fluffy texture visible. Sitting on rustic linen cloth.
Warm natural lighting, artisan bakery aesthetic.
NO text, NO logos. Photorealistic editorial food photography.`,
  },
  {
    name: 'patisserie-2',
    filename: 'patisserie-lievitati.png',
    refs: [],
    prompt: `Generate a professional food photography image of an Italian artisan bakery display.
Show an elegant arrangement of various LIEVITATI (risen pastries): pandoro, brioche, focaccia veneziana.
Warm golden tones, rustic-elegant setting with wooden shelves.
Moody warm lighting, editorial style.
NO text, NO logos. Luxury artisan bakery aesthetic. Photorealistic.`,
  },
];

// Main execution
async function main() {
  console.log('=== Dimensione Dolce Image Generator ===\n');

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Check reference images
  console.log('Reference images:');
  for (const [key, refPath] of Object.entries(REF_IMAGES)) {
    const exists = fs.existsSync(refPath);
    console.log(`  ${key}: ${exists ? 'OK' : 'MISSING'} — ${refPath}`);
  }
  console.log('');

  const results = [];

  for (const task of TASKS) {
    console.log(`[${task.name}]`);
    try {
      const base64 = await generateImage(task.prompt, task.refs);
      saveImage(base64, task.filename);
      results.push({ name: task.name, status: 'OK', filename: task.filename });
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      results.push({ name: task.name, status: 'FAILED', error: err.message });
    }
    console.log('');
    // Small delay between requests to avoid rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n=== Results ===');
  for (const r of results) {
    console.log(`  ${r.status === 'OK' ? '✓' : '✗'} ${r.name}: ${r.status}`);
  }
}

main().catch(console.error);

#!/usr/bin/env node
/**
 * Dimensione Dolce — Vetrina Image Generator
 * Takes amateur pastry photos and generates professional studio versions via Gemini
 */

import fs from 'fs';
import path from 'path';

const API_KEY = 'AIzaSyBv3Kgb_fuswzHr8IXbvcSKMV1jOxnbxr4';
const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const SOURCE_DIR = path.join(import.meta.dirname, 'assets', 'img', 'source-photos');
const OUTPUT_DIR = path.join(import.meta.dirname, 'assets', 'img');

function readImageAsBase64(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  return { data: buffer.toString('base64'), mimeType };
}

const STYLE_PROMPT = `You are a world-class food photographer. I'm giving you an amateur photo of an Italian pastry product.
Generate a NEW professional studio photograph of THIS EXACT SAME product with these specifications:
- KEEP the exact same pastry/product shown in the reference — same shape, same colors, same decorations
- Professional food photography studio setup
- Dark moody background (dark brown or black surface, like slate or dark marble)
- Dramatic side lighting from the left, warm golden tones
- Shallow depth of field, the product is sharp, background softly blurred
- Aspect ratio: landscape 16:10
- The product should be centered and be the hero of the image
- Add subtle atmosphere: a few crumbs, a dusting, or a complementary ingredient nearby
- Style: luxury Italian patisserie, editorial food photography level
- NO text, NO logos, NO watermarks
- Photorealistic, high resolution`;

async function generateImage(prompt, referenceImagePath, retries = 2) {
  const parts = [];

  // Add reference image
  try {
    const img = readImageAsBase64(referenceImagePath);
    parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
  } catch (e) {
    console.warn(`  Warning: Could not read ${referenceImagePath}: ${e.message}`);
  }

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
        throw new Error(`API ${res.status}: ${errText.slice(0, 300)}`);
      }

      const json = await res.json();

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
        if (outputText) console.log(`  Model text: ${outputText.slice(0, 150)}`);
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

// Vetrina tasks: source photo -> output filename + specific description
const TASKS = [
  {
    name: 'Pesca',
    source: 'WhatsApp Image 2026-02-18 at 12.04.49.jpeg',
    output: 'vetrina-pesca.png',
    extra: 'This is a "Pesca" — a classic Italian peach-shaped pastry with orange/peach glaze dome on a sponge base. Keep the exact peach shape and glossy glaze.',
  },
  {
    name: 'Sfera Cioccolato',
    source: 'WhatsApp Image 2026-02-18 at 12.04.40.jpeg',
    output: 'vetrina-sfera-cioccolato.png',
    extra: 'This is a dark chocolate sphere/shell dessert with orange/mango filling visible on top, and white chocolate curls. Keep the dramatic chocolate textures.',
  },
  {
    name: 'Croissant Sfogliati',
    source: 'WhatsApp Image 2026-02-18 at 12.02.58.jpeg',
    output: 'vetrina-cornetti.png',
    extra: 'These are Italian croissants/cornetti showing the beautiful laminated layers (sfogliatura). Show 2-3 croissants to highlight the spiral layered pattern. Golden, buttery, glossy.',
  },
  {
    name: 'Monoporzione Stratificata',
    source: 'WhatsApp Image 2026-02-18 at 12.04.44.jpeg',
    output: 'vetrina-monoporzione.png',
    extra: 'This is a layered square monoporzione dessert with red fruit glaze on top, cream layer, yellow fruit layer, and nut/biscuit base, topped with a pistachio. Keep the precise geometric layers.',
  },
  {
    name: 'Crostatina di Mele',
    source: 'WhatsApp Image 2026-02-18 at 12.03.00.jpeg',
    output: 'vetrina-crostatina-mele.png',
    extra: 'This is an apple tartlet (crostatina di mele) with caramelized apple cubes arranged on top and gold leaf decoration. Keep the warm golden caramel tones.',
  },
  {
    name: 'Brioche al Limone',
    source: 'WhatsApp Image 2026-02-18 at 12.02.55.jpeg',
    output: 'vetrina-brioche.png',
    extra: 'These are sugar-dusted brioche/babà with lemon curd topping, baked in fluted molds. Show 2-3 pieces. Keep the powdered sugar texture and the yellow lemon curd on top.',
  },
  {
    name: 'Torta alle Ciliegie',
    source: 'WhatsApp Image 2026-02-18 at 12.02.53.jpeg',
    output: 'vetrina-torta-ciliegie.png',
    extra: 'This is a cherry tart/cake with glossy red cherries and delicate white sugar flower decorations with green stems. Keep the vivid red color and the flower decorations.',
  },
  {
    name: 'Torta Funghetti',
    source: 'WhatsApp Image 2026-02-18 at 12.02.53 (1).jpeg',
    output: 'vetrina-torta-funghetti.png',
    extra: 'This is a white velvet-textured mousse cake with a wavy/ridged surface, decorated with whimsical red-and-white mushroom decorations. Keep the soft velvet texture and the playful mushroom decorations.',
  },
];

async function main() {
  console.log('=== Dimensione Dolce — Vetrina Image Generator ===\n');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Verify source photos exist
  console.log('Source photos:');
  for (const task of TASKS) {
    const srcPath = path.join(SOURCE_DIR, task.source);
    const exists = fs.existsSync(srcPath);
    console.log(`  ${exists ? 'OK' : 'MISSING'} ${task.name}: ${task.source}`);
  }
  console.log('');

  const results = [];

  for (const task of TASKS) {
    console.log(`[${task.name}]`);
    const srcPath = path.join(SOURCE_DIR, task.source);

    if (!fs.existsSync(srcPath)) {
      console.error(`  SKIPPED: source not found`);
      results.push({ name: task.name, status: 'SKIPPED' });
      continue;
    }

    try {
      const prompt = `${STYLE_PROMPT}\n\nSpecific product details: ${task.extra}`;
      const base64 = await generateImage(prompt, srcPath);
      saveImage(base64, task.output);
      results.push({ name: task.name, status: 'OK', output: task.output });
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      results.push({ name: task.name, status: 'FAILED', error: err.message });
    }

    console.log('');
    // Delay between requests to avoid rate limits
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Results ===');
  for (const r of results) {
    console.log(`  ${r.status === 'OK' ? '✓' : '✗'} ${r.name}: ${r.status}${r.output ? ` → ${r.output}` : ''}`);
  }
}

main().catch(console.error);

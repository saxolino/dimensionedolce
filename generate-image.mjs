#!/usr/bin/env node
/**
 * Dimensione Dolce — Image Generator via Gemini
 *
 * Usage:
 *   node generate-image.mjs "panettone al pistacchio su tavolo di marmo scuro" --name hero-pistacchio
 *   node generate-image.mjs "laboratorio di pasticceria milanese" --name lab --model pro
 *
 * Options:
 *   --name    Nome file di output (senza estensione)       default: "generated"
 *   --model   flash | pro                                   default: "flash"
 *   --size    Dimensione: "1024x1024", "1536x1024", etc.   default: "1536x1024"
 *   --out     Cartella di output                            default: "assets/img/generated"
 *
 * API Key:
 *   export GEMINI_API_KEY="la-tua-chiave"
 *   oppure crea .env con GEMINI_API_KEY=la-tua-chiave
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

// --- Load .env if exists ---
const envPath = resolve(import.meta.dirname, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.+?)\s*$/);
    if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('\n  Errore: GEMINI_API_KEY non trovata.\n');
  console.error('  Imposta la variabile:');
  console.error('    export GEMINI_API_KEY="la-tua-chiave"\n');
  console.error('  Oppure crea un file .env nella root del progetto:');
  console.error('    GEMINI_API_KEY=la-tua-chiave\n');
  process.exit(1);
}

// --- Parse args ---
const args = process.argv.slice(2);
const prompt = args.filter(a => !a.startsWith('--')).join(' ');

if (!prompt) {
  console.error('\n  Usage: node generate-image.mjs "descrizione immagine" [--name nome] [--model flash|pro]\n');
  process.exit(1);
}

function getArg(name, defaultVal) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultVal;
}

const name = getArg('name', 'generated');
const modelTier = getArg('model', 'flash');
const outDir = getArg('out', 'assets/img/generated');

const MODELS = {
  flash: 'gemini-2.5-flash-image',
  pro: 'gemini-3-pro-image-preview',
};

const model = MODELS[modelTier] || MODELS.flash;

// --- Ensure output dir ---
const outputPath = resolve(import.meta.dirname, outDir);
mkdirSync(outputPath, { recursive: true });

// --- Style prefix for consistent luxury pastry aesthetic ---
const STYLE_PREFIX = `Professional food photography style. Luxury artisan Italian pastry shop aesthetic.
Dark moody lighting, shallow depth of field, warm tones. Shot on medium format camera.
High-end editorial quality, magazine cover worthy. No text, no watermarks.`;

const fullPrompt = `${STYLE_PREFIX}\n\n${prompt}`;

// --- Generate via Gemini REST API ---
console.log(`\n  Generazione immagine...`);
console.log(`  Modello: ${model}`);
console.log(`  Prompt: ${prompt}`);
console.log(`  Output: ${outDir}/${name}.png\n`);

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

const body = {
  contents: [{
    parts: [{ text: fullPrompt }]
  }],
  generationConfig: {
    responseModalities: ['TEXT', 'IMAGE'],
  }
};

try {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`  Errore API (${res.status}): ${errText}`);
    process.exit(1);
  }

  const data = await res.json();

  if (!data.candidates?.[0]?.content?.parts) {
    console.error('  Nessuna risposta dal modello.');
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  let imageCount = 0;

  for (const part of data.candidates[0].content.parts) {
    if (part.inlineData) {
      const ext = part.inlineData.mimeType?.includes('png') ? 'png' : 'jpg';
      const suffix = imageCount > 0 ? `-${imageCount}` : '';
      const filename = `${name}${suffix}.${ext}`;
      const filepath = join(outputPath, filename);

      const buffer = Buffer.from(part.inlineData.data, 'base64');
      writeFileSync(filepath, buffer);

      const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
      console.log(`  Salvata: ${outDir}/${filename} (${sizeMB} MB)`);
      imageCount++;
    }

    if (part.text) {
      console.log(`  Gemini: ${part.text}`);
    }
  }

  if (imageCount === 0) {
    console.error('  Nessuna immagine generata nella risposta.');
    console.error('  Parti ricevute:', data.candidates[0].content.parts.map(p => Object.keys(p)));
  } else {
    console.log(`\n  ${imageCount} immagine/i generata/e con successo!\n`);
  }

} catch (err) {
  console.error(`  Errore: ${err.message}`);
  process.exit(1);
}

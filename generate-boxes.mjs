import fs from 'fs';
import path from 'path';

const API_KEY = 'AIzaSyBv3Kgb_fuswzHr8IXbvcSKMV1jOxnbxr4';
const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const OUT_DIR = '/Users/torresi.studio/dimensione-dolce/assets/img';

const REF_IMAGE_PATH = '/Volumes/T7 Shield/PROGETTI NOVEMBRE 2024/Dimensione Dolce Brand_Folder/Links/Pistacchio.png';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImage(name, prompt, refImagePath) {
  console.log(`\n--- Generating ${name} ---`);

  const parts = [];

  if (refImagePath) {
    const imgBuffer = fs.readFileSync(refImagePath);
    const base64 = imgBuffer.toString('base64');
    parts.push({ inlineData: { mimeType: 'image/png', data: base64 } });
    console.log(`  Reference image loaded (${(imgBuffer.length / 1024).toFixed(0)} KB)`);
  }

  parts.push({ text: prompt });

  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: { temperature: 0.7, responseModalities: ['IMAGE', 'TEXT'] }
  };

  console.log(`  Sending request to Gemini...`);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`  ERROR ${res.status}: ${errText.substring(0, 300)}`);
    return false;
  }

  const json = await res.json();

  let img = null;
  let textResponse = '';
  for (const c of json.candidates || []) {
    for (const p of c.content?.parts || []) {
      if (p.inlineData) {
        img = p.inlineData.data;
      }
      if (p.text) {
        textResponse += p.text;
      }
    }
  }

  if (img) {
    const outPath = path.join(OUT_DIR, name);
    fs.writeFileSync(outPath, Buffer.from(img, 'base64'));
    const fileSize = fs.statSync(outPath).size;
    console.log(`  Saved: ${outPath} (${(fileSize / 1024).toFixed(0)} KB)`);
    if (textResponse) console.log(`  Model note: ${textResponse.substring(0, 150)}`);
    return true;
  } else {
    console.error(`  No image returned.`);
    if (textResponse) console.error(`  Model response: ${textResponse.substring(0, 300)}`);
    if (json.candidates?.[0]?.finishReason) {
      console.error(`  Finish reason: ${json.candidates[0].finishReason}`);
    }
    return false;
  }
}

async function main() {
  console.log('Dimensione Dolce - Box Mockup Generator');
  console.log('========================================');

  const tasks = [
    {
      name: 'box-pistacchio.png',
      ref: REF_IMAGE_PATH,
      prompt: "Using this packaging design reference with the olive green color and 'Dimensione Dolce' branding, generate a photorealistic 3D mockup of an elegant cube-shaped panettone gift box. The box has an olive green (#a8b060) upper section and white lower section with the Dimensione Dolce logo. Show the closed box from a 3/4 angle view on a clean light gray background. Luxury product photography, soft shadows, studio lighting. NO text overlay. Photorealistic."
    },
    {
      name: 'box-classico.png',
      ref: null,
      prompt: "Generate a photorealistic 3D mockup of an elegant cube-shaped panettone gift box. The box has a warm gold (#c6a36a) upper section and cream white lower section. Minimalist luxury design with subtle embossed circular logo. Show the closed box from a 3/4 angle view on a clean light gray background. Luxury product photography, soft shadows, studio lighting. Same style as a premium Italian panettone brand. NO text. Photorealistic."
    },
    {
      name: 'box-cioccolato.png',
      ref: null,
      prompt: "Generate a photorealistic 3D mockup of an elegant cube-shaped panettone gift box. The box has a rich dark chocolate brown (#52321f) upper section and cream beige lower section. Minimalist luxury design with subtle embossed circular logo. Show the closed box from a 3/4 angle view on a clean light gray background. Luxury product photography, soft shadows, studio lighting. Same style as a premium Italian panettone brand. NO text. Photorealistic."
    },
    {
      name: 'box-trio.png',
      ref: null,
      prompt: "Generate a photorealistic 3D mockup of THREE elegant cube-shaped panettone gift boxes arranged together in a group. From left to right: gold box (#c6a36a top, white bottom), olive green box (#a8b060 top, white bottom), dark chocolate brown box (#52321f top, cream bottom). They are slightly overlapping, arranged at angles. A gold ribbon ties them together. Clean light gray background. Luxury gift set product photography, soft shadows, studio lighting. Premium Italian panettone brand aesthetic. NO text. Photorealistic."
    }
  ];

  let success = 0;
  let fail = 0;

  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    const ok = await generateImage(t.name, t.prompt, t.ref);
    if (ok) success++; else fail++;

    if (i < tasks.length - 1) {
      console.log('  Waiting 2s before next request...');
      await sleep(2000);
    }
  }

  console.log(`\n========================================`);
  console.log(`Done. ${success} succeeded, ${fail} failed.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

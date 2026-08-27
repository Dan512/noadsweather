#!/usr/bin/env node
// Renders Google's Noto Animated Emoji (CC BY 4.0) into 16-frame 128px
// sprite-sheet PNGs + a manifest, committed under img/emoji/. Run once
// (or when changing the emoji set): npm install && node build-sprites.js
// The live site serves only the committed output — it never contacts Google.
'use strict';
const fs = require('fs');
const path = require('path');
const { GifReader } = require('omggif');
const { PNG } = require('pngjs');

const EMOJI = [
    { cp: '1f975', slug: 'hot' },
    { cp: '1fae0', slug: 'melting' },
    { cp: '1f976', slug: 'cold' },
    { cp: '1f31e', slug: 'sun' },
    { cp: '1f60e', slug: 'cool' },
    { cp: '1f327_fe0f', slug: 'rain' },
    { cp: '1f329_fe0f', slug: 'storm' },
    { cp: '26a1', slug: 'zap' },
    { cp: '2744_fe0f', slug: 'snow' },
    { cp: '1f308', slug: 'rainbow' },
    { cp: '1f32a_fe0f', slug: 'tornado' },
    { cp: '1f927', slug: 'sneeze' },
];

const SRC = 512, CELL = 128, COLS = 4, FRAMES = 16; // 4x4 sheet = 512x512
// FRAMES must stay an exact multiple of COLS: sheet height = CELL * (FRAMES / COLS).
const OUT_DIR = path.join(__dirname, '..', '..', 'img', 'emoji');

async function fetchGif(cp) {
    const url = `https://fonts.gstatic.com/s/e/notoemoji/latest/${cp}/512.gif`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
}

// Box-average 512 -> 128 (exact 4x integer factor) on RGBA, alpha-weighted.
function downscale(src) {
    const out = Buffer.alloc(CELL * CELL * 4);
    const F = SRC / CELL; // 4
    for (let y = 0; y < CELL; y++) {
        for (let x = 0; x < CELL; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let dy = 0; dy < F; dy++) {
                for (let dx = 0; dx < F; dx++) {
                    const i = (((y * F + dy) * SRC) + (x * F + dx)) * 4;
                    const al = src[i + 3];
                    r += src[i] * al; g += src[i + 1] * al; b += src[i + 2] * al; a += al;
                }
            }
            const o = (y * CELL + x) * 4;
            out[o]     = a ? Math.round(r / a) : 0;
            out[o + 1] = a ? Math.round(g / a) : 0;
            out[o + 2] = a ? Math.round(b / a) : 0;
            out[o + 3] = Math.round(a / (F * F));
        }
    }
    return out;
}

async function buildOne(e) {
    const gif = new GifReader(await fetchGif(e.cp));
    if (gif.width !== SRC || gif.height !== SRC) throw new Error(`${e.slug}: unexpected size ${gif.width}x${gif.height}`);
    const n = gif.numFrames();
    let totalDelayMs = 0;
    for (let i = 0; i < n; i++) totalDelayMs += gif.frameInfo(i).delay * 10;

    // Decode ALL frames in order onto one accumulating buffer (GIF frames
    // can be partial patches), grabbing a downscaled copy at 16 evenly
    // spaced indices. When n < FRAMES, multiple output slots can round to
    // the same source frame index, so this is a one-to-many mapping —
    // srcIdx -> [slot, slot, ...] — not a 1:1 lookup.
    const slotsBySrcIdx = new Map(); // srcFrameIndex -> [sheetSlot, ...]
    for (let s = 0; s < FRAMES; s++) {
        const srcIdx = Math.round(s * (n - 1) / (FRAMES - 1));
        if (!slotsBySrcIdx.has(srcIdx)) slotsBySrcIdx.set(srcIdx, []);
        slotsBySrcIdx.get(srcIdx).push(s);
    }
    const acc = Buffer.alloc(SRC * SRC * 4);
    const sheet = new PNG({ width: CELL * COLS, height: CELL * (FRAMES / COLS) });
    for (let i = 0; i < n; i++) {
        // decodeAndBlitFrameRGBA only writes opaque pixels within this
        // frame's sub-rect (transparent source pixels are skipped, per the
        // GIF spec), so acc naturally accumulates as a running composite.
        gif.decodeAndBlitFrameRGBA(i, acc);
        const slots = slotsBySrcIdx.get(i);
        if (slots) {
            const cell = downscale(acc); // once per source frame, however many slots it fills
            for (const slot of slots) {
                const cx = (slot % COLS) * CELL, cy = Math.floor(slot / COLS) * CELL;
                for (let y = 0; y < CELL; y++) {
                    cell.copy(sheet.data, ((cy + y) * sheet.width + cx) * 4, y * CELL * 4, (y + 1) * CELL * 4);
                }
            }
        }
        // Apply this frame's disposal method to prep the canvas for the
        // NEXT frame. These Noto GIFs use disposal 2 ("restore to
        // background") on almost every frame with a sub-rect smaller than
        // the canvas; without this, stale opaque pixels outside the next
        // frame's rect persist in acc and smear across the animation.
        // Disposal 0/1 ("do not dispose") means leave acc as-is.
        const fi = gif.frameInfo(i);
        if (fi.disposal === 2) {
            for (let y = fi.y; y < fi.y + fi.height; y++) {
                acc.fill(0, (y * SRC + fi.x) * 4, (y * SRC + fi.x + fi.width) * 4);
            }
        } else if (fi.disposal === 3) {
            throw new Error(`${e.slug}: frame ${i} uses disposal 3 (restore to previous), not handled`);
        }
    }
    fs.writeFileSync(path.join(OUT_DIR, `${e.slug}.png`), PNG.sync.write(sheet));
    const delayMs = Math.max(60, Math.min(200, Math.round(totalDelayMs / FRAMES)));
    console.log(`${e.slug}: ${n} src frames, loop ${totalDelayMs}ms -> delay ${delayMs}ms`);
    return { cp: e.cp, file: `${e.slug}.png`, frames: FRAMES, cell: CELL, cols: COLS, delayMs };
}

(async () => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const manifest = {};
    for (const e of EMOJI) manifest[e.slug] = await buildOne(e);
    fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Wrote ${Object.keys(manifest).length} sheets + manifest to ${OUT_DIR}`);
})().catch(err => { console.error(err); process.exit(1); });

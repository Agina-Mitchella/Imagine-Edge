import fs from 'fs';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let srcPos = 0;
  let dstPos = 0;
  for (let y = 0; y < height; y++) {
    scanlines[dstPos++] = 0; // filter type 0
    rgbaBuffer.copy(scanlines, dstPos, srcPos, srcPos + width * 4);
    srcPos += width * 4;
    dstPos += width * 4;
  }

  const idatData = zlib.deflateSync(scanlines);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function decodePNG(buffer) {
  let offset = 8;
  let width = 0, height = 0;
  const idat = [];
  while (offset < buffer.length) {
    const len = buffer.readUInt32BE(offset);
    const type = buffer.slice(offset + 4, offset + 8).toString('ascii');
    if (type === 'IHDR') {
      width = buffer.readUInt32BE(offset + 8);
      height = buffer.readUInt32BE(offset + 12);
    } else if (type === 'IDAT') {
      idat.push(buffer.slice(offset + 8, offset + 8 + len));
    }
    offset += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idat));
  const bpp = 4;
  const raw = Buffer.alloc(width * height * 4);
  let srcPos = 0;
  for (let y = 0; y < height; y++) {
    const filter = decompressed[srcPos++];
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < bpp; c++) {
        const val = decompressed[srcPos++];
        const destIdx = (y * width + x) * bpp + c;
        const left = x > 0 ? raw[((y * width + (x - 1)) * bpp) + c] : 0;
        const up = y > 0 ? raw[(((y - 1) * width + x) * bpp) + c] : 0;
        const upLeft = (x > 0 && y > 0) ? raw[(((y - 1) * width + (x - 1)) * bpp) + c] : 0;
        let recon = 0;
        if (filter === 0) recon = val;
        else if (filter === 1) recon = (val + left) & 0xff;
        else if (filter === 2) recon = (val + up) & 0xff;
        else if (filter === 3) recon = (val + Math.floor((left + up) / 2)) & 0xff;
        else if (filter === 4) {
          const p = left + up - upLeft;
          const pa = Math.abs(p - left);
          const pb = Math.abs(p - up);
          const pc = Math.abs(p - upLeft);
          let pr = (pa <= pb && pa <= pc) ? left : (pb <= pc ? up : upLeft);
          recon = (val + pr) & 0xff;
        }
        raw[destIdx] = recon;
      }
    }
  }
  return { width, height, raw };
}

const inputPath = 'public/assets/aistudio/Imaginedge_logo_png_8a71b53f.png';
const { width, height, raw } = decodePNG(fs.readFileSync(inputPath));

// Height of wordmark without tagline is 304px
const cropHeight = 304;

// 1. White wordmark with RED "e" circle (for dark theme)
const whiteWithRedE = Buffer.alloc(width * cropHeight * 4);
// 2. All pure white (for crimson theme)
const allWhite = Buffer.alloc(width * cropHeight * 4);
// 3. Original crimson wordmark without tagline (for light theme)
const crimsonOnly = Buffer.alloc(width * cropHeight * 4);

// Connected component or spatial bounding for 'e':
// Let's check flood-fill or coordinates for the large 'e'
// The 'e' is between x=525 and x=715, y=45 and y=250.
// Let's accurately identify pixels belonging to the big 'e':
// The word 'Imagin' ends before x=520.
// The letter 'd' begins around x=705, but 'd' stem is high and right.
// Let's use flood fill from the centre of the 'e' circle (e.g. x=610, y=55).
const visited = new Uint8Array(width * cropHeight);
const isE = new Uint8Array(width * cropHeight);

function floodFillE(startX, startY) {
  const queue = [[startX, startY]];
  visited[startY * width + startX] = 1;
  while (queue.length > 0) {
    const [cx, cy] = queue.pop();
    isE[cy * width + cx] = 1;

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 520 && nx <= 710 && ny >= 40 && ny < 260) {
        const idx = ny * width + nx;
        if (!visited[idx] && raw[idx * 4 + 3] > 10) {
          visited[idx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }
}

// Find a solid pixel on top of 'e'
for (let y = 45; y < 70; y++) {
  if (raw[(y * width + 610) * 4 + 3] > 200) {
    floodFillE(610, y);
    break;
  }
}

for (let y = 0; y < cropHeight; y++) {
  for (let x = 0; x < width; x++) {
    const srcIdx = (y * width + x) * 4;
    const dstIdx = srcIdx;
    const alpha = raw[srcIdx + 3];

    // Crimson only
    crimsonOnly[dstIdx] = raw[srcIdx];
    crimsonOnly[dstIdx + 1] = raw[srcIdx + 1];
    crimsonOnly[dstIdx + 2] = raw[srcIdx + 2];
    crimsonOnly[dstIdx + 3] = alpha;

    // All white
    allWhite[dstIdx] = 255;
    allWhite[dstIdx + 1] = 255;
    allWhite[dstIdx + 2] = 255;
    allWhite[dstIdx + 3] = alpha;

    // White with red 'e' (#B52026 => 181, 32, 38, or #E52329 => 229, 35, 41)
    if (isE[y * width + x]) {
      whiteWithRedE[dstIdx] = 229;
      whiteWithRedE[dstIdx + 1] = 35;
      whiteWithRedE[dstIdx + 2] = 41;
      whiteWithRedE[dstIdx + 3] = alpha;
    } else {
      whiteWithRedE[dstIdx] = 255;
      whiteWithRedE[dstIdx + 1] = 255;
      whiteWithRedE[dstIdx + 2] = 255;
      whiteWithRedE[dstIdx + 3] = alpha;
    }
  }
}

fs.writeFileSync('public/assets/aistudio/logo_header_dark.png', encodePNG(width, cropHeight, whiteWithRedE));
fs.writeFileSync('public/assets/aistudio/logo_header_crimson.png', encodePNG(width, cropHeight, allWhite));
fs.writeFileSync('public/assets/aistudio/logo_header_light.png', encodePNG(width, cropHeight, crimsonOnly));

console.log('Successfully generated themed header logo PNGs!');

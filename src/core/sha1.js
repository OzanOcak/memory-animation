// Step 2: Text to binary
export function textToBinary(message) {
  let binary = "";
  for (let i = 0; i < message.length; i++) {
    binary += message.charCodeAt(i).toString(2).padStart(8, "0");
  }
  return binary;
}

// Step 3: Padding
export function padMessage(binary) {
  const originalLength = binary.length;
  const withOne = binary + "1";

  const targetMod = 448;
  const blockSize = 512;
  let currentLength = withOne.length;
  let remainder = currentLength % blockSize;
  let zerosNeeded = (targetMod - remainder + blockSize) % blockSize;

  if (remainder === targetMod) zerosNeeded = blockSize;

  const afterPadding = withOne + "0".repeat(zerosNeeded);
  const lengthBits = originalLength.toString(2).padStart(64, "0");
  const finalBlock = afterPadding + lengthBits;

  return {
    finalBlock,
    originalLength,
    withOne,
    zerosNeeded,
    afterPadding,
    lengthBits,
  };
}

// Step 4: Split into chunks (for display)
export function splitChunks(padded, chunkSize = 8) {
  const chunks = [];
  for (let i = 0; i < padded.length; i += chunkSize) {
    chunks.push(padded.slice(i, i + chunkSize));
  }
  return chunks;
}

// Helper: Left rotate
export function rotl(x, n) {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

// Step 5: Initialize hash values
export function initHashReal() {
  return {
    H0: 0x67452301,
    H1: 0xefcdab89,
    H2: 0x98badcfe,
    H3: 0x10325476,
    H4: 0xc3d2e1f0,
  };
}

// Step 6: Message schedule
export function createMessageSchedule(words, targetWords = 80) {
  const W = new Array(targetWords);
  for (let i = 0; i < words.length && i < 16; i++) W[i] = words[i];
  for (let i = words.length; i < 16; i++) W[i] = 0;
  for (let i = 16; i < targetWords; i++) {
    const val = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
    W[i] = rotl(val, 1);
  }
  return W;
}

// Step 7: Copy to variables
export function copyHashToVariables(hash) {
  return {
    a: hash.H0 >>> 0,
    b: hash.H1 >>> 0,
    c: hash.H2 >>> 0,
    d: hash.H3 >>> 0,
    e: hash.H4 >>> 0,
  };
}

// K constants
export const K = [
  0x5a827999, 0x5a827999, 0x5a827999, 0x5a827999, 0x5a827999, 0x5a827999,
  0x5a827999, 0x5a827999, 0x5a827999, 0x5a827999, 0x5a827999, 0x5a827999,
  0x5a827999, 0x5a827999, 0x5a827999, 0x5a827999, 0x5a827999, 0x5a827999,
  0x5a827999, 0x5a827999, 0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1,
  0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1,
  0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1,
  0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1, 0x6ed9eba1, 0x8f1bbcdc, 0x8f1bbcdc,
  0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc,
  0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc,
  0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc, 0x8f1bbcdc,
  0xca62c1d6, 0xca62c1d6, 0xca62c1d6, 0xca62c1d6, 0xca62c1d6, 0xca62c1d6,
  0xca62c1d6, 0xca62c1d6, 0xca62c1d6, 0xca62c1d6, 0xca62c1d6, 0xca62c1d6,
  0xca62c1d6, 0xca62c1d6, 0xca62c1d6, 0xca62c1d6, 0xca62c1d6, 0xca62c1d6,
  0xca62c1d6, 0xca62c1d6,
];

export function getF(b, c, d, round) {
  if (round < 20) return (b & c) | (~b & d);
  if (round < 40) return b ^ c ^ d;
  if (round < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

export function processRound(vars, wValue, round) {
  const { a, b, c, d, e } = vars;
  const f = getF(b, c, d, round);
  const k = K[round];
  const temp = (rotl(a, 5) + f + e + k + wValue) >>> 0;
  return {
    a: temp,
    b: a,
    c: rotl(b, 30),
    d: c,
    e: d,
  };
}

export function processAllRounds(initialVars, messageSchedule) {
  let vars = { ...initialVars };
  const roundsHistory = [];
  for (let i = 0; i < 80; i++) {
    vars = processRound(vars, messageSchedule[i], i);
    roundsHistory.push({ round: i, ...vars, wValue: messageSchedule[i] });
  }
  return { finalVars: vars, roundsHistory };
}

// Step 9: Add to hash
export function addToHash(originalHash, finalVars) {
  return {
    H0: (originalHash.H0 + finalVars.a) >>> 0,
    H1: (originalHash.H1 + finalVars.b) >>> 0,
    H2: (originalHash.H2 + finalVars.c) >>> 0,
    H3: (originalHash.H3 + finalVars.d) >>> 0,
    H4: (originalHash.H4 + finalVars.e) >>> 0,
  };
}

// Step 11: Final hash
export function finalHashToHex(hash) {
  const toHex = (x) => (x >>> 0).toString(16).padStart(8, "0");
  return (
    toHex(hash.H0) +
    toHex(hash.H1) +
    toHex(hash.H2) +
    toHex(hash.H3) +
    toHex(hash.H4)
  );
}

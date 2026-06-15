// src/store/constants.js
export const GRID_SIZE = 25;
export const TOTAL_BITS = GRID_SIZE * GRID_SIZE;
export const MAX_SAFE_VALUE = 2n ** BigInt(TOTAL_BITS) - 1n;

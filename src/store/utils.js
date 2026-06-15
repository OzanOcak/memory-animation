// src/store/utils.js
import { TOTAL_BITS } from "./constants";

export const get8BitAlignedLength = (bigIntValue) => {
  const binaryStr = bigIntValue.toString(2);
  const length = binaryStr.length;
  return Math.ceil(length / 8) * 8;
};

// Convert any string to binary BigInt
export const stringToBinaryBigInt = (str) => {
  if (!str || str === "") return 0n;

  let binaryString = "";
  for (let i = 0; i < str.length; i++) {
    let charBinary = str.charCodeAt(i).toString(2);
    charBinary = charBinary.padStart(8, "0");
    binaryString += charBinary;
  }

  try {
    return BigInt("0b" + binaryString);
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return 0n;
  }
};

// Convert BigInt to binary array for display
export const bigIntToBinaryArray = (value) => {
  const binaryArray = new Array(TOTAL_BITS).fill(0);
  if (value === 0n) return binaryArray;

  let binaryStr = value.toString(2);
  if (binaryStr.length > TOTAL_BITS) {
    binaryStr = binaryStr.slice(-TOTAL_BITS);
  }
  binaryStr = binaryStr.padStart(TOTAL_BITS, "0");

  for (let i = 0; i < TOTAL_BITS; i++) {
    binaryArray[i] = parseInt(binaryStr[i]);
  }

  return binaryArray;
};

// src/store/sha1Wrapper.js
import {
  textToBinary,
  padMessage,
  splitChunks,
  initHashReal,
  createMessageSchedule,
  copyHashToVariables,
  processAllRounds,
  addToHash,
  finalHashToHex,
  rotl,
  getF,
  K,
} from "../core/sha1";

// Re-export all SHA-1 functions
export {
  textToBinary,
  padMessage,
  splitChunks,
  initHashReal,
  createMessageSchedule,
  copyHashToVariables,
  processAllRounds,
  addToHash,
  finalHashToHex,
  rotl,
  getF,
  K,
};

// Helper function to apply padding and KEEP leading zeros
export const applySha1PaddingToValue = (binaryValue) => {
  // Better: Pass the original length as parameter
  const binaryString = binaryValue.toString(2);
  const paddingResult = padMessage(binaryString);

  // Return the padded string directly instead of converting to BigInt
  return {
    paddedString: paddingResult.finalBlock, // Keep as string to preserve leading zeros
    paddingResult,
    newLength: paddingResult.finalBlock.length,
  };
};

// Alternative: Pass the original binary string
export const applySha1PaddingToString = (binaryString) => {
  const paddingResult = padMessage(binaryString);
  return {
    paddedString: paddingResult.finalBlock,
    paddingResult,
    newLength: paddingResult.finalBlock.length,
  };
};

// src/store/operations.js
import { MAX_SAFE_VALUE } from "./constants";

export const binaryAdd = (a, b) => {
  let result = a + b;
  if (result > MAX_SAFE_VALUE) result = result & MAX_SAFE_VALUE;
  return result;
};

export const binarySubtract = (a, b) => {
  let result = a - b;
  if (result < 0n) result = 0n;
  return result;
};

export const binaryMultiplyByItself = async (currentValue, binaryAddFn) => {
  let result = 0n;
  let tempB = currentValue;
  let tempA = currentValue;

  while (tempB > 0n) {
    if (tempB & 1n) {
      result = binaryAddFn(result, tempA);
    }
    tempA = tempA << 1n;
    tempB = tempB >> 1n;
    if (result > MAX_SAFE_VALUE) result = result & MAX_SAFE_VALUE;
  }

  return result;
};

export const binaryMultiplyByTwo = async (currentValue) => {
  let result = currentValue << 1n;
  if (result > MAX_SAFE_VALUE) result = result & MAX_SAFE_VALUE;
  return result;
};

export const binaryMultiplyByTwenty = async (currentValue, binaryAddFn) => {
  let multiplyBy16 = currentValue << 4n;
  let multiplyBy4 = currentValue << 2n;
  let result = binaryAddFn(multiplyBy16, multiplyBy4);
  if (result > MAX_SAFE_VALUE) result = result & MAX_SAFE_VALUE;
  return result;
};

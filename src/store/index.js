// src/store/index.js
import { create } from "zustand";
import { TOTAL_BITS } from "./constants"; // Import FIRST
import {
  get8BitAlignedLength,
  stringToBinaryBigInt,
  bigIntToBinaryArray,
} from "./utils";
import {
  binaryAdd,
  binarySubtract,
  //binaryMultiplyByItself,
  binaryMultiplyByTwo,
  binaryMultiplyByTwenty,
} from "./operations";
import { steps } from "./steps";
import {
  applySha1PaddingToString,
  //applySha1PaddingToValue,
} from "./sha1Wrapper";

// Make sure TOTAL_BITS is defined before using it
console.log("TOTAL_BITS:", TOTAL_BITS); // Debug: should show 625

const useStore = create((set, get) => ({
  binaryValue: 0n,
  memory: new Array(TOTAL_BITS).fill(0), // Now TOTAL_BITS is defined
  activeBits: new Set(),
  isExecuting: false,
  isAutoRunning: false,
  currentStep: null,
  currentIteration: 0,
  totalIterations: 0,
  inputValue: "",
  currentUsedLength: 0,
  words16: [],
  onStepComplete: null,

  animationSpeed: 50,
  iterationDelay: 800,
  stepDelay: 500,

  steps,

  setInputValue: (value) => {
    const binaryBigInt = stringToBinaryBigInt(value);
    set({
      inputValue: value,
      originalInputBinary: binaryBigInt,
      currentUsedLength: value.length * 8,
    });
  },

  setOnStepComplete: (callback) => set({ onStepComplete: callback }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setIterationDelay: (delay) => set({ iterationDelay: delay }),
  setStepDelay: (delay) => set({ stepDelay: delay }),

  updateBinaryDisplay: (binaryValue) => {
    const binaryArray = bigIntToBinaryArray(binaryValue);
    set({ memory: binaryArray, binaryValue });
  },

  getBinaryFromInput: () => {
    const { inputValue } = get();
    return stringToBinaryBigInt(inputValue);
  },

  animateBitChange: async (oldBinaryArray, newBinaryArray) => {
    const { animationSpeed } = get();

    const changedIndices = [];
    for (let i = 0; i < TOTAL_BITS; i++) {
      if (oldBinaryArray[i] !== newBinaryArray[i]) {
        changedIndices.push(i);
      }
    }

    for (let i = 0; i < changedIndices.length; i++) {
      const bitIndex = changedIndices[i];

      set((state) => ({
        activeBits: new Set([...state.activeBits, bitIndex]),
      }));

      await new Promise((resolve) => setTimeout(resolve, animationSpeed));

      set((state) => {
        const newActive = new Set(state.activeBits);
        newActive.delete(bitIndex);
        return { activeBits: newActive };
      });

      await new Promise((resolve) => setTimeout(resolve, animationSpeed * 0.6));
    }

    set({ memory: newBinaryArray });
    await new Promise((resolve) => setTimeout(resolve, animationSpeed));
  },

  // Add this method before executeStep
  splitIntoWords: async () => {
    const { binaryValue, currentUsedLength } = get();

    // Get the padded binary string (should be 512 bits after step 2)
    const paddedBinary = binaryValue
      .toString(2)
      .padStart(currentUsedLength, "0");

    // Split into 16 words of 32 bits
    const words = [];
    for (let i = 0; i < 16; i++) {
      const start = i * 32;
      const wordBits = paddedBinary.slice(start, start + 32);
      const wordValue = parseInt(wordBits, 2);
      words.push({
        index: i,
        bits: wordBits,
        value: wordValue,
        hex: wordValue.toString(16).padStart(8, "0").toUpperCase(),
      });
    }

    set({ words16: words });

    console.log("16 Words created:", words);
    return words;
  },

  executeStep: async (stepNumber) => {
    const {
      isExecuting,
      binaryValue,
      steps,
      iterationDelay,
      stepDelay,
      onStepComplete,
    } = get();

    if (isExecuting) return;

    const step = steps.find((s) => s.number === stepNumber);
    const iterations = step.iterations;

    set({
      isExecuting: true,
      currentStep: stepNumber,
      currentIteration: 0,
      totalIterations: iterations,
    });

    let currentValue = binaryValue;

    if (stepNumber === 1) {
      const inputBinary = get().getBinaryFromInput();
      const oldBinaryArray = bigIntToBinaryArray(currentValue);
      const newBinaryArray = bigIntToBinaryArray(inputBinary);
      await get().animateBitChange(oldBinaryArray, newBinaryArray);
      currentValue = inputBinary;
      set({ binaryValue: currentValue });
    }

    for (let iteration = 1; iteration <= iterations; iteration++) {
      set({ currentIteration: iteration });

      // eslint-disable-next-line no-useless-assignment
      let newValue = currentValue;
      const oldBinaryArray = bigIntToBinaryArray(currentValue);

      switch (stepNumber) {
        case 2: {
          // Get current binary as string with correct length
          const currentBinary = binaryValue
            .toString(2)
            .padStart(get().currentUsedLength, "0");
          const paddingResult = applySha1PaddingToString(currentBinary);
          newValue = paddingResult.paddedString; // This is a string, not BigInt

          // Convert string to binary array for display
          const newBinaryArray = paddingResult.paddedString
            .split("")
            .map((bit) => parseInt(bit));

          // Pad or trim to TOTAL_BITS
          while (newBinaryArray.length < TOTAL_BITS) newBinaryArray.unshift(0);
          while (newBinaryArray.length > TOTAL_BITS) newBinaryArray.shift();

          await get().animateBitChange(oldBinaryArray, newBinaryArray);

          set({
            paddingInfo: paddingResult.paddingResult,
            currentUsedLength: paddingResult.newLength,
            memory: newBinaryArray,
          });
          break;
        }
        case 3:
          await get().splitIntoWords();
          newValue = currentValue; // No change to binary value
          break;
        case 4:
          newValue = await binaryMultiplyByTwo(currentValue);
          break;
        case 5:
          newValue = binarySubtract(currentValue, 2n);
          break;
        case 6:
          newValue = await binaryMultiplyByTwenty(currentValue, binaryAdd);
          break;
        case 7:
          newValue = binarySubtract(currentValue, 5n);
          break;
        case 8:
          newValue = binaryAdd(currentValue, 3n);
          break;
        default:
          newValue = currentValue;
      }

      if (stepNumber !== 1) {
        const newBinaryArray = bigIntToBinaryArray(newValue);
        await get().animateBitChange(oldBinaryArray, newBinaryArray);
        currentValue = newValue;

        const alignedLength = get8BitAlignedLength(currentValue);
        set({ currentUsedLength: alignedLength });
      }

      if (iteration < iterations) {
        await new Promise((resolve) => setTimeout(resolve, iterationDelay));
      }
    }

    if (stepNumber !== 1) {
      set({ binaryValue: currentValue });
    }

    await new Promise((resolve) => setTimeout(resolve, stepDelay));

    set({
      isExecuting: false,
      currentStep: null,
      currentIteration: 0,
      totalIterations: 0,
    });

    if (onStepComplete && stepNumber === 8) {
      onStepComplete();
    }

    return currentValue;
  },

  autoRunAllSteps: async () => {
    const { isExecuting, steps, stepDelay, isAutoRunning } = get();

    if (isExecuting || isAutoRunning) return;

    set({ isAutoRunning: true });

    for (const step of steps) {
      if (!get().isAutoRunning) break;
      await get().executeStep(step.number);
      if (step.number < 8) {
        await new Promise((resolve) => setTimeout(resolve, stepDelay));
      }
    }

    set({ isAutoRunning: false });
  },

  stopAutoRun: () => {
    set({ isAutoRunning: false });
  },

  reset: () => {
    set({
      binaryValue: 0n,
      memory: new Array(TOTAL_BITS).fill(0),
      activeBits: new Set(),
      isExecuting: false,
      isAutoRunning: false,
      currentStep: null,
      currentIteration: 0,
      totalIterations: 0,
      inputValue: "",
    });
  },
}));

export default useStore;

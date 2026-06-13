// src/store.js
import { create } from "zustand";

const GRID_SIZE = 48;
const TOTAL_BITS = GRID_SIZE * GRID_SIZE;

// Convert decimal to binary array for display only
const decimalToBinaryArray = (decimal) => {
  const binaryArray = new Array(TOTAL_BITS).fill(0);
  if (decimal === 0) return binaryArray;

  let binaryStr = Math.abs(Math.floor(decimal)).toString(2);
  binaryStr = binaryStr.padStart(TOTAL_BITS, "0");

  for (let i = 0; i < TOTAL_BITS; i++) {
    binaryArray[i] = parseInt(binaryStr[i]);
  }

  return binaryArray;
};

const useStore = create((set, get) => ({
  value: 0,
  memory: new Array(TOTAL_BITS).fill(0),
  activeBits: new Set(),
  isExecuting: false,
  isAutoRunning: false,
  currentStep: null,
  currentIteration: 0,
  totalIterations: 0,
  inputValue: 2,
  onStepComplete: null, // Callback for step completion

  // Animation speed control
  animationSpeed: 50,
  iterationDelay: 800,
  stepDelay: 500,

  steps: [
    {
      number: 1,
      label: "Step 1: Enter Value",
      description: `Load initial value`,
      iterations: 1,
    },
    {
      number: 2,
      label: "Step 2: Multiply ×5 (5 times)",
      description: `value × value (do this 5 times)`,
      iterations: 5,
    },
    {
      number: 3,
      label: "Step 3: Add Value×3",
      description: `value + (input × 3)`,
      iterations: 1,
    },
    {
      number: 4,
      label: "Step 4: Multiply ×2",
      description: `value × 2`,
      iterations: 1,
    },
    {
      number: 5,
      label: "Step 5: Subtract Value×10",
      description: `value - (input × 10)`,
      iterations: 1,
    },
    {
      number: 6,
      label: "Step 6: Multiply ×20",
      description: `value × 20`,
      iterations: 1,
    },
    {
      number: 7,
      label: "Step 7: Subtract 5",
      description: `value - 5`,
      iterations: 1,
    },
    {
      number: 8,
      label: "Step 8: Add 3",
      description: `value + 3 (FINAL)`,
      iterations: 1,
    },
  ],

  setInputValue: (value) => set({ inputValue: value }),
  setOnStepComplete: (callback) => set({ onStepComplete: callback }),

  // Animation speed controls
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setIterationDelay: (delay) => set({ iterationDelay: delay }),
  setStepDelay: (delay) => set({ stepDelay: delay }),

  updateBinaryDisplay: (decimalValue) => {
    const binaryArray = decimalToBinaryArray(decimalValue);
    set({ memory: binaryArray, value: decimalValue });
  },

  animateBitChange: async (oldBinary, newBinary) => {
    const { animationSpeed } = get();

    const changedIndices = [];
    for (let i = 0; i < TOTAL_BITS; i++) {
      if (oldBinary[i] !== newBinary[i]) {
        changedIndices.push(i);
      }
    }

    // Animate each changed bit
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

    set({ memory: newBinary });
    await new Promise((resolve) => setTimeout(resolve, animationSpeed));
  },

  executeStep: async (stepNumber, inputValue) => {
    const {
      isExecuting,
      value,
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

    let currentValue = value;

    for (let iteration = 1; iteration <= iterations; iteration++) {
      set({ currentIteration: iteration });

      let newValue = currentValue;
      const oldBinary = decimalToBinaryArray(currentValue);

      switch (stepNumber) {
        case 1:
          newValue = inputValue;
          break;
        case 2:
          newValue = currentValue * currentValue;
          break;
        case 3:
          newValue = currentValue + inputValue * 3;
          break;
        case 4:
          newValue = currentValue * 2;
          break;
        case 5:
          newValue = currentValue - inputValue * 10;
          if (newValue < 0) newValue = 0;
          break;
        case 6:
          newValue = currentValue * 20;
          break;
        case 7:
          newValue = currentValue - 5;
          if (newValue < 0) newValue = 0;
          break;
        case 8:
          newValue = currentValue + 3;
          break;
      }

      const newBinary = decimalToBinaryArray(newValue);
      await get().animateBitChange(oldBinary, newBinary);

      currentValue = newValue;

      if (iteration < iterations) {
        await new Promise((resolve) => setTimeout(resolve, iterationDelay));
      }
    }

    set({ value: currentValue });
    await new Promise((resolve) => setTimeout(resolve, stepDelay));

    set({
      isExecuting: false,
      currentStep: null,
      currentIteration: 0,
      totalIterations: 0,
    });

    // Call the completion callback if it exists
    if (onStepComplete && stepNumber === 8) {
      onStepComplete();
    }

    return currentValue;
  },

  // Auto run all steps
  autoRunAllSteps: async () => {
    const { isExecuting, steps, inputValue, stepDelay, isAutoRunning } = get();

    if (isExecuting || isAutoRunning) return;

    set({ isAutoRunning: true });

    for (const step of steps) {
      if (!get().isAutoRunning) break;

      await get().executeStep(step.number, inputValue);

      // Small extra delay between steps for auto-run
      if (step.number < 8) {
        await new Promise((resolve) => setTimeout(resolve, stepDelay));
      }
    }

    set({ isAutoRunning: false });
  },

  // Stop auto run
  stopAutoRun: () => {
    set({ isAutoRunning: false });
  },

  reset: () => {
    set({
      value: 0,
      memory: new Array(TOTAL_BITS).fill(0),
      activeBits: new Set(),
      isExecuting: false,
      isAutoRunning: false,
      currentStep: null,
      currentIteration: 0,
      totalIterations: 0,
    });
  },
}));

export default useStore;

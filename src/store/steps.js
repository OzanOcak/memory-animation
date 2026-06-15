// src/store/steps.js
export const steps = [
  {
    number: 1,
    label: "Step 1: Enter Value",
    description: `Load initial value (any text → binary)`,
    iterations: 1,
  },
  {
    number: 2,
    label: "Step 2: Multiply by itself ×5 (5 times)",
    description: `value × value (do this 5 times) - binary multiplication`,
    iterations: 5,
  },
  {
    number: 3,
    label: "Step 3: Add Value by itself",
    description: `value + value - binary addition`,
    iterations: 1,
  },
  {
    number: 4,
    label: "Step 4: Multiply × 2 (5 times)",
    description: `value × 2 (do this 5 times) - left shift`,
    iterations: 5,
  },
  {
    number: 5,
    label: "Step 5: Subtract Value by 2",
    description: `value - 2 - binary subtraction`,
    iterations: 1,
  },
  {
    number: 6,
    label: "Step 6: Multiply ×2 (10 times)",
    description: `value × 2 (do this 10 times) - left shifts`,
    iterations: 10,
  },
  {
    number: 7,
    label: "Step 7: Subtract by 5",
    description: `value - 5 - binary subtraction`,
    iterations: 1,
  },
  {
    number: 8,
    label: "Step 8: Add by 3",
    description: `value + 3 (FINAL) - binary addition`,
    iterations: 1,
  },
];

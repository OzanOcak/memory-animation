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
    label: "Step 2: SHA-1 Padding",
    description: `Add padding (1 followed by zeros) + 64-bit length`,
    iterations: 1,
  },
  {
    number: 3,
    label: "Step 3: Split into 16 Words (32 bits each)",
    description: `Split 512-bit padded message into 16 words of 32 bits`,
    iterations: 1,
  },
  {
    number: 4,
    label: "Step 4: Initialize Hash Values (H0-H4)",
    description: `Set initial hash constants: 0x67452301, 0xefcdab89, etc.`,
    iterations: 1,
  },
  {
    number: 5,
    label: "Step 5: Create Message Schedule",
    description: `Expand 16 words to 80 words using XOR and left rotation`,
    iterations: 1,
  },
  {
    number: 6,
    label: "Step 6: Process 80 Rounds",
    description: `Main compression function - process each word`,
    iterations: 80, // 80 iterations to see each round!
  },
  {
    number: 7,
    label: "Step 7: Add to Hash",
    description: `Add round output to current hash values`,
    iterations: 1,
  },
  {
    number: 8,
    label: "Step 8: Final Hash (Hex)",
    description: `Convert final hash to hexadecimal string`,
    iterations: 1,
  },
];

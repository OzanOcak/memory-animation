// src/components/MemoryGrid.jsx
import { motion } from "framer-motion";
import useStore from "../store/index.js";
const MemoryGrid = () => {
  const {
    memory,
    activeBits,
    binaryValue,
    currentStep,
    currentIteration,
    totalIterations,
    currentUsedLength, // Use this for coloring
  } = useStore();

  const TOTAL_BITS = 625;

  // This updates every time the number grows!
  const usedStartPosition = TOTAL_BITS - currentUsedLength;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-gray-700">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          {/*<h2 className="text-lg font-semibold text-gray-300">
             Memory Grid (16×16 = 256 bits)
          </h2>*/}
          {currentStep && totalIterations > 0 && (
            <div className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              Step {currentStep} - Iteration {currentIteration}/
              {totalIterations}
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-gray-400">Current Value:</div>
            <div className="text-xs text-gray-400">
              Binary Length:{" "}
              <span className="text-yellow-400 font-bold">
                {currentUsedLength}
              </span>{" "}
              bits
            </div>
          </div>
          <div className="font-mono text-xs font-bold text-green-400 break-all">
            {binaryValue.toString()}
          </div>
          {/* <div className="text-xs text-gray-400 mt-2">
            Binary ({currentUsedLength} bits):
          </div>
          <div className="font-mono text-xs text-blue-400 break-all">
            {binaryValue.toString(2).padStart(currentUsedLength, "0")}
          </div>*/}
        </div>
      </div>

      {/* 16x16 Binary Grid */}
      <div className="grid grid-cols-16 gap-0.5">
        {memory.map((bit, index) => {
          const isActive = activeBits.has(index);
          // USE usedStartPosition HERE - this updates as number grows
          const isWithinUsed = index >= usedStartPosition;

          let bgColor;
          if (isActive) {
            bgColor = "#10b981"; // Green - changing
          } else if (isWithinUsed && bit === 1) {
            bgColor = "#3b82f6"; // Dark blue - bit = 1
          } else if (isWithinUsed && bit === 0) {
            bgColor = "#93c5fd"; // Light blue - zeros inside used length
          } else {
            bgColor = "#1f2937"; // Dark gray - padding zeros
          }

          return (
            <motion.div
              key={index}
              animate={{
                scale: isActive ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.1 }}
              className="aspect-square rounded cursor-pointer transition-all flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
              title={`Bit ${index}: ${bit} | ${isWithinUsed ? "Inside used bits" : "Padding"}`}
            >
              <div className="text-xs font-mono font-bold text-white">
                {bit}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-400">Bit = 1</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-300 rounded"></div>
          <span className="text-gray-400">Bit = 0 (used)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-700 rounded"></div>
          <span className="text-gray-400">Padding zeros</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span className="text-gray-400">Changing Bit</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryGrid;

// src/components/MemoryGrid.jsx
import { motion } from "framer-motion";
import useStore from "../store";

const MemoryGrid = () => {
  const {
    memory,
    activeBits,
    value,
    currentStep,
    currentIteration,
    totalIterations,
  } = useStore();
  const GRID_SIZE = 16;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-gray-700">
      {/* Header with iteration info */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-300">
            Memory Grid (16×16 = 256 bits)
          </h2>
          {currentStep && totalIterations > 0 && (
            <div className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              Iteration {currentIteration}/{totalIterations}
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">
            Current Decimal Value:
          </div>
          <div className="font-mono text-2xl font-bold text-green-400">
            {value}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Binary Representation:
          </div>
          <div className="font-mono text-xs text-blue-400 break-all max-h-20 overflow-y-auto">
            {memory.join("")}
          </div>
        </div>
      </div>

      {/* 16x16 Binary Grid */}
      <div className="grid grid-cols-16 gap-0.5">
        {memory.map((bit, index) => {
          const isActive = activeBits.has(index);
          const row = Math.floor(index / GRID_SIZE);
          const col = index % GRID_SIZE;

          let bgColor;
          if (isActive) {
            bgColor = "#10b981"; // Green - changing
          } else if (bit === 1) {
            bgColor = "#3b82f6"; // Blue - bit set to 1
          } else {
            bgColor = "#1f2937"; // Dark gray - bit set to 0
          }

          return (
            <motion.div
              key={index}
              animate={{
                scale: isActive ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.1 }}
              className="aspect-square rounded cursor-pointer transition-all"
              style={{ backgroundColor: bgColor }}
              title={`Position [${row},${col}] | Bit: ${bit}`}
            >
              <div className="w-full h-full flex items-center justify-center text-xs font-mono font-bold">
                {bit}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-400">Bit = 1</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-700 rounded"></div>
          <span className="text-gray-400">Bit = 0</span>
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

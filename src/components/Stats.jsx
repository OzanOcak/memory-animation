// src/components/Stats.jsx
import { motion } from "framer-motion";
import { binaryGridToDecimal, TOTAL_BITS } from "../store";

const Stats = ({ memory }) => {
  const currentDecimal = binaryGridToDecimal(memory);
  const bitsSet = memory.filter((bit) => bit === 1).length;
  const bitsCleared = memory.filter((bit) => bit === 0).length;

  // Find first 1 (MSB position)
  const firstOneIndex = memory.findIndex((bit) => bit === 1);
  const msbPosition = firstOneIndex === -1 ? 0 : TOTAL_BITS - firstOneIndex;

  // Find last 1 (LSB position)
  //  const lastOneIndex = memory.lastIndexOf(1);
  //  const lsbPosition = lastOneIndex === -1 ? 0 : TOTAL_BITS - lastOneIndex;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3"
    >
      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-3 text-center">
        <div className="text-xs text-gray-400">Decimal Value</div>
        <div className="text-lg font-bold text-blue-400">{currentDecimal}</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-3 text-center">
        <div className="text-xs text-gray-400">Bits Set (1s)</div>
        <div className="text-lg font-bold text-green-400">{bitsSet}</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-3 text-center">
        <div className="text-xs text-gray-400">Bits Cleared (0s)</div>
        <div className="text-lg font-bold text-gray-400">{bitsCleared}</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-3 text-center">
        <div className="text-xs text-gray-400">Bit Usage</div>
        <div className="text-sm font-bold">
          <span className="text-purple-400">
            {Math.round((bitsSet / TOTAL_BITS) * 100)}%
          </span>
        </div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-3 text-center">
        <div className="text-xs text-gray-400">Binary Length</div>
        <div className="text-sm font-bold text-yellow-400">
          {msbPosition} bits
        </div>
      </div>
    </motion.div>
  );
};

export default Stats;

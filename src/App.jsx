// src/App.js
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import MemoryGrid from "./components/MemoryGrid";
import StepControls from "./components/StepControls";
import ValueInput from "./components/ValueInput";
import AnimationSpeedControl from "./components/AnimationSpeedControl";
import useStore from "./store/index.js";

function App() {
  const {
    steps,
    executeStep,
    reset,
    isExecuting,
    isAutoRunning,
    currentStep,
    value,
    inputValue,
    setInputValue,
    words16,
  } = useStore();

  const [showSuccess, setShowSuccess] = useState(false);

  // Handle step completion and show success message
  const handleStepComplete = (stepNumber) => {
    if (stepNumber === 8) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleExecuteStep = async (stepNumber) => {
    await executeStep(stepNumber, inputValue);
    handleStepComplete(stepNumber);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Memory Bit Map Processor
          </h1>
          <p className="text-gray-400 mt-2">
            Decimal Calculations | Binary Visualization | Auto-Run Mode
          </p>
          {isAutoRunning && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="inline-block mt-2 px-4 py-1 bg-purple-600 rounded-full text-sm font-bold"
            >
              🚀 AUTO-RUNNING STEPS 1-8
            </motion.div>
          )}
        </motion.div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Processing Complete!</p>
                    <p className="text-sm">Final value: {value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left Column - Memory Grid */}
          <div className="flex-1">
            <MemoryGrid />

            {/* Live Word Display - shows when words exist */}
            {words16.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gray-900/80 rounded-xl border border-gray-700"
              >
                <div className="text-sm font-bold text-gray-300 mb-3">
                  📦 16 Words (32 bits each) - Step 3 Complete
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {words16.map((word) => (
                    <div
                      key={word.index}
                      className="bg-gray-800 rounded-lg p-2"
                    >
                      <div className="text-xs text-blue-400">
                        W[{word.index}]
                      </div>
                      <div className="font-mono text-sm text-green-400 font-bold">
                        {word.hex}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {word.bits}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Controls */}
          <div className="xl:w-96 space-y-6">
            {/* Value Input */}
            <ValueInput
              value={inputValue}
              onChange={setInputValue}
              disabled={isExecuting || isAutoRunning}
            />

            {/* Animation Speed Control */}
            <AnimationSpeedControl />

            {/* Step Controls with Auto Run */}
            <StepControls
              steps={steps}
              onExecuteStep={handleExecuteStep}
              isExecuting={isExecuting || isAutoRunning}
              currentStep={currentStep}
            />

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={reset}
              disabled={isExecuting || isAutoRunning}
              className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg disabled:opacity-50"
            >
              Reset Memory
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

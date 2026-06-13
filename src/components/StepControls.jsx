// src/components/StepControls.jsx
import { motion } from "framer-motion";
import useStore from "../store";

const StepControls = ({ steps, onExecuteStep, isExecuting, currentStep }) => {
  const { isAutoRunning, autoRunAllSteps, stopAutoRun } = useStore();

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-300">
          Processing Steps
        </h2>

        {/* Auto Run Button */}
        {!isAutoRunning ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={autoRunAllSteps}
            disabled={isExecuting}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          >
            ▶ Auto Run All Steps
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopAutoRun}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg text-sm font-bold transition-all animate-pulse"
          >
            ⏸ Stop Auto Run
          </motion.button>
        )}
      </div>

      <div className="space-y-2">
        {steps.map((step) => (
          <motion.button
            key={step.number}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onExecuteStep(step.number)}
            disabled={isExecuting || isAutoRunning}
            className={`
              w-full p-3 rounded-xl text-left transition-all duration-300 relative overflow-hidden
              ${
                currentStep === step.number
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 ring-2 ring-green-400 shadow-lg shadow-green-500/25"
                  : "bg-gray-700/50 hover:bg-gray-700 border border-gray-600"
              }
              ${(isExecuting || isAutoRunning) && currentStep !== step.number ? "opacity-60" : ""}
              disabled:cursor-not-allowed
            `}
          >
            {/* Progress bar for current step */}
            {currentStep === step.number && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-green-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}

            {/* Highlight animation when step is clicked */}
            {currentStep === step.number && (
              <motion.div
                className="absolute inset-0 bg-white opacity-20"
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}

            <div className="flex justify-between items-center relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${
                      currentStep === step.number
                        ? "bg-white text-green-600"
                        : "bg-gray-600 text-gray-300"
                    }
                  `}
                  >
                    {step.number}
                  </div>
                  <div>
                    <div className="font-bold text-white">{step.label}</div>
                    <div className="text-xs text-gray-300">
                      {step.description}
                    </div>
                    {step.iterations > 1 && (
                      <div className="text-xs text-yellow-400 mt-0.5">
                        🔄 {step.iterations} iterations
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Animated indicator when this step is active */}
              {currentStep === step.number && (
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="flex items-center gap-1"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                  <span className="text-xs text-green-400 font-bold">
                    PROCESSING
                  </span>
                </motion.div>
              )}

              {/* Checkmark for completed steps during auto-run */}
              {isAutoRunning && currentStep && step.number < currentStep && (
                <div className="text-green-400 text-xl">✓</div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-gray-900 rounded-lg">
        <div className="text-xs text-gray-400">
          <span className="font-bold text-yellow-400">ℹ️ Auto Run:</span> Click
          "Auto Run All Steps" to execute steps 1-8 automatically with current
          animation speed settings. Each step button will highlight during
          execution!
        </div>
      </div>
    </div>
  );
};

export default StepControls;

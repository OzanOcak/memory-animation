// src/components/AnimationSpeedControl.jsx

import useStore from "../store/index.js";
const AnimationSpeedControl = () => {
  const {
    animationSpeed,
    setAnimationSpeed,
    iterationDelay,
    setIterationDelay,
    stepDelay,
    setStepDelay,
    isExecuting,
  } = useStore();

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
      <h3 className="text-md font-semibold text-gray-300 mb-3 flex items-center gap-2">
        <span className="text-xl">⚡</span>
        Animation Speed Controls
        {!isExecuting && (
          <span className="text-xs text-green-400 ml-2">(Active)</span>
        )}
        {isExecuting && (
          <span className="text-xs text-yellow-400 ml-2">
            (Disabled during execution)
          </span>
        )}
      </h3>

      {/* Bit Animation Speed */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Bit Animation Speed</span>
          <span className="text-blue-400 font-bold">{animationSpeed}ms</span>
        </div>
        <input
          type="range"
          min="10"
          max="200"
          step="5"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
          disabled={isExecuting}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((animationSpeed - 10) / 190) * 100}%, #374151 ${((animationSpeed - 10) / 190) * 100}%, #374151 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Fast (10ms)</span>
          <span>Normal (50ms)</span>
          <span>Slow (200ms)</span>
        </div>
      </div>

      {/* Iteration Delay */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Between Iterations</span>
          <span className="text-purple-400 font-bold">{iterationDelay}ms</span>
        </div>
        <input
          type="range"
          min="200"
          max="2000"
          step="100"
          value={iterationDelay}
          onChange={(e) => setIterationDelay(parseInt(e.target.value))}
          disabled={isExecuting}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((iterationDelay - 200) / 1800) * 100}%, #374151 ${((iterationDelay - 200) / 1800) * 100}%, #374151 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Fast (200ms)</span>
          <span>Normal (800ms)</span>
          <span>Slow (2000ms)</span>
        </div>
      </div>

      {/* Step Delay */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Between Steps</span>
          <span className="text-green-400 font-bold">{stepDelay}ms</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={stepDelay}
          onChange={(e) => setStepDelay(parseInt(e.target.value))}
          disabled={isExecuting}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((stepDelay - 100) / 1900) * 100}%, #374151 ${((stepDelay - 100) / 1900) * 100}%, #374151 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Fast (100ms)</span>
          <span>Normal (500ms)</span>
          <span>Slow (2000ms)</span>
        </div>
      </div>

      {/* Speed Presets */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <button
          onClick={() => {
            setAnimationSpeed(20);
            setIterationDelay(300);
            setStepDelay(200);
          }}
          disabled={isExecuting}
          className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50 font-semibold"
        >
          Fast
        </button>
        <button
          onClick={() => {
            setAnimationSpeed(50);
            setIterationDelay(800);
            setStepDelay(500);
          }}
          disabled={isExecuting}
          className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 font-semibold"
        >
          Normal
        </button>
        <button
          onClick={() => {
            setAnimationSpeed(150);
            setIterationDelay(1500);
            setStepDelay(1200);
          }}
          disabled={isExecuting}
          className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg transition disabled:opacity-50 font-semibold"
        >
          Slow
        </button>
      </div>

      {/* Current Speed Display */}
      <div className="mt-3 p-2 bg-gray-900 rounded-lg">
        <div className="text-xs text-gray-400 text-center">
          Current Settings:
        </div>
        <div className="text-xs text-center font-mono">
          <span className="text-blue-400">{animationSpeed}ms/bit</span>
          <span className="text-gray-500 mx-1">|</span>
          <span className="text-purple-400">{iterationDelay}ms/iteration</span>
          <span className="text-gray-500 mx-1">|</span>
          <span className="text-green-400">{stepDelay}ms/step</span>
        </div>
      </div>
    </div>
  );
};

export default AnimationSpeedControl;

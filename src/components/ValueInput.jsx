const ValueInput = ({ value, onChange, disabled }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
        <span className="text-xl">🔢</span>
        Initial Value (Step 1)
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          placeholder="Enter a number"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {value}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        This value will be used throughout all 8 steps
      </p>
    </div>
  );
};

export default ValueInput;

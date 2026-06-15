// src/components/ValueInput.jsx
const ValueInput = ({ value, onChange, disabled }) => {
  const getSimpleBinary = (str) => {
    if (!str || str === "") return "0";

    // For single digit numbers, show just the number's binary
    if (str.length === 1 && !isNaN(str) && str >= "0" && str <= "9") {
      return parseInt(str).toString(2);
    }

    // For text, show each character's 8-bit binary
    let binary = "";
    for (let i = 0; i < str.length && i < 5; i++) {
      // Limit to first 5 chars
      const charBinary = str.charCodeAt(i).toString(2).padStart(8, "0");
      binary += charBinary + " ";
    }
    if (str.length > 5) binary += "...";
    return binary.trim();
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
        <span className="text-xl">⌨️</span>
        Enter Anything (Text, Numbers, Emojis, etc.)
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-3 bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-mono"
        placeholder="Type anything: hello, 123, 🚀, world..."
      />

      <div className="mt-3 p-2 bg-gray-900/50 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Binary Preview:</div>
        <div className="font-mono text-xs text-green-400 break-all">
          {getSimpleBinary(String(value))}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Full binary will load when you run Step 1
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        💡 Type "2" → Binary: 10 | Type "hello" → Binary: 01101000 01100101
        01101100 01101100 01101111
      </p>
    </div>
  );
};

export default ValueInput;

import React from 'react';

const TextControls = ({ text, onChange, placeholder }) => {
  const updateText = (updates) => {
    onChange({ ...text, ...updates });
  };

  return (
    <div className="flex flex-wrap items-center gap-6 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      
      {/* Text */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-medium text-gray-600">Text</label>
        <input
          type="text"
          value={text.content}
          onChange={(e) => updateText({ content: e.target.value })}
          placeholder={placeholder}
          className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Font Size */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-medium text-gray-600">Font</label>
        <input
          type="range"
          min="20"
          max="80"
          value={text.fontSize}
          onChange={(e) => updateText({ fontSize: parseInt(e.target.value) })}
          className="w-20"
        />
        <span className="text-[10px]">{text.fontSize}px</span>
      </div>

      {/* Text Color */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-medium text-gray-600">Color</label>
        <input
          type="color"
          value={text.color}
          onChange={(e) => updateText({ color: e.target.value })}
          className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={text.color}
          onChange={(e) => updateText({ color: e.target.value })}
          className="w-14 px-1 py-0.5 text-xs border border-gray-300 rounded"
        />
      </div>

      {/* Outline Color */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-medium text-gray-600">Outline</label>
        <input
          type="color"
          value={text.stroke}
          onChange={(e) => updateText({ stroke: e.target.value })}
          className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={text.stroke}
          onChange={(e) => updateText({ stroke: e.target.value })}
          className="w-14 px-1 py-0.5 text-xs border border-gray-300 rounded"
        />
      </div>

      {/* Outline Width */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-medium text-gray-600">O-Width</label>
        <input
          type="range"
          min="0"
          max="8"
          value={text.strokeWidth}
          onChange={(e) => updateText({ strokeWidth: parseInt(e.target.value) })}
          className="w-16"
        />
        <span className="text-[10px]">{text.strokeWidth}px</span>
      </div>

      {/* Vertical Position */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-medium text-gray-600">Y Pos</label>
        <input
          type="range"
          min="5"
          max="95"
          value={text.y}
          onChange={(e) => updateText({ y: parseInt(e.target.value) })}
          className="w-20"
        />
        <span className="text-[10px]">{text.y}%</span>
      </div>
    </div>
  );
};

export default TextControls;

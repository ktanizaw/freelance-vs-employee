"use client";

import { useState } from "react";

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-gray-500 bg-white rounded-full border border-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        aria-label="説明を表示"
      >
        ?
      </button>
      {show && (
        <div className="fixed-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 max-w-[90vw] px-3 py-2 text-xs font-normal text-white bg-gray-800 rounded-lg shadow-lg z-50 leading-relaxed break-words">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </span>
  );
}

"use client";

import { useState } from "react";
import { Tooltip } from "./Tooltip";

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  unit = "円",
  min = 0,
  max,
  step = 10000,
  tooltip,
}: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 flex items-center">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={focused && value === 0 ? "" : value}
          onChange={(e) => {
            let v = Number(e.target.value) || 0;
            if (min !== undefined) v = Math.max(min, v);
            if (max !== undefined) v = Math.min(max, v);
            onChange(v);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          min={min}
          max={max}
          step={step}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-right text-lg font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-500 whitespace-nowrap">{unit}</span>
      </div>
    </div>
  );
}

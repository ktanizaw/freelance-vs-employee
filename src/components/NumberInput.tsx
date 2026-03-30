"use client";

import { useState } from "react";
import { Tooltip } from "./Tooltip";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
  tooltip,
}: NumberInputProps) {
  const [focused, setFocused] = useState(false);

  // stepの小数桁数に合わせて丸める（浮動小数点誤差対策）
  const decimals = step < 1 ? (step.toString().split(".")[1]?.length ?? 0) : 0;
  const round = (v: number) => decimals > 0 ? Number(v.toFixed(decimals)) : v;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 flex items-center">
        {label}
        {unit && <span className="sm:hidden">（{unit}）</span>}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => {
            let v = round(value - step);
            if (min !== undefined) v = Math.max(min, v);
            onChange(v);
          }}
          className="sm:hidden shrink-0 w-9 h-9 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 font-bold text-lg active:bg-slate-200"
        >
          −
        </button>
        <input
          type="number"
          inputMode={step < 1 ? "decimal" : "numeric"}
          value={focused && value === 0 ? "" : value}
          onChange={(e) => onChange(round(Number(e.target.value) || 0))}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            let v = value;
            if (min !== undefined) v = Math.max(min, v);
            if (max !== undefined) v = Math.min(max, v);
            if (v !== value) onChange(v);
          }}
          min={min}
          max={max}
          step={step}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-right font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => {
            let v = round(value + step);
            if (max !== undefined) v = Math.min(max, v);
            onChange(v);
          }}
          className="sm:hidden shrink-0 w-9 h-9 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 font-bold text-lg active:bg-slate-200"
        >
          +
        </button>
        {unit && (
          <span className="text-sm text-gray-500 whitespace-nowrap hidden sm:inline">{unit}</span>
        )}
      </div>
    </div>
  );
}

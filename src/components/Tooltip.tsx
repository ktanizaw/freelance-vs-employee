"use client";

import { useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  useHover,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ fallbackPlacements: ["bottom", "right", "left"] }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableWidth, elements }) {
          elements.floating.style.maxWidth = `${availableWidth}px`;
        },
      }),
    ],
  });

  const hover = useHover(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    dismiss,
  ]);

  return (
    <span className="inline-flex items-center ml-1 w-4 h-4 shrink-0">
      <button
        ref={refs.setReference}
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-gray-500 bg-white rounded-full border border-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label="説明を表示"
        {...getReferenceProps()}
      >
        ?
      </button>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="w-72 px-3 py-2 text-xs font-normal text-white bg-gray-800 rounded-lg shadow-lg z-50 leading-relaxed break-words"
            {...getFloatingProps()}
          >
            {text}
          </div>
        </FloatingPortal>
      )}
    </span>
  );
}

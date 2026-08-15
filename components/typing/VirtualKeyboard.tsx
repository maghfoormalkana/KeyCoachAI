"use client";

import { cn } from "@/lib/utils";

interface VirtualKeyboardProps {
  activeKey: string;
  weakKeys: string[];
}

// ✅ Add this explicit Type definition
type KeyDef = {
  key: string;
  display: string;
  wide?: boolean;
  space?: boolean;
};

// ✅ Apply the type to the array
const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { key: "`", display: "`" }, { key: "1", display: "1" }, { key: "2", display: "2" },
    { key: "3", display: "3" }, { key: "4", display: "4" }, { key: "5", display: "5" },
    { key: "6", display: "6" }, { key: "7", display: "7" }, { key: "8", display: "8" },
    { key: "9", display: "9" }, { key: "0", display: "0" }, { key: "-", display: "-" },
    { key: "=", display: "=" }, { key: "Backspace", display: "⌫", wide: true },
  ],
  [
    { key: "Tab", display: "Tab", wide: true }, { key: "q", display: "Q" }, { key: "w", display: "W" },
    { key: "e", display: "E" }, { key: "r", display: "R" }, { key: "t", display: "T" },
    { key: "y", display: "Y" }, { key: "u", display: "U" }, { key: "i", display: "I" },
    { key: "o", display: "O" }, { key: "p", display: "P" }, { key: "[", display: "[" },
    { key: "]", display: "]" }, { key: "\\", display: "\\" },
  ],
  [
    { key: "CapsLock", display: "Caps", wide: true }, { key: "a", display: "A" },
    { key: "s", display: "S" }, { key: "d", display: "D" }, { key: "f", display: "F" },
    { key: "g", display: "G" }, { key: "h", display: "H" }, { key: "j", display: "J" },
    { key: "k", display: "K" }, { key: "l", display: "L" }, { key: ";", display: ";" },
    { key: "'", display: "'" }, { key: "Enter", display: "Enter", wide: true },
  ],
  [
    { key: "Shift", display: "Shift", wide: true }, { key: "z", display: "Z" },
    { key: "x", display: "X" }, { key: "c", display: "C" }, { key: "v", display: "V" },
    { key: "b", display: "B" }, { key: "n", display: "N" }, { key: "m", display: "M" },
    { key: ",", display: "," }, { key: ".", display: "." }, { key: "/", display: "/" },
    { key: "Shift", display: "Shift", wide: true },
  ],
  [
    { key: "Control", display: "Ctrl", wide: true }, { key: "Meta", display: "Win", wide: true },
    { key: "Alt", display: "Alt", wide: true }, { key: " ", display: "Space", space: true },
    { key: "Alt", display: "Alt", wide: true }, { key: "Meta", display: "Win", wide: true },
    { key: "Control", display: "Ctrl", wide: true },
  ],
];

export function VirtualKeyboard({ activeKey, weakKeys }: VirtualKeyboardProps) {
  const isKeyActive = (key: string) => {
    if (activeKey === key) return true;
    if (activeKey === " " && key === " ") return true;
    if (activeKey.toLowerCase() === key.toLowerCase()) return true;
    return false;
  };

  const isWeakKey = (key: string) => {
    return weakKeys.includes(key.toLowerCase());
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((keyObj, keyIndex) => (
            <div
              key={`${rowIndex}-${keyIndex}`}
              className={cn(
                "h-10 rounded-lg flex items-center justify-center text-sm font-mono transition-all duration-75 select-none",
                keyObj.space 
                  ? "w-48 bg-slate-800 border-b-4 border-slate-700" 
                  : keyObj.wide 
                    ? "w-14 bg-slate-700 border-b-4 border-slate-600 text-xs" 
                    : "w-8 bg-slate-800 border-b-4 border-slate-700",
                isKeyActive(keyObj.key) && "active translate-y-1 border-b-0 bg-brand-600 text-white",
                isWeakKey(keyObj.key) && !isKeyActive(keyObj.key) && "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
              )}
            >
              {keyObj.display}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
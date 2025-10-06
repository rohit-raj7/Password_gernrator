"use client";
import React, { useState } from "react";

const LOOKALIKES = new Set(["O", "o", "0", "l", "I", "1"]);

function makeCharset(opts: {
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeLookAlikes: boolean;
}) {
  let s = "";
  if (opts.lower) s += "abcdefghijklmnopqrstuvwxyz";
  if (opts.upper) s += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.numbers) s += "0123456789";
  if (opts.symbols) s += "!@#$%^&*()-_=+[]{};:,.<>/?~";
  if (opts.excludeLookAlikes)
    s = s
      .split("")
      .filter((c) => !LOOKALIKES.has(c))
      .join("");
  return s;
}

export default function PasswordGenerator({
  onGenerated,
  initialLength = 16,
}: {
  onGenerated?: (pw: string) => void;
  initialLength?: number;
}) {
  const [length, setLength] = useState<number>(initialLength);
  const [upper, setUpper] = useState<boolean>(true);
  const [lower, setLower] = useState<boolean>(true);
  const [numbers, setNumbers] = useState<boolean>(true);
  const [symbols, setSymbols] = useState<boolean>(false);
  const [exclude, setExclude] = useState<boolean>(true);
  const [pw, setPw] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  function generate() {
    const charset = makeCharset({
      upper,
      lower,
      numbers,
      symbols,
      excludeLookAlikes: exclude,
    });
    if (!charset.length) {
      setPw("");
      onGenerated?.("");
      return;
    }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    const out = Array.from(arr)
      .map((i) => charset[i % charset.length])
      .join("");
    setPw(out);
    onGenerated?.(out);
    setCopied(false);
  }

  async function quickCopy() {
    if (!pw) return;
    try {
      await navigator.clipboard.writeText(pw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // reset after 1.5 sec
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Clipboard copy failed. Try manually selecting and copying.");
    }
  }

  return (
    <div className="p-4 bg-white/80 dark:bg-gray-800/70 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
        Password Generator
      </h3>

      <div className="flex items-center gap-3 mb-2">
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="grow"
        />
        <div className="w-12 text-right text-sm font-medium text-gray-700 dark:text-gray-200">
          {length}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={upper}
            onChange={() => setUpper((v) => !v)}
          />
          Upper
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={lower}
            onChange={() => setLower((v) => !v)}
          />
          Lower
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={numbers}
            onChange={() => setNumbers((v) => !v)}
          />
          Numbers
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={symbols}
            onChange={() => setSymbols((v) => !v)}
          />
          Symbols
        </label>
        <label className="col-span-2 flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={exclude}
            onChange={() => setExclude((v) => !v)}
          />
          Exclude look-alikes (0,O,l,1)
        </label>
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={generate}
          className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Generate
        </button>

        <input
          readOnly
          value={pw}
          placeholder="Generated password"
          className="flex-1 p-2 border rounded-md bg-white/50 dark:bg-gray-700 text-sm"
        />

        <button
          onClick={quickCopy}
          disabled={!pw}
          className="relative px-3 py-2 bg-gray-800 rounded-md hover:bg-indigo-600 text-gray-200 transition disabled:opacity-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

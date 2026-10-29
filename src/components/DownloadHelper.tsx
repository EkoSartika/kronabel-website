"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface CopyHashButtonProps {
  hash: string;
  label?: string;
}

export function CopyHashButton({ hash, label = "Salin SHA-256" }: CopyHashButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/80 rounded-md transition-colors"
      title="Salin hash SHA-256 ke clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-emerald-900 font-semibold">Tersalin!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-emerald-700" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export function PowerShellVerifyBox({ filename, hash }: { filename: string; hash: string }) {
  const [copied, setCopied] = useState(false);
  const command = `Get-FileHash .\\${filename} -Algorithm SHA256`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs sm:text-sm border border-slate-800 shadow-inner">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-xs">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          PowerShell Verification Command
        </span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Tersalin" : "Salin Perintah"}</span>
        </button>
      </div>
      <p className="text-emerald-400 select-all overflow-x-auto whitespace-pre-wrap break-all">
        {command}
      </p>
      <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
        <span className="text-amber-400/90 font-medium">Nilai Hash yang valid:</span>
        <p className="font-mono text-slate-300 break-all select-all mt-0.5">{hash}</p>
      </div>
    </div>
  );
}


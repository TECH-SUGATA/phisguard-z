/**
 * InstallExtensionModal.tsx
 * Enterprise Browser Extension Installer & Exporter.
 * Generates and downloads real Chromium Manifest V3 extension packages for Google Chrome,
 * Microsoft Edge, and Brave with interactive step-by-step installation instructions.
 */

import React, { useState } from "react";
import { 
  Shield, 
  Download, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  FolderDown, 
  Terminal, 
  Settings, 
  Puzzle, 
  Sparkles,
  ArrowRight,
  Code2,
  FileCode,
  Layers
} from "lucide-react";
import { downloadExtensionZip, generateExtensionFiles } from "../utils/extensionPackager";
import { soundManager } from "../utils/audio";

interface InstallExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallExtensionModal: React.FC<InstallExtensionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<"manifest" | "background" | "content" | "popup">("manifest");
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const files = generateExtensionFiles();

  const handleDownload = async () => {
    setIsDownloading(true);
    soundManager.playScanPing();
    try {
      await downloadExtensionZip();
      setDownloadSuccess(true);
      soundManager.playSafeTone();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getCodeContent = () => {
    switch (activeCodeTab) {
      case "manifest":
        return JSON.stringify(files.manifestJson, null, 2);
      case "background":
        return files.backgroundJs;
      case "content":
        return files.contentJs;
      case "popup":
        return files.popupHtml;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopiedCode(true);
    soundManager.playSafeTone();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0B1120] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-950/50">
              <Puzzle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                INSTALL PHISGUARD-Z BROWSER EXTENSION
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">
                  MANIFEST V3
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Install directly into Chrome, Edge, Brave, or Chromium browsers via Developer Mode.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          
          {/* Quick Action Download Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Ready-to-Install Extension Package
              </span>
              <h3 className="text-sm font-bold text-slate-100 mt-1">
                Download Unpacked Chrome Extension ZIP
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Contains pre-configured <code className="text-slate-300">manifest.json</code>, background service worker, in-page link inspector, and popup UI.
              </p>
            </div>

            <button
              id="btn-download-extension-zip"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono font-bold shadow-lg shadow-cyan-950/40 transition-all active:scale-95 flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Packaging ZIP...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>ZIP Downloaded!</span>
                </>
              ) : (
                <>
                  <FolderDown className="w-4 h-4" />
                  <span>Download Extension (.zip)</span>
                </>
              )}
            </button>
          </div>

          {/* 4-Step Quick Install Walkthrough */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              How to Install in 30 Seconds:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              
              {/* Step 1 */}
              <div className="p-3.5 bg-[#0B1120] rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px]">
                    1
                  </span>
                  <span className="font-bold text-slate-100">Extract the ZIP Archive</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Click the button above to download <code className="text-slate-300">phisguard-z-extension.zip</code> and unzip it to any folder on your computer.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 bg-[#0B1120] rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px]">
                    2
                  </span>
                  <span className="font-bold text-slate-100">Open Extension Manager</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In Chrome, type <code className="text-cyan-400 bg-slate-900 px-1 py-0.5 rounded">chrome://extensions</code> in your address bar (or <code className="text-cyan-400 bg-slate-900 px-1 py-0.5 rounded">edge://extensions</code> in Edge).
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 bg-[#0B1120] rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px]">
                    3
                  </span>
                  <span className="font-bold text-slate-100">Enable Developer Mode</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Look in the top-right corner of the Extensions page and toggle the switch labeled <strong>"Developer mode"</strong> to ON.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 bg-[#0B1120] rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px]">
                    4
                  </span>
                  <span className="font-bold text-slate-100">Click "Load unpacked"</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Click the <strong>"Load unpacked"</strong> button in the top-left toolbar, then select your unzipped folder. That's it!
                </p>
              </div>

            </div>
          </div>

          {/* Interactive Code Preview Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                Inspect Extension Source Files
              </h4>

              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#090D18] rounded-xl border border-slate-800 overflow-hidden">
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-[#0B1120] px-3 py-2 border-b border-slate-800 text-xs font-mono">
                {[
                  { id: "manifest", label: "manifest.json" },
                  { id: "background", label: "background.js" },
                  { id: "content", label: "content.js" },
                  { id: "popup", label: "popup.html" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveCodeTab(t.id as any)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeCodeTab === t.id
                        ? "bg-slate-800 text-cyan-400 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Code display */}
              <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56 leading-relaxed select-all">
                {getCodeContent()}
              </pre>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#0B1120] px-6 py-3.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Target Architecture: Chromium Manifest V3 Compatible</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

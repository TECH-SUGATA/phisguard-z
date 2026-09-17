/**
 * FloatingExtensionDock.tsx
 * An in-browser floating Chrome Extension widget that allows users to use and test
 * the PHISGUARD-Z extension popup directly inside the browser window on any screen.
 */

import React, { useState } from "react";
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  X, 
  Minimize2, 
  Maximize2, 
  ExternalLink, 
  Sliders, 
  Zap, 
  Lock, 
  Radio, 
  Download, 
  ChevronUp, 
  ChevronDown,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { ScannedUrlResult, ProtectionSettings } from "../types";
import { soundManager } from "../utils/audio";

interface FloatingExtensionDockProps {
  currentTabUrl: string;
  activeScanResult: ScannedUrlResult | null;
  onScanUrl: (url: string) => Promise<any>;
  isScanning: boolean;
  settings: ProtectionSettings;
  setSettings: React.Dispatch<React.SetStateAction<ProtectionSettings>>;
  onOpenInstallModal: () => void;
  onOpenDashboard: () => void;
}

export const FloatingExtensionDock: React.FC<FloatingExtensionDockProps> = ({
  currentTabUrl,
  activeScanResult,
  onScanUrl,
  isScanning,
  settings,
  setSettings,
  onOpenInstallModal,
  onOpenDashboard,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [testUrlInput, setTestUrlInput] = useState(currentTabUrl);

  const isThreat = activeScanResult && (activeScanResult.severity === "malicious" || activeScanResult.severity === "critical_zero_day");
  const isSuspicious = activeScanResult && activeScanResult.severity === "suspicious";

  const toggleSetting = (key: keyof ProtectionSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    soundManager.playSafeTone();
  };

  const handleQuickScan = async () => {
    if (!testUrlInput) return;
    soundManager.playScanPing();
    await onScanUrl(testUrlInput);
  };

  return (
    <>
      {/* Floating Extension Trigger Pill in Bottom-Right */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          id="floating-extension-pill-btn"
          onClick={() => {
            setIsOpen(!isOpen);
            soundManager.playSafeTone();
          }}
          className={`px-4 py-2.5 rounded-2xl shadow-2xl border flex items-center gap-2.5 transition-all active:scale-95 group font-mono text-xs font-bold ${
            isThreat
              ? "bg-red-950/90 text-red-300 border-red-500/60 shadow-red-950/60"
              : isSuspicious
              ? "bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-amber-950/60"
              : "bg-[#0B1120]/95 text-slate-100 border-slate-700/80 hover:border-cyan-500/60 shadow-black/80"
          }`}
          title="Open In-Browser Extension Popup"
        >
          <div className="relative flex items-center justify-center">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              isThreat ? "bg-red-600" : isSuspicious ? "bg-amber-500" : "bg-cyan-600"
            }`}>
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <span className="hidden sm:inline tracking-wider">
            PHISGUARD EXTENSION
          </span>

          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
            isThreat
              ? "bg-red-500/20 text-red-300 border border-red-500/40"
              : isSuspicious
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
          }`}>
            {isThreat ? "THREAT BLOCKED" : isSuspicious ? "SUSPICIOUS" : "SAFE SHIELD"}
          </span>

          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
          )}
        </button>
      </div>

      {/* Floating Extension Popup Container */}
      {isOpen && (
        <div 
          className="fixed bottom-18 right-5 z-40 w-96 max-w-[calc(100vw-40px)] bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden text-slate-200 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          
          {/* Extension Header */}
          <div className="bg-[#0B1120] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center shadow-sm">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xs tracking-wider text-slate-100 font-mono">
                  PHIS<span className="text-red-500">GUARD</span><span className="text-cyan-400">-Z</span>
                </span>
                <span className="text-[9px] text-slate-400 block font-mono">Extension Mode</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onOpenInstallModal}
                className="px-2 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                title="Download Extension for Chrome / Edge"
              >
                <Download className="w-3 h-3" />
                <span>Export (.zip)</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Extension Popup Content */}
          <div className="p-4 space-y-3.5 max-h-[70vh] overflow-y-auto">
            
            {/* Active URL & Scan Trigger */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>INSPECT URL / ACTIVE TAB</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Real-time
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testUrlInput}
                  onChange={(e) => setTestUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-[#090D18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleQuickScan}
                  disabled={isScanning || !testUrlInput}
                  className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1 shrink-0 transition-colors shadow-md"
                >
                  {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  <span>Scan</span>
                </button>
              </div>
            </div>

            {/* Current Protection Status Banner */}
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              isThreat
                ? "bg-red-950/40 border-red-500/50 text-red-300"
                : isSuspicious
                ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
                : "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isThreat
                  ? "bg-red-900/50 border-red-500"
                  : isSuspicious
                  ? "bg-amber-900/50 border-amber-500"
                  : "bg-emerald-900/50 border-emerald-500"
              }`}>
                {isThreat ? (
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                ) : isSuspicious ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
              </div>

              <div className="flex-1 min-w-0 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {activeScanResult?.category || "Safe Verified Domain"}
                  </span>
                  <span className="text-[10px] font-bold">
                    Risk: {activeScanResult?.riskScore || 0}/100
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate mt-0.5">
                  {activeScanResult?.brandTarget ? `Target: ${activeScanResult.brandTarget}` : "No credential interceptors active"}
                </p>
              </div>
            </div>

            {/* Extension Protection Fast Toggles */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[10px] uppercase text-slate-400 font-bold">Protection Controls</span>
              
              <div className="p-2.5 bg-[#090D18] rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-[11px]">Real-Time Shield</span>
                  <button
                    onClick={() => toggleSetting("realTimeShield")}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      settings.realTimeShield ? "bg-cyan-600" : "bg-slate-700"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.realTimeShield ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-[11px]">Auto-Block Zero-Days</span>
                  <button
                    onClick={() => toggleSetting("autoBlockMalicious")}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      settings.autoBlockMalicious ? "bg-red-600" : "bg-slate-700"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.autoBlockMalicious ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-[11px]">Zero-Day Heuristic Radar</span>
                  <button
                    onClick={() => toggleSetting("zeroDayProtection")}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      settings.zeroDayProtection ? "bg-purple-600" : "bg-slate-700"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.zeroDayProtection ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-cyan-300 text-[11px] flex items-center gap-1">
                    Scheduled Site Sweep
                  </span>
                  <button
                    onClick={() => toggleSetting("backgroundScheduledScan")}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      settings.backgroundScheduledScan ? "bg-cyan-600" : "bg-slate-700"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.backgroundScheduledScan ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-purple-300 text-[11px] flex items-center gap-1">
                    Threat Intel Auto-Sync
                  </span>
                  <button
                    onClick={() => toggleSetting("threatIntelSync")}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      settings.threatIntelSync ? "bg-purple-600" : "bg-slate-700"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.threatIntelSync ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Install in Browser Banner */}
            <div className="p-3 bg-[#090D18] rounded-xl border border-cyan-500/20 flex items-center justify-between gap-2">
              <div className="text-[11px] font-mono">
                <p className="font-bold text-cyan-300">Run as real Chrome Extension</p>
                <p className="text-[10px] text-slate-400">Load unpacked in chrome://extensions</p>
              </div>

              <button
                onClick={onOpenInstallModal}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-mono font-bold transition-colors flex items-center gap-1 shrink-0"
              >
                <span>Install</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* Extension Footer */}
          <div className="bg-[#0B1120] px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Engine v4.9.2-z</span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenDashboard();
              }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>Full Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};

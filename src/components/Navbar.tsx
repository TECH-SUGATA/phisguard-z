import React from "react";
import { 
  Shield, 
  ShieldAlert, 
  Cpu, 
  Globe, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Lock, 
  Zap,
  Activity,
  Layers,
  Mail,
  Binary,
  FileCheck,
  Puzzle
} from "lucide-react";
import { soundManager } from "../utils/audio";
import { SecurityMetrics } from "../types";

export type ActiveAppView = 'dashboard' | 'extension' | 'browser' | 'quarantine' | 'neural' | 'email' | 'advanced';

interface NavbarProps {
  currentView: ActiveAppView;
  setCurrentView: (view: ActiveAppView) => void;
  metrics: SecurityMetrics;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onQuickScanClick: () => void;
  onOpenAuditReport?: () => void;
  onOpenInstallModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  metrics,
  soundEnabled,
  setSoundEnabled,
  onQuickScanClick,
  onOpenAuditReport,
  onOpenInstallModal,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
    if (next) soundManager.playSafeTone();
  };

  return (
    <header className="border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-40 px-3 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand Logo & McAfee-style Shield */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-rose-700 to-amber-600 p-[1px] shadow-lg shadow-red-950/40">
            <div className="w-full h-full bg-[#0d121f] rounded-[11px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-500 fill-red-500/20" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B0F19] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-slate-100 font-mono">
                PHIS<span className="text-red-500">GUARD</span><span className="text-cyan-400">-Z</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30 rounded font-mono">
                PRO ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              Autonomous Zero-Day & Phishing Interceptor
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center gap-1 bg-[#111827] p-1 rounded-xl border border-slate-800 text-xs font-medium overflow-x-auto max-w-full">
          <button
            id="nav-tab-dashboard"
            onClick={() => setCurrentView('dashboard')}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              currentView === 'dashboard'
                ? 'bg-slate-800 text-cyan-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            id="nav-tab-email"
            onClick={() => setCurrentView('email')}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              currentView === 'email'
                ? 'bg-slate-800 text-red-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & BEC</span>
          </button>

          <button
            id="nav-tab-advanced"
            onClick={() => setCurrentView('advanced')}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              currentView === 'advanced'
                ? 'bg-slate-800 text-purple-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Zero-Day Sandbox</span>
          </button>

          <button
            id="nav-tab-extension"
            onClick={() => setCurrentView('extension')}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              currentView === 'extension'
                ? 'bg-slate-800 text-rose-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Popup</span>
          </button>

          <button
            id="nav-tab-browser"
            onClick={() => setCurrentView('browser')}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              currentView === 'browser'
                ? 'bg-slate-800 text-emerald-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </button>

          <button
            id="nav-tab-neural"
            onClick={() => setCurrentView('neural')}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              currentView === 'neural'
                ? 'bg-slate-800 text-amber-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Learner</span>
          </button>

          <button
            id="nav-tab-quarantine"
            onClick={() => setCurrentView('quarantine')}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              currentView === 'quarantine'
                ? 'bg-slate-800 text-cyan-300 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Vault</span>
          </button>
        </nav>

        {/* Right side telemetry & quick controls */}
        <div className="flex items-center gap-2">
          {/* Install Real Extension Button */}
          {onOpenInstallModal && (
            <button
              id="navbar-install-extension-btn"
              onClick={onOpenInstallModal}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Download & Install Chrome Extension (Manifest V3)"
            >
              <Puzzle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Install Extension</span>
            </button>
          )}

          {/* Audit Report Button */}
          {onOpenAuditReport && (
            <button
              id="navbar-audit-report-btn"
              onClick={onOpenAuditReport}
              className="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Enterprise Security Audit Report (PDF & CSV)"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Audit Report</span>
            </button>
          )}

          {/* Quick Scan Action */}
          <button
            id="navbar-quick-scan-btn"
            onClick={onQuickScanClick}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            title="Inspect Suspicious URL"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Inspect URL</span>
          </button>

          {/* Audio siren toggle */}
          <button
            id="navbar-sound-toggle-btn"
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              soundEnabled
                ? 'bg-slate-800/80 border-slate-700 text-cyan-400 hover:bg-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundEnabled ? "Threat Audio Siren Enabled" : "Threat Audio Muted"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Live Engine Status indicator */}
          <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-slate-800 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              {metrics.modelEngineVersion}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};

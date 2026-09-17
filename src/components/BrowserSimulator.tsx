import React, { useState } from "react";
import { 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Lock, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink, 
  AlertTriangle, 
  HelpCircle,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Info,
  CornerDownRight
} from "lucide-react";
import { SAMPLE_THREATS, ThreatSample } from "../data/sampleThreats";
import { ScannedUrlResult, ProtectionSettings } from "../types";
import { soundManager } from "../utils/audio";

interface BrowserSimulatorProps {
  currentUrl: string;
  onNavigate: (url: string) => Promise<ScannedUrlResult | null>;
  activeScanResult: ScannedUrlResult | null;
  onOpenAlertModal: (result: ScannedUrlResult) => void;
  settings: ProtectionSettings;
}

export const BrowserSimulator: React.FC<BrowserSimulatorProps> = ({
  currentUrl,
  onNavigate,
  activeScanResult,
  onOpenAlertModal,
  settings,
}) => {
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleGo = async (targetUrl: string) => {
    setIsLoading(true);
    setInputUrl(targetUrl);
    soundManager.playScanPing();
    const res = await onNavigate(targetUrl);
    setIsLoading(false);

    if (res && (res.severity === 'malicious' || res.severity === 'critical_zero_day')) {
      if (settings.soundAlerts) soundManager.playThreatAlert();
      if (settings.autoBlockMalicious) {
        onOpenAlertModal(res);
      }
    } else {
      soundManager.playSafeTone();
    }
  };

  const isBlocked = activeScanResult && activeScanResult.isBlocked && settings.autoBlockMalicious;

  return (
    <div className="space-y-6">
      
      {/* Top Banner explaining the simulator */}
      <div className="bg-[#0B1120] p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
            <Globe className="w-4 h-4 text-cyan-400" />
            LIVE INTERNET BROWSING & LINK INTERCEPTOR SIMULATOR
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how PHISGUARD-Z inspects hyperlinks on the fly, analyzes zero-day anomalies, and intercepts credential harvesters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Quick Test Scenarios:</span>
        </div>
      </div>

      {/* Preset Threat Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {SAMPLE_THREATS.map((sample) => (
          <button
            key={sample.id}
            id={`preset-btn-${sample.id}`}
            onClick={() => handleGo(sample.url)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              inputUrl === sample.url
                ? 'bg-red-600/30 border-red-500 text-red-300 shadow-md font-bold'
                : sample.expectedRisk > 50
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-red-500/50 hover:text-red-400'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400'
            }`}
          >
            {sample.expectedRisk > 50 ? (
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="truncate max-w-[170px]">{sample.name}</span>
          </button>
        ))}
      </div>

      {/* Simulated Browser Chrome */}
      <div className="rounded-2xl border border-slate-700/80 bg-[#0F172A] shadow-2xl shadow-black overflow-hidden flex flex-col">
        
        {/* Browser Title Bar & Tabs */}
        <div className="bg-[#0B1120] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* macOS / Modern Browser Dot controls */}
            <div className="flex items-center gap-1.5 mr-3">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            </div>

            {/* Active Tab */}
            <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1 rounded-t-lg border-t border-x border-slate-700/70 text-xs font-mono text-slate-200">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span className="max-w-[200px] truncate">{inputUrl || 'New Tab'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-[11px] text-slate-400">EXTENSION ATTACHED:</span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold">
              <Shield className="w-3 h-3 fill-red-400/20" />
              PHISGUARD-Z ON
            </span>
          </div>
        </div>

        {/* Address Bar Navigation Row */}
        <div className="bg-[#0D1527] border-b border-slate-800/80 p-2.5 flex items-center gap-2">
          
          <button
            onClick={() => handleGo("https://github.com/microsoft/vscode")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleGo(inputUrl)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reload & Rescan"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* URL Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGo(inputUrl);
            }}
            className="flex-1 flex items-center bg-[#090D18] rounded-xl border border-slate-700/60 px-3 py-1.5 focus-within:border-cyan-500 transition-all"
          >
            <div className="flex items-center gap-1.5 mr-2 shrink-0">
              <Lock className={`w-3.5 h-3.5 ${
                activeScanResult?.severity === 'safe'
                  ? 'text-emerald-400'
                  : activeScanResult?.severity === 'suspicious'
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`} />
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">https://</span>
            </div>

            <input
              id="browser-address-input"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste or type any website link to test..."
              className="flex-1 bg-transparent text-xs font-mono text-slate-200 outline-none placeholder:text-slate-500"
            />

            {/* Pinned PHISGUARD-Z Safety Status Badge inside address bar (like McAfee WebAdvisor) */}
            {activeScanResult && (
              <div 
                onClick={() => onOpenAlertModal(activeScanResult)}
                className={`cursor-pointer shrink-0 ml-2 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                  activeScanResult.severity === 'safe'
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/60'
                    : activeScanResult.severity === 'suspicious'
                    ? 'bg-amber-950/80 border-amber-500/50 text-amber-400 hover:bg-amber-900/60'
                    : 'bg-red-950/80 border-red-500/60 text-red-400 hover:bg-red-900/60 animate-pulse'
                }`}
                title="Click for full threat forensics"
              >
                {activeScanResult.severity === 'safe' ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <ShieldAlert className="w-3 h-3" />
                )}
                <span>PHISGUARD: {activeScanResult.riskScore}% RISK</span>
              </div>
            )}
          </form>

          <button
            id="browser-navigate-submit"
            onClick={() => handleGo(inputUrl)}
            disabled={isLoading}
            className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold font-mono transition-all active:scale-95 shadow-md shadow-red-950/50 flex items-center gap-1.5"
          >
            <span>Navigate</span>
          </button>
        </div>

        {/* Browser Viewport Screen */}
        <div className="min-h-[460px] bg-[#0A0E1A] p-6 relative overflow-y-auto">
          
          {isLoading && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin"></div>
                <Shield className="w-5 h-5 text-red-400 absolute" />
              </div>
              <div className="text-center font-mono space-y-1">
                <p className="text-xs font-bold text-slate-200">PHISGUARD-Z INTERCEPTOR ACTIVE</p>
                <p className="text-[11px] text-cyan-400">Computing zero-day heuristics & neural entropy score...</p>
              </div>
            </div>
          )}

          {/* IF THREAT IS BLOCKED: RENDER FULL-SCREEN DEFENSIVE INTERCEPTION HERO (McAfee style) */}
          {isBlocked ? (
            <div className="max-w-xl mx-auto py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="w-20 h-20 mx-auto rounded-3xl bg-red-950/60 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-2xl shadow-red-950 threatPulse">
                <ShieldAlert className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/40 font-mono inline-block">
                  ⚠️ CONNECTION INTERCEPTED BY PHISGUARD-Z
                </span>
                <h3 className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight">
                  Malicious Link Blocked for Your Protection
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  The website at <span className="text-red-300 font-mono break-all">{activeScanResult?.domain}</span> has been flagged as an active <strong>{activeScanResult?.category}</strong>.
                </p>
              </div>

              {/* Threat Details Card */}
              <div className="bg-[#0F172A] border border-red-900/60 rounded-xl p-4 text-left font-mono space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Target Impersonated:</span>
                  <span className="text-cyan-400 font-bold">{activeScanResult?.brandTarget || 'Enterprise Portal'}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Risk Assessment Index:</span>
                  <span className="text-red-400 font-bold">{activeScanResult?.riskScore}/100 Critical</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Zero-Day Anomaly Detection:</span>
                  <span className="text-amber-400 font-bold">{activeScanResult?.zeroDayScore}% Probable Zero-Day</span>
                </div>

                <p className="text-[11px] text-slate-300 leading-normal">
                  <strong>Reason:</strong> {activeScanResult?.indicators[0]?.detail || activeScanResult?.remediationAdvice}
                </p>
              </div>

              {/* Interception Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  id="btn-return-safety"
                  onClick={() => handleGo("https://github.com/microsoft/vscode")}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold font-mono shadow-lg shadow-emerald-950 transition-all"
                >
                  Return to Safe Verified Webpage
                </button>

                <button
                  id="btn-inspect-forensics"
                  onClick={() => activeScanResult && onOpenAlertModal(activeScanResult)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold font-mono border border-slate-700 transition-all"
                >
                  Inspect Forensics & Telemetry
                </button>
              </div>

            </div>
          ) : (
            /* IF NOT BLOCKED: RENDER SIMULATED WEBPAGE CONTENT WITH INTERCEPTABLE HYPERLINKS */
            <div className="max-w-2xl mx-auto space-y-6 text-slate-200">
              
              {/* Simulated Page Header */}
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Web Portal Simulation Page
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hover over or click any of the links below to watch PHISGUARD-Z evaluate and protect in real time:
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Real-time link inspection active
                </div>
              </div>

              {/* Simulated Article with Diverse Clickable Links */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <p>
                  You are currently testing web navigation inside the sandboxed simulation browser. The links below represent a mix of legitimate enterprise resources, zero-day phishing payloads, homograph attacks, and credential traps.
                </p>

                {/* Grid of Interactive Test Links with Floating Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  
                  {SAMPLE_THREATS.map((threat) => (
                    <div
                      key={threat.id}
                      onMouseEnter={() => setHoveredLink(threat.id)}
                      onMouseLeave={() => setHoveredLink(null)}
                      onClick={() => handleGo(threat.url)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all relative group ${
                        threat.expectedRisk > 50
                          ? 'bg-slate-900/90 border-slate-800 hover:border-red-500/70 hover:bg-red-950/20'
                          : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/70 hover:bg-emerald-950/20'
                      }`}
                    >
                      {/* Floating Safety Tag (like McAfee WebAdvisor badge) */}
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 border ${
                        threat.expectedRisk > 50
                          ? 'bg-red-950/80 text-red-400 border-red-500/40'
                          : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                      }`}>
                        {threat.expectedRisk > 50 ? (
                          <>
                            <ShieldAlert className="w-3 h-3" />
                            <span>Risk: {threat.expectedRisk}%</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            <span>Safe</span>
                          </>
                        )}
                      </div>

                      <div className="pr-20">
                        <h4 className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                          {threat.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {threat.description}
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/60 font-mono text-[10px] text-slate-500 truncate">
                        {threat.url}
                      </div>
                    </div>
                  ))}

                </div>

                <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>How Link Interceptor Works:</strong> In a production browser extension, PHISGUARD-Z hooks `chrome.webRequest.onBeforeRequest` and DOM link click handlers. It computes lexical entropy, queries the local neural pattern cache in &lt;1ms, and triggers an immediate defense intercept before cookies or tokens can leak.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

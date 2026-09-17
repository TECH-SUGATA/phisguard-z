import React, { useState } from "react";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  Sliders, 
  History, 
  Zap, 
  Lock, 
  ChevronRight,
  Eye,
  Radio,
  FileSearch,
  Puzzle,
  Download,
  Clock,
  CloudDownload,
  RotateCcw
} from "lucide-react";
import { ScannedUrlResult, ProtectionSettings, SecurityMetrics } from "../types";
import { soundManager } from "../utils/audio";

interface ExtensionPopupProps {
  currentTabUrl: string;
  activeScanResult: ScannedUrlResult | null;
  onScanUrl: (url: string) => Promise<void>;
  isScanning: boolean;
  settings: ProtectionSettings;
  setSettings: React.Dispatch<React.SetStateAction<ProtectionSettings>>;
  recentThreats: ScannedUrlResult[];
  onOpenDashboard: () => void;
  onSelectThreat: (threat: ScannedUrlResult) => void;
  onSimulatePageScan: () => void;
  onOpenInstallModal?: () => void;
  onTriggerThreatIntelSync?: () => Promise<void>;
  onTriggerBackgroundScan?: () => Promise<void>;
  isSyncingIntel?: boolean;
  isBackgroundScanning?: boolean;
}

export const ExtensionPopup: React.FC<ExtensionPopupProps> = ({
  currentTabUrl,
  activeScanResult,
  onScanUrl,
  isScanning,
  settings,
  setSettings,
  recentThreats,
  onOpenDashboard,
  onSelectThreat,
  onSimulatePageScan,
  onOpenInstallModal,
  onTriggerThreatIntelSync,
  onTriggerBackgroundScan,
  isSyncingIntel = false,
  isBackgroundScanning = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'settings' | 'history'>('overview');

  const toggleSetting = (key: keyof ProtectionSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    soundManager.playSafeTone();
  };

  const isCurrentThreat = activeScanResult && (activeScanResult.severity === 'malicious' || activeScanResult.severity === 'critical_zero_day');
  const isCurrentSuspicious = activeScanResult && activeScanResult.severity === 'suspicious';

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Extension Container Styled as Chrome/Edge Extension Popup */}
      <div className="w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-slate-200">
        
        {/* Top Browser Extension Header Bar */}
        <div className="bg-[#0B1120] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center shadow-sm shadow-red-950/50">
              <Shield className="w-4 h-4 text-white fill-white/20" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-1.5">
                PHISGUARD-Z <span className="text-[10px] text-cyan-400 font-normal">v4.9.4</span>
              </h2>
              <p className="text-[10px] text-slate-400">McAfee-Grade Real-Time Guard</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                settings.realTimeShield ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                settings.realTimeShield ? 'bg-emerald-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 pl-1">
              {settings.realTimeShield ? "SHIELD ACTIVE" : "PAUSED"}
            </span>
          </div>
        </div>

        {/* Real Chrome Extension Export Banner */}
        {onOpenInstallModal && (
          <div className="bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border-b border-cyan-500/20 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
              <Puzzle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Use as real Chrome / Edge extension</span>
            </div>
            <button
              id="ext-banner-install-btn"
              onClick={onOpenInstallModal}
              className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Install (.zip)</span>
            </button>
          </div>
        )}

        {/* Sub-tab Navigation */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-[#0c1322] text-xs text-center font-medium">
          <button
            id="ext-tab-overview"
            onClick={() => setActiveSubTab('overview')}
            className={`py-2 border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeSubTab === 'overview'
                ? 'border-cyan-400 text-cyan-400 font-semibold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Overview
          </button>
          <button
            id="ext-tab-history"
            onClick={() => setActiveSubTab('history')}
            className={`py-2 border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'border-cyan-400 text-cyan-400 font-semibold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Threats ({recentThreats.length})
          </button>
          <button
            id="ext-tab-settings"
            onClick={() => setActiveSubTab('settings')}
            className={`py-2 border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeSubTab === 'settings'
                ? 'border-cyan-400 text-cyan-400 font-semibold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Engines
          </button>
        </div>

        {/* Main Content Areas */}
        {activeSubTab === 'overview' && (
          <div className="p-4 space-y-4">
            
            {/* Massive Status Badge */}
            <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
              isCurrentThreat
                ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-950/50'
                : isCurrentSuspicious
                ? 'bg-amber-950/30 border-amber-500/50'
                : 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                isCurrentThreat
                  ? 'bg-red-900/60 border-red-500 text-red-400 threatPulse'
                  : isCurrentSuspicious
                  ? 'bg-amber-900/40 border-amber-500 text-amber-400'
                  : 'bg-emerald-900/40 border-emerald-500 text-emerald-400 shield-pulse-safe'
              }`}>
                {isCurrentThreat ? (
                  <ShieldAlert className="w-8 h-8" />
                ) : isCurrentSuspicious ? (
                  <AlertTriangle className="w-8 h-8" />
                ) : (
                  <ShieldCheck className="w-8 h-8" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block ${
                  isCurrentThreat
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : isCurrentSuspicious
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isCurrentThreat
                    ? 'MALICIOUS THREAT DETECTED'
                    : isCurrentSuspicious
                    ? 'SUSPICIOUS LINK ANOMALY'
                    : 'REAL-TIME SHIELD OPTIMAL'}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">
                  {isCurrentThreat
                    ? activeScanResult?.category || 'Zero-Day Phishing Attack'
                    : isCurrentSuspicious
                    ? 'Caution Advised on this Web Domain'
                    : 'All Active Web Traffic Secure'}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {isCurrentThreat
                    ? activeScanResult?.remediationAdvice || 'Connection intercepted'
                    : 'Zero-day heuristics & neural pattern engine active'}
                </p>
              </div>
            </div>

            {/* Current Tab Inspection Box */}
            <div className="bg-[#0B1120] rounded-xl border border-slate-800 p-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1 font-mono">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  ACTIVE TAB INSPECTION:
                </span>
                <button
                  id="ext-re-scan-btn"
                  onClick={() => onScanUrl(currentTabUrl)}
                  disabled={isScanning}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-[11px]"
                  title="Rescan current tab with AI zero-day model"
                >
                  <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
                  Rescan
                </button>
              </div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-200 break-all flex items-center justify-between gap-2">
                <span className="truncate">{currentTabUrl}</span>
                {activeScanResult && (
                  <span className={`shrink-0 px-2 py-0.5 text-[10px] rounded font-bold uppercase ${
                    activeScanResult.severity === 'safe'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : activeScanResult.severity === 'suspicious'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {activeScanResult.riskScore}/100 Risk
                  </span>
                )}
              </div>

              {/* Zero-day & Heuristics mini-metrics */}
              {activeScanResult && (
                <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800/60 text-center font-mono">
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-400">Zero-Day Anomaly</p>
                    <p className={`text-xs font-bold ${
                      activeScanResult.zeroDayScore > 70 ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {activeScanResult.zeroDayScore}%
                    </p>
                  </div>
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-400">Domain Entropy</p>
                    <p className="text-xs font-bold text-cyan-400">
                      {activeScanResult.entropyScore} bits
                    </p>
                  </div>
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-400">Confidence</p>
                    <p className="text-xs font-bold text-slate-200">
                      {activeScanResult.confidence}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions in Extension */}
            <div className="space-y-2">
              <button
                id="ext-page-scan-btn"
                onClick={onSimulatePageScan}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-cyan-900/30 active:scale-[0.98] transition-all"
              >
                <FileSearch className="w-4 h-4" />
                Deep Scan All Embedded Links in Page
              </button>

              <button
                id="ext-open-soc-btn"
                onClick={onOpenDashboard}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                Open PHISGUARD-Z SOC Security Console
              </button>
            </div>

          </div>
        )}

        {/* Threats History Sub-Tab */}
        {activeSubTab === 'history' && (
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Recent Interceptions ({recentThreats.length})</span>
              <span className="font-mono text-[10px] text-emerald-400">Auto-Quarantine Active</span>
            </div>

            {recentThreats.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                No malicious threats detected in current session.
              </div>
            ) : (
              recentThreats.map((threat) => (
                <div
                  key={threat.id}
                  onClick={() => onSelectThreat(threat)}
                  className="p-2.5 bg-[#0B1120] hover:bg-slate-800/80 border border-slate-800 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {threat.category}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                      {threat.riskScore}%
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 truncate">
                    {threat.url}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono">
                    <span>Target: {threat.brandTarget || 'General'}</span>
                    <span className="text-cyan-400 flex items-center gap-1">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Protection Engines Config Sub-Tab */}
        {activeSubTab === 'settings' && (
          <div className="p-4 space-y-3.5 max-h-[440px] overflow-y-auto">
            <p className="text-xs text-slate-400 mb-2">
              Configure real-time heuristics, scheduled site sweeps, and cloud threat intel synchronization:
            </p>

            {/* NEW: Background Scheduled Site Scanning */}
            <div className="p-3 bg-[#0B1120] rounded-xl border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="pr-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <h4 className="text-xs font-semibold text-slate-100">Background Scheduled Site Scanning</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                      {settings.backgroundScheduledScan ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    Periodically audits background open tabs and network domains for uncataloged zero-day lures.
                  </p>
                </div>
                <button
                  id="toggle-setting-backgroundScheduledScan"
                  onClick={() => toggleSetting('backgroundScheduledScan')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                    settings.backgroundScheduledScan ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                </button>
              </div>

              {settings.backgroundScheduledScan && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-1 text-slate-400">
                    <span>Interval:</span>
                    {[5, 15, 30, 60].map((min) => (
                      <button
                        key={min}
                        onClick={() => setSettings(prev => ({ ...prev, scheduledScanIntervalMinutes: min }))}
                        className={`px-1.5 py-0.5 rounded transition-colors ${
                          settings.scheduledScanIntervalMinutes === min
                            ? 'bg-cyan-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {min}m
                      </button>
                    ))}
                  </div>

                  {onTriggerBackgroundScan && (
                    <button
                      onClick={onTriggerBackgroundScan}
                      disabled={isBackgroundScanning}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className={`w-3 h-3 ${isBackgroundScanning ? 'animate-spin' : ''}`} />
                      {isBackgroundScanning ? 'Scanning...' : 'Sweep Now'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* NEW: Threat Intel Synchronization Updates */}
            <div className="p-3 bg-[#0B1120] rounded-xl border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="pr-2">
                  <div className="flex items-center gap-1.5">
                    <CloudDownload className="w-3.5 h-3.5 text-purple-400" />
                    <h4 className="text-xs font-semibold text-slate-100">Threat Intel Live Synchronization</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                      {settings.threatIntelSync ? 'SYNCED' : 'OFFLINE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    Continuously syncs novel zero-day attack vectors, IOC signatures, and global SOC patterns.
                  </p>
                </div>
                <button
                  id="toggle-setting-threatIntelSync"
                  onClick={() => toggleSetting('threatIntelSync')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                    settings.threatIntelSync ? 'bg-purple-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                </button>
              </div>

              {settings.threatIntelSync && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-1 text-slate-400">
                    <span>Sync Every:</span>
                    {[5, 10, 30].map((min) => (
                      <button
                        key={min}
                        onClick={() => setSettings(prev => ({ ...prev, threatIntelSyncIntervalMinutes: min }))}
                        className={`px-1.5 py-0.5 rounded transition-colors ${
                          settings.threatIntelSyncIntervalMinutes === min
                            ? 'bg-purple-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {min}m
                      </button>
                    ))}
                  </div>

                  {onTriggerThreatIntelSync && (
                    <button
                      onClick={onTriggerThreatIntelSync}
                      disabled={isSyncingIntel}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/20 flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncingIntel ? 'animate-spin' : ''}`} />
                      {isSyncingIntel ? 'Syncing...' : 'Force Sync'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {[
              {
                key: 'realTimeShield' as const,
                title: 'Real-Time Web Shield',
                desc: 'Inspects outbound requests and DNS lookups instantly.',
                active: settings.realTimeShield,
              },
              {
                key: 'zeroDayProtection' as const,
                title: 'Zero-Day Predictive Defense',
                desc: 'Uses machine learning to identify novel uncataloged attack payloads.',
                active: settings.zeroDayProtection,
              },
              {
                key: 'autonomousLearning' as const,
                title: 'Autonomous Pattern Learning',
                desc: 'Dynamically synthesizes defense signatures from new domains.',
                active: settings.autonomousLearning,
              },
              {
                key: 'autoBlockMalicious' as const,
                title: 'Automatic Link Quarantine',
                desc: 'Blocks malicious clicks before browser socket initiates TCP handshake.',
                active: settings.autoBlockMalicious,
              },
              {
                key: 'soundAlerts' as const,
                title: 'Tactical Audio Alerts',
                desc: 'Sounds defensive siren when phishing payloads are caught.',
                active: settings.soundAlerts,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-2.5 bg-[#0B1120] rounded-xl border border-slate-800"
              >
                <div className="pr-2">
                  <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
                </div>
                <button
                  id={`toggle-setting-${item.key}`}
                  onClick={() => toggleSetting(item.key)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    item.active ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-[#080D1A] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <Radio className="w-3 h-3 animate-pulse" />
            Neural Guard v4.9.4
          </span>
          <span className="text-slate-400">Cloud Threat Feed Synced</span>
        </div>

      </div>
    </div>
  );
};

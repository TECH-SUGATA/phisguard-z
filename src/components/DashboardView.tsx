import React, { useState } from "react";
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  AlertTriangle, 
  Activity, 
  Search, 
  Lock, 
  ArrowUpRight, 
  ExternalLink, 
  Filter, 
  Download, 
  RefreshCw, 
  Zap, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  Database,
  BarChart3,
  Layers,
  FileCode,
  Sliders
} from "lucide-react";
import { ScannedUrlResult, SecurityMetrics, ThreatSeverity } from "../types";
import { SAMPLE_THREATS } from "../data/sampleThreats";
import { soundManager } from "../utils/audio";
import { generateAuditReportPDF, downloadThreatLogsCSV } from "../utils/reportExporter";
import { FileText, Table, Clock, CloudDownload, RotateCcw } from "lucide-react";
import { ThreatHeatmap } from "./ThreatHeatmap";
import { ProtectionSettings } from "../types";

interface DashboardViewProps {
  metrics: SecurityMetrics;
  logs: ScannedUrlResult[];
  onScanUrl: (url: string) => Promise<ScannedUrlResult | null>;
  isScanning: boolean;
  activeScanResult: ScannedUrlResult | null;
  onOpenAlertModal: (result: ScannedUrlResult) => void;
  onLearnPattern: (result: ScannedUrlResult) => void;
  onQuarantine: (url: string) => void;
  onOpenAuditModal?: () => void;
  settings?: ProtectionSettings;
  setSettings?: React.Dispatch<React.SetStateAction<ProtectionSettings>>;
  onTriggerThreatIntelSync?: () => Promise<void>;
  onTriggerBackgroundScan?: () => Promise<void>;
  isSyncingIntel?: boolean;
  isBackgroundScanning?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  logs,
  onScanUrl,
  isScanning,
  activeScanResult,
  onOpenAlertModal,
  onLearnPattern,
  onQuarantine,
  onOpenAuditModal,
  settings,
  setSettings,
  onTriggerThreatIntelSync,
  onTriggerBackgroundScan,
  isSyncingIntel = false,
  isBackgroundScanning = false,
}) => {
  const [inputUrl, setInputUrl] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [searchLogQuery, setSearchLogQuery] = useState("");
  const [selectedScanStep, setSelectedScanStep] = useState<string | null>(null);

  const handleManualScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    soundManager.playScanPing();
    const res = await onScanUrl(inputUrl);
    if (res && (res.severity === 'malicious' || res.severity === 'critical_zero_day')) {
      soundManager.playThreatAlert();
    } else {
      soundManager.playSafeTone();
    }
  };

  const handleTestPreset = async (url: string) => {
    setInputUrl(url);
    soundManager.playScanPing();
    const res = await onScanUrl(url);
    if (res && (res.severity === 'malicious' || res.severity === 'critical_zero_day')) {
      soundManager.playThreatAlert();
    } else {
      soundManager.playSafeTone();
    }
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phisguard-z-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    soundManager.playSafeTone();
  };

  const handleDownloadPDF = () => {
    soundManager.playScanPing();
    generateAuditReportPDF(metrics, logs);
  };

  const handleDownloadCSV = () => {
    soundManager.playScanPing();
    downloadThreatLogsCSV(logs);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    const matchesSearch = 
      log.url.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      (log.brandTarget && log.brandTarget.toLowerCase().includes(searchLogQuery.toLowerCase()));
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* KPI Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Links Scanned */}
        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Links Inspected</span>
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2 font-mono">
            <span className="text-3xl font-extrabold text-slate-100">{metrics.totalScanned.toLocaleString()}</span>
            <span className="text-xs text-cyan-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Real-time web socket interceptor active
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Card 2: Threats Neutralized */}
        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Threats Neutralized</span>
            <div className="p-2 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2 font-mono">
            <span className="text-3xl font-extrabold text-red-400">{metrics.blockedThreats.toLocaleString()}</span>
            <span className="text-xs text-red-400/80 font-bold">100% Intercepted</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Credential harvesters & homoglyphs dropped
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Card 3: Zero-Day Exploits Caught */}
        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Zero-Day Attacks</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2 font-mono">
            <span className="text-3xl font-extrabold text-amber-400">{metrics.zeroDayIntercepted.toLocaleString()}</span>
            <span className="text-xs text-amber-400 font-bold">Heuristic AI</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Uncataloged novel payload signatures
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Card 4: Autonomous Patterns */}
        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Learned Patterns</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2 font-mono">
            <span className="text-3xl font-extrabold text-purple-400">{metrics.activePatternsLearned}</span>
            <span className="text-xs text-purple-400 font-bold">Auto-Sync</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Model {metrics.modelEngineVersion} continuous
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

      </div>

      {/* Deep Link & Zero-Day Threat Inspection Lab */}
      <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              DEEP LINK & ZERO-DAY NEURAL INSPECTION LAB
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste any URL or suspicious hyperlink to execute real-time Shannon entropy scoring, Punycode decoding, and Gemini zero-day forensics.
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Gemini 3.8-Flash Neural Engine Active
          </span>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleManualScan} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="dashboard-scan-input"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste URL (e.g. https://login.microsoftonline.corp-auth-verify.xyz/auth)..."
              className="w-full bg-[#090D18] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-100 outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <button
            id="dashboard-scan-submit-btn"
            type="submit"
            disabled={isScanning || !inputUrl}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono shadow-lg shadow-cyan-950/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Payloads...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Execute Deep Scan</span>
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Preset Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-slate-400 text-[11px] shrink-0">Test Presets:</span>
          {SAMPLE_THREATS.slice(0, 5).map((threat) => (
            <button
              key={threat.id}
              type="button"
              onClick={() => handleTestPreset(threat.url)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-400 transition-colors shrink-0"
            >
              {threat.name.split(" ")[0]} ({threat.type.split(" ")[0]})
            </button>
          ))}
        </div>

        {/* Scan Result Details Card */}
        {activeScanResult && (
          <div className={`p-5 rounded-2xl border transition-all animate-in fade-in duration-300 space-y-4 ${
            activeScanResult.severity === 'safe'
              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-xl shadow-emerald-950/20'
              : activeScanResult.severity === 'suspicious'
              ? 'bg-amber-950/20 border-amber-500/40'
              : 'bg-red-950/30 border-red-500/60 shadow-xl shadow-red-950/40'
          }`}>
            
            {/* Header Result Line */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  activeScanResult.severity === 'safe'
                    ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400'
                    : activeScanResult.severity === 'suspicious'
                    ? 'bg-amber-900/40 border-amber-500 text-amber-400'
                    : 'bg-red-900/50 border-red-500 text-red-400'
                }`}>
                  {activeScanResult.severity === 'safe' ? (
                    <ShieldCheck className="w-6 h-6" />
                  ) : (
                    <ShieldAlert className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      activeScanResult.severity === 'safe'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : activeScanResult.severity === 'suspicious'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {activeScanResult.severity.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Engine: {activeScanResult.detectionEngine}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 font-mono mt-0.5">
                    {activeScanResult.category}
                  </h3>
                </div>
              </div>

              {/* Action Buttons for Result */}
              <div className="flex items-center gap-2">
                {activeScanResult.isBlocked && (
                  <button
                    onClick={() => onQuarantine(activeScanResult.url)}
                    className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/50 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Quarantine
                  </button>
                )}

                <button
                  onClick={() => onLearnPattern(activeScanResult)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/50 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5" />
                  Learn Pattern
                </button>

                <button
                  onClick={() => onOpenAlertModal(activeScanResult)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  Forensic Modal
                </button>
              </div>
            </div>

            {/* Target URL */}
            <div className="p-2.5 bg-[#090D18] rounded-xl border border-slate-800 font-mono text-xs text-slate-200 break-all select-all">
              {activeScanResult.url}
            </div>

            {/* 4 Forensic Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400">Total Risk Score</p>
                <p className={`text-xl font-extrabold mt-0.5 ${
                  activeScanResult.riskScore > 70 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {activeScanResult.riskScore}/100
                </p>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400">Zero-Day Anomaly</p>
                <p className={`text-xl font-extrabold mt-0.5 ${
                  activeScanResult.zeroDayScore > 70 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {activeScanResult.zeroDayScore}%
                </p>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400">Domain Entropy</p>
                <p className="text-xl font-extrabold text-cyan-400 mt-0.5">
                  {activeScanResult.entropyScore} bits
                </p>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400">Punycode Homoglyph</p>
                <p className={`text-xl font-extrabold mt-0.5 ${
                  activeScanResult.hasPunycode ? 'text-red-400' : 'text-slate-300'
                }`}>
                  {activeScanResult.hasPunycode ? 'DETECTED' : 'CLEAN'}
                </p>
              </div>
            </div>

            {/* AI Zero-Day Analysis Summary */}
            {activeScanResult.aiZeroDayAnalysis && (
              <div className="p-3.5 bg-gradient-to-r from-slate-900 to-purple-950/30 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold font-mono mb-1">
                  <Cpu className="w-3.5 h-3.5" />
                  ADVANCED MACHINE LEARNING ZERO-DAY REPORT:
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {activeScanResult.aiZeroDayAnalysis}
                </p>
              </div>
            )}

            {/* Indicator Badges */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
                Active Forensic Indicators ({activeScanResult.indicators.length}):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeScanResult.indicators.map((ind, idx) => (
                  <div key={idx} className="p-2 bg-slate-900/90 rounded-lg border border-slate-800 text-xs">
                    <div className="flex items-center justify-between font-mono font-bold text-slate-200">
                      <span className="flex items-center gap-1.5 text-red-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        {ind.label}
                      </span>
                      <span className="text-[10px] text-slate-500">{ind.code}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ind.detail}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Predictive Analytics & Threat Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Threat Distribution Bars */}
        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Attack Vector Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Telemetry</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { label: "Credential Harvesting (AiTM)", pct: 46, color: "bg-red-500" },
              { label: "Homograph Domain Spoofing", pct: 24, color: "bg-amber-500" },
              { label: "Web3 Permit2 Drainers", pct: 18, color: "bg-purple-500" },
              { label: "Zero-Day Obfuscated Payloads", pct: 12, color: "bg-cyan-500" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>{item.label}</span>
                  <span className="font-bold">{item.pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Risk TLD Watchlist */}
        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              Adversarial TLD Prevalence
            </h3>
            <span className="text-[10px] font-mono text-red-400">High Risk</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {[
              { tld: ".xyz", threatLevel: "94% Anomaly", desc: "Heavy AiTM reverse-proxy deployment" },
              { tld: ".top", threatLevel: "91% Anomaly", desc: "Punycode & Cyrillic homoglyph campaigns" },
              { tld: ".click", threatLevel: "88% Anomaly", desc: "Fake banking security SMS redirection" },
              { tld: ".bond", threatLevel: "86% Anomaly", desc: "Web3 wallet drainer smart-contract gateways" },
              { tld: ".cfd", threatLevel: "82% Anomaly", desc: "DocuSign & enterprise invoice phishing" },
            ].map((item) => (
              <div key={item.tld} className="p-2 bg-[#090D18] rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 text-xs">{item.tld}</span>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
                <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  {item.threatLevel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Autonomous Feature Extractor Status */}
        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              Autonomous Self-Learning
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">Active</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <p className="leading-relaxed">
              Whenever an uncataloged threat domain is flagged, the neural engine extracts reusable lexical markers and automatically redistributes firewall rules.
            </p>

            <div className="p-3 bg-[#090D18] rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Learned Rules:</span>
                <span className="text-purple-400 font-bold">{metrics.activePatternsLearned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Heuristic Latency:</span>
                <span className="text-cyan-400 font-bold">&lt; 1.2 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">False-Positive Rate:</span>
                <span className="text-emerald-400 font-bold">0.014%</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[10px] font-mono text-slate-400">
                Next scheduled continuous weight optimization in 4 minutes.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Autonomous Scheduled Scanning & Threat Intel Synchronization Bar */}
      {settings && setSettings && (
        <div className="bg-[#0B1120] rounded-2xl border border-slate-800/90 p-4 md:p-5 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card 1: Scheduled Background Site Scanner */}
          <div className="p-4 bg-[#070B14] rounded-xl border border-cyan-500/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wide">
                    Background Scheduled Site Scanning
                  </span>
                </div>
                <button
                  id="dash-toggle-bg-scan"
                  onClick={() => {
                    setSettings((prev) => ({
                      ...prev,
                      backgroundScheduledScan: !prev.backgroundScheduledScan,
                    }));
                    soundManager.playSafeTone();
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    settings.backgroundScheduledScan ? 'bg-cyan-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Autonomously audits active background browser tabs and enterprise intranet/cloud assets for newly weaponized zero-day phishing kits.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[11px]">Interval:</span>
                {[5, 15, 30, 60].map((min) => (
                  <button
                    key={min}
                    onClick={() => setSettings((prev) => ({ ...prev, scheduledScanIntervalMinutes: min }))}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
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
                  id="dash-run-bg-sweep-btn"
                  onClick={onTriggerBackgroundScan}
                  disabled={isBackgroundScanning}
                  className="px-3 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isBackgroundScanning ? 'animate-spin' : ''}`} />
                  {isBackgroundScanning ? 'Scanning...' : 'Run Sweep Now'}
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Periodic Cloud Threat Intel Synchronization */}
          <div className="p-4 bg-[#070B14] rounded-xl border border-purple-500/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudDownload className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wide">
                    Periodic Threat Intel Synchronization
                  </span>
                </div>
                <button
                  id="dash-toggle-threat-intel-sync"
                  onClick={() => {
                    setSettings((prev) => ({
                      ...prev,
                      threatIntelSync: !prev.threatIntelSync,
                    }));
                    soundManager.playSafeTone();
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    settings.threatIntelSync ? 'bg-purple-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Pulls real-time global zero-day signatures, IOC feeds, and malicious domain clusters from decentralized SOC telemetry nodes.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[11px]">Sync Clock:</span>
                {[5, 10, 30].map((min) => (
                  <button
                    key={min}
                    onClick={() => setSettings((prev) => ({ ...prev, threatIntelSyncIntervalMinutes: min }))}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
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
                  id="dash-force-intel-sync-btn"
                  onClick={onTriggerThreatIntelSync}
                  disabled={isSyncingIntel}
                  className="px-3 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingIntel ? 'animate-spin' : ''}`} />
                  {isSyncingIntel ? 'Syncing...' : 'Force Sync Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global D3 Threat Origin Heatmap & Attack Radar */}
      <ThreatHeatmap onScanUrl={onScanUrl} />

      {/* Security Audit Event Stream & Incident Logs */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-cyan-400" />
              SECURITY EVENT LOGS & THREAT INTERCEPTION AUDIT ({filteredLogs.length})
            </h3>
            <p className="text-xs text-slate-400">
              Live chronological stream of inspected connections, blocked zero-days, and safe navigation events:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filter by severity */}
            <div className="flex items-center gap-1 bg-[#090D18] p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              {['all', 'critical_zero_day', 'malicious', 'suspicious', 'safe'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2 py-1 rounded-lg transition-colors capitalize ${
                    filterSeverity === sev
                      ? 'bg-slate-800 text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev === 'critical_zero_day' ? 'Zero-Day' : sev}
                </button>
              ))}
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchLogQuery}
                onChange={(e) => setSearchLogQuery(e.target.value)}
                placeholder="Search logs..."
                className="bg-[#090D18] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-cyan-500 w-44"
              />
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-download-audit-pdf"
                onClick={handleDownloadPDF}
                className="px-2.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
                title="Download Executive PDF Audit Report"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">PDF Report</span>
              </button>

              <button
                id="btn-download-audit-csv"
                onClick={handleDownloadCSV}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
                title="Download CSV Audit Logs (RFC-4180)"
              >
                <Table className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">CSV Logs</span>
              </button>

              {onOpenAuditModal && (
                <button
                  id="btn-open-audit-suite"
                  onClick={onOpenAuditModal}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                  title="Open Full Compliance & Email Dispatch Suite"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audit Suite</span>
                </button>
              )}

              <button
                onClick={handleExportLogs}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                title="Export raw JSON"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono divide-y divide-slate-800/80">
            <thead className="bg-[#0A0E1A] text-slate-400 text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Threat Family / Category</th>
                <th className="py-3 px-4">Targeted URL & Domain</th>
                <th className="py-3 px-4">Risk Metric</th>
                <th className="py-3 px-4">Zero-Day</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      log.severity === 'safe'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : log.severity === 'suspicious'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {log.severity === 'critical_zero_day' ? 'ZERO-DAY' : log.severity}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-200 whitespace-nowrap">
                    {log.category}
                    {log.brandTarget && (
                      <span className="block text-[10px] text-cyan-400 font-normal">
                        Impersonating: {log.brandTarget}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 max-w-xs truncate text-slate-300 select-all" title={log.url}>
                    {log.url}
                  </td>

                  <td className="py-3 px-4 font-bold whitespace-nowrap">
                    <span className={log.riskScore > 70 ? 'text-red-400' : 'text-emerald-400'}>
                      {log.riskScore}/100
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={log.zeroDayScore > 70 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {log.zeroDayScore}%
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenAlertModal(log)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-[11px] transition-colors"
                    >
                      Forensics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

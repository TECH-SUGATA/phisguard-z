import React from "react";
import { 
  ShieldAlert, 
  AlertTriangle, 
  X, 
  Lock, 
  ExternalLink, 
  Check, 
  Cpu, 
  Skull, 
  Shield, 
  CornerDownLeft,
  ArrowRight,
  Database
} from "lucide-react";
import { ScannedUrlResult } from "../types";

interface ThreatAlertModalProps {
  threat: ScannedUrlResult | null;
  onClose: () => void;
  onQuarantine: (url: string) => void;
  onLearnPattern: (threat: ScannedUrlResult) => void;
}

export const ThreatAlertModal: React.FC<ThreatAlertModalProps> = ({
  threat,
  onClose,
  onQuarantine,
  onLearnPattern,
}) => {
  if (!threat) return null;

  const isZeroDay = threat.severity === 'critical_zero_day' || threat.zeroDayScore >= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0F172A] border-2 border-red-500/80 rounded-2xl shadow-2xl shadow-red-950/70 overflow-hidden text-slate-200 flex flex-col">
        
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-red-700 via-rose-800 to-red-900 px-6 py-4 flex items-center justify-between text-white border-b border-red-500/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black/40 rounded-xl border border-white/20">
              <ShieldAlert className="w-7 h-7 text-red-200 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider uppercase font-mono">
                  PHISGUARD-Z ALERT: {isZeroDay ? 'ZERO-DAY THREAT BLOCKED' : 'MALICIOUS LINK INTERCEPTED'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white/20 text-white rounded font-mono">
                  CRITICAL
                </span>
              </div>
              <p className="text-xs text-red-100/90 font-mono">
                Real-Time Outbound Interceptor prevented execution of malicious payload
              </p>
            </div>
          </div>

          <button
            id="modal-close-icon-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-red-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Target URL Box */}
          <div className="p-3.5 bg-[#080D1A] rounded-xl border border-red-900/50 space-y-1">
            <span className="text-[11px] font-mono text-red-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Blocked Destination URL:
            </span>
            <p className="font-mono text-xs text-red-200 break-all select-all bg-red-950/30 p-2 rounded border border-red-900/40">
              {threat.url}
            </p>
          </div>

          {/* Metric Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-red-500/30 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Threat Score</p>
              <p className="text-xl font-extrabold text-red-400 font-mono mt-0.5">
                {threat.riskScore}<span className="text-xs text-red-500/70">/100</span>
              </p>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/30 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Zero-Day Metric</p>
              <p className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
                {threat.zeroDayScore}<span className="text-xs text-amber-500/70">%</span>
              </p>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/30 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-mono">ML Confidence</p>
              <p className="text-xl font-extrabold text-cyan-400 font-mono mt-0.5">
                {threat.confidence}%
              </p>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-purple-500/30 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Domain Entropy</p>
              <p className="text-xl font-extrabold text-purple-400 font-mono mt-0.5">
                {threat.entropyScore} <span className="text-xs text-slate-500 font-normal">bits</span>
              </p>
            </div>
          </div>

          {/* Targeted Brand & Category */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300">
              Attack Family: <strong className="text-white">{threat.category}</strong>
            </span>
            {threat.brandTarget && (
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                Impersonated Target: <strong className="text-cyan-400">{threat.brandTarget}</strong>
              </span>
            )}
            <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
              Registry TLD: <span className="text-amber-400 font-bold">{threat.tld}</span>
            </span>
          </div>

          {/* AI Machine Learning Zero-Day Insight */}
          {threat.aiZeroDayAnalysis && (
            <div className="p-3.5 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-slate-900 rounded-xl border border-purple-500/40">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold font-mono mb-1">
                <Cpu className="w-4 h-4 text-purple-400" />
                ADVANCED MACHINE LEARNING ZERO-DAY FORENSICS:
              </div>
              <p className="text-xs text-purple-200/90 leading-relaxed font-mono">
                {threat.aiZeroDayAnalysis}
              </p>
            </div>
          )}

          {/* Specific Indicators */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Detected Heuristic & Adversarial Vectors ({threat.indicators.length}):
            </h4>
            <div className="space-y-2">
              {threat.indicators.map((ind, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-red-300 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      {ind.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{ind.code}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-3 leading-normal">
                    {ind.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Remediation Advice */}
          <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300/90 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Protective Recommendation:</strong> {threat.remediationAdvice}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0B1120] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            id="btn-threat-learn-pattern"
            onClick={() => onLearnPattern(threat)}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            Absorb into Neural Autonomous Learner
          </button>

          <div className="flex items-center gap-2">
            <button
              id="btn-threat-quarantine"
              onClick={() => onQuarantine(threat.url)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-950 transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              Quarantine & Block Globally
            </button>

            <button
              id="btn-threat-dismiss"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

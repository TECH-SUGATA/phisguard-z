import React, { useState } from "react";
import { 
  Cpu, 
  Sparkles, 
  Database, 
  GitBranch, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Sliders, 
  Search,
  Code2,
  ArrowRight,
  TrendingUp,
  Radio
} from "lucide-react";
import { LearnedThreatPattern, SecurityMetrics } from "../types";
import { soundManager } from "../utils/audio";

interface NeuralLearnerProps {
  patterns: LearnedThreatPattern[];
  onLearnNewPattern: (url: string, brand?: string, category?: string) => Promise<boolean>;
  metrics: SecurityMetrics;
}

export const NeuralLearner: React.FC<NeuralLearnerProps> = ({
  patterns,
  onLearnNewPattern,
  metrics,
}) => {
  const [newThreatUrl, setNewThreatUrl] = useState("");
  const [newTargetBrand, setNewTargetBrand] = useState("");
  const [newCategory, setNewCategory] = useState("Credential Harvester");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreatUrl) return;

    setIsProcessing(true);
    setSuccessMessage(null);
    soundManager.playScanPing();

    const success = await onLearnNewPattern(newThreatUrl, newTargetBrand, newCategory);
    setIsProcessing(false);

    if (success) {
      soundManager.playPatternLearned();
      setSuccessMessage("Pattern successfully synthesized! Model weights distributed across client defenses.");
      setNewThreatUrl("");
      setNewTargetBrand("");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleQuickSeed = (url: string, brand: string, cat: string) => {
    setNewThreatUrl(url);
    setNewTargetBrand(brand);
    setNewCategory(cat);
  };

  const filteredPatterns = patterns.filter(
    (p) =>
      p.patternName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.threatFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patternSignature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.targetBrand && p.targetBrand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Engine Status Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-[#0B0F19] p-6 rounded-2xl border border-purple-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
                AUTONOMOUS NEURAL LEARNING & ZERO-DAY ADAPTATION ENGINE
              </h2>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                ACTIVE PIPELINE
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              PHISGUARD-Z continuously analyzes newly discovered malicious domains, extracts polymorphic lexical signatures, and updates defense weights in real time without requiring manual antivirus software updates.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-mono text-center shrink-0">
            <div>
              <p className="text-[10px] text-slate-400">Total Learned Patterns</p>
              <p className="text-base font-bold text-purple-400">{patterns.length}</p>
            </div>
            <div className="w-[1px] h-8 bg-slate-800"></div>
            <div>
              <p className="text-[10px] text-slate-400">Model Engine Version</p>
              <p className="text-base font-bold text-cyan-400">{metrics.modelEngineVersion}</p>
            </div>
            <div className="w-[1px] h-8 bg-slate-800"></div>
            <div>
              <p className="text-[10px] text-slate-400">Adaptation Cycle</p>
              <p className="text-base font-bold text-emerald-400">Continuous</p>
            </div>
          </div>
        </div>

        {/* 4-Step Autonomous Learning Pipeline Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-purple-500/20">
          {[
            {
              step: "01",
              title: "Wild Threat Ingestion",
              desc: "Telemetry collects unfamiliar domains from browser traffic and zero-day traps.",
            },
            {
              step: "02",
              title: "Shannon Lexical Clustering",
              desc: "Computes entropy, punycode glyphs, and brand phonetic distance.",
            },
            {
              step: "03",
              title: "Neural Rule Synthesis",
              desc: "Gemini 3.8-Flash extracts regex and adversarial behavior models.",
            },
            {
              step: "04",
              title: "Zero-Latency Client Sync",
              desc: "Deploys updated regex rules instantly to all client browser extensions.",
            },
          ].map((item) => (
            <div key={item.step} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 font-mono">
              <span className="text-[10px] font-bold text-purple-400">{item.step} / PHASE</span>
              <h4 className="text-xs font-bold text-slate-200 mt-0.5">{item.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Threat Submission & Pattern Training Form */}
      <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-purple-400" />
              TRAIN ENGINE ON NOVEL THREAT SAMPLE
            </h3>
            <p className="text-xs text-slate-400">
              Submit an adversarial domain to watch the machine learning system synthesize a new detection signature:
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Quick Samples:</span>
            <button
              type="button"
              onClick={() => handleQuickSeed("https://crypto-drainer-claim.live/connect", "OpenSea", "Cryptocurrency Drainer")}
              className="text-cyan-400 hover:underline"
            >
              Drainer
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleQuickSeed("https://secure-chase-update.rest/login", "Chase", "Credential Harvester")}
              className="text-cyan-400 hover:underline"
            >
              Banking Trap
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Malicious URL / Suspicious Domain:
            </label>
            <input
              id="input-learn-threat-url"
              type="text"
              value={newThreatUrl}
              onChange={(e) => setNewThreatUrl(e.target.value)}
              placeholder="e.g. https://login.evil-spoof-portal.cam/auth"
              required
              className="w-full bg-[#090D18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Impersonated Brand:
            </label>
            <input
              id="input-learn-target-brand"
              type="text"
              value={newTargetBrand}
              onChange={(e) => setNewTargetBrand(e.target.value)}
              placeholder="e.g. Microsoft / Bank"
              className="w-full bg-[#090D18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Threat Classification:
            </label>
            <select
              id="select-learn-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-[#090D18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Credential Harvester">Credential Harvester</option>
              <option value="Zero-Day Exploit Link">Zero-Day Exploit Link</option>
              <option value="Homograph Domain Spoof">Homograph Domain Spoof</option>
              <option value="Cryptocurrency Drainer">Cryptocurrency Drainer</option>
              <option value="OAuth Consent Hijack">OAuth Consent Hijack</option>
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              id="btn-submit-learn"
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono shadow-lg shadow-purple-950/40 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Pattern Features...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Synthesize Pattern & Update Engine</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Catalog of Learned Signatures */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Database className="w-4 h-4 text-cyan-400" />
              DEPLOYED AUTONOMOUS SIGNATURE CATALOG ({patterns.length})
            </h3>
            <p className="text-xs text-slate-400">
              Live heuristic rules generated autonomously by PHISGUARD-Z:
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter patterns..."
              className="w-full bg-[#090D18] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredPatterns.map((pat) => (
            <div key={pat.id} className="p-4 hover:bg-slate-800/40 transition-colors space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-100 font-mono">
                    {pat.patternName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    {pat.threatFamily}
                  </span>
                  {pat.targetBrand && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      Target: {pat.targetBrand}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {pat.confidenceScore}% Confidence
                  </span>
                  <span className="text-slate-400">
                    Hits: <strong className="text-slate-200">{pat.detectionsCount}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase text-[10px]">
                    {pat.status}
                  </span>
                </div>
              </div>

              {/* Regex signature */}
              <div className="p-2 bg-[#090D18] rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 flex items-center gap-2 overflow-x-auto">
                <Code2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="select-all">{pat.patternSignature}</span>
              </div>

              {/* Features list */}
              {pat.aiExtractedFeatures && pat.aiExtractedFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pat.aiExtractedFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      • {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

import React, { useState } from "react";
import { 
  Lock, 
  Unlock, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertOctagon,
  FileText
} from "lucide-react";
import { soundManager } from "../utils/audio";

interface QuarantineVaultProps {
  quarantinedUrls: string[];
  onRemoveQuarantine: (url: string) => void;
  onAddCustomRule: (domain: string, action: 'block' | 'allow') => void;
  customRules: { domain: string; action: 'block' | 'allow'; addedAt: number }[];
  onRemoveCustomRule: (domain: string) => void;
}

export const QuarantineVault: React.FC<QuarantineVaultProps> = ({
  quarantinedUrls,
  onRemoveQuarantine,
  onAddCustomRule,
  customRules,
  onRemoveCustomRule,
}) => {
  const [newDomain, setNewDomain] = useState("");
  const [newAction, setNewAction] = useState<'block' | 'allow'>('block');
  const [searchFilter, setSearchFilter] = useState("");

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    onAddCustomRule(newDomain.trim().toLowerCase(), newAction);
    setNewDomain("");
    soundManager.playSafeTone();
  };

  const filteredQuarantine = quarantinedUrls.filter((u) =>
    u.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Lock className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              QUARANTINE VAULT & ENTERPRISE ACCESS CONTROLS
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Isolated zero-day endpoints, blocked credential harvesting domains, and network policy exceptions.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Quarantined: <strong className="text-red-400">{quarantinedUrls.length}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Custom Rules: <strong className="text-cyan-400">{customRules.length}</strong>
          </div>
        </div>
      </div>

      {/* Manual Domain Rule Creation */}
      <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800">
        <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-cyan-400" />
          Add Custom Enterprise Domain Override
        </h3>

        <form onSubmit={handleAddRule} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="e.g. suspicious-partner-domain.net"
            required
            className="flex-1 w-full bg-[#090D18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          />

          <select
            value={newAction}
            onChange={(e) => setNewAction(e.target.value as 'block' | 'allow')}
            className="bg-[#090D18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="block">Enforce Block (Blacklist)</option>
            <option value="allow">Trust & Bypass (Whitelist)</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold font-mono transition-all shadow-md shadow-red-950/40 active:scale-95 shrink-0"
          >
            Deploy Rule
          </button>
        </form>
      </div>

      {/* Quarantined URLs Section */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              ISOLATED & QUARANTINED DESTINATIONS ({quarantinedUrls.length})
            </h3>
            <p className="text-xs text-slate-400">
              Communication to these addresses is permanently dropped at extension socket layer.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search quarantined..."
              className="w-full bg-[#090D18] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-red-500"
            />
          </div>
        </div>

        {filteredQuarantine.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
            Quarantine vault clean. No manually locked domains.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredQuarantine.map((url, idx) => (
              <div
                key={idx}
                className="p-3.5 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3 font-mono text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Lock className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-slate-200 truncate">{url}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                    Quarantined
                  </span>
                  <button
                    onClick={() => onRemoveQuarantine(url)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    title="Release from quarantine"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enterprise Policy Custom Rules */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            ENTERPRISE ACCESS POLICY OVERRIDES ({customRules.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-800/80">
          {customRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-3.5 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3 font-mono text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${
                  rule.action === 'block' ? 'bg-red-400' : 'bg-emerald-400'
                }`}></span>
                <span className="text-slate-200">{rule.domain}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  rule.action === 'block'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {rule.action === 'block' ? 'Enforced Block' : 'Allowed Exception'}
                </span>

                <button
                  onClick={() => onRemoveCustomRule(rule.domain)}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

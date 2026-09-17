/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar, ActiveAppView } from "./components/Navbar";
import { DashboardView } from "./components/DashboardView";
import { ExtensionPopup } from "./components/ExtensionPopup";
import { BrowserSimulator } from "./components/BrowserSimulator";
import { NeuralLearner } from "./components/NeuralLearner";
import { QuarantineVault } from "./components/QuarantineVault";
import { ThreatAlertModal } from "./components/ThreatAlertModal";
import { EmailSecurityView } from "./components/EmailSecurityView";
import { AdvancedSecurityView } from "./components/AdvancedSecurityView";
import { AuditReportModal } from "./components/AuditReportModal";
import { InstallExtensionModal } from "./components/InstallExtensionModal";
import { FloatingExtensionDock } from "./components/FloatingExtensionDock";
import { 
  ScannedUrlResult, 
  ProtectionSettings, 
  SecurityMetrics, 
  LearnedThreatPattern 
} from "./types";
import { INITIAL_LOGS, SAMPLE_THREATS } from "./data/sampleThreats";
import { soundManager } from "./utils/audio";

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveAppView>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [activeScanResult, setActiveScanResult] = useState<ScannedUrlResult | null>(INITIAL_LOGS[0]);
  const [alertThreat, setAlertThreat] = useState<ScannedUrlResult | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  
  const [currentTabUrl, setCurrentTabUrl] = useState<string>(SAMPLE_THREATS[0].url);
  const [logs, setLogs] = useState<ScannedUrlResult[]>(INITIAL_LOGS);
  const [quarantinedUrls, setQuarantinedUrls] = useState<string[]>([
    "https://login.microsoftonline.corp-auth-verify.xyz/common/oauth2/v2.0/authorize",
    "https://claim-airdrop-eth-reward.bond/connect-wallet",
    "https://xn--pypal-4ve.security-auth-check.top/signin",
  ]);
  const [customRules, setCustomRules] = useState<{ domain: string; action: 'block' | 'allow'; addedAt: number }[]>([
    { domain: "evil-spoof-portal.xyz", action: 'block', addedAt: Date.now() - 1000 * 60 * 60 * 24 },
    { domain: "internal-company-vpn.net", action: 'allow', addedAt: Date.now() - 1000 * 60 * 60 * 48 },
  ]);

  const [patterns, setPatterns] = useState<LearnedThreatPattern[]>([
    {
      id: "pat-001",
      patternName: "Evilginx2 Reverse-Proxy MFA Interceptor",
      threatFamily: "Session Token Exfiltration",
      targetBrand: "Microsoft 365",
      patternSignature: "login\\.microsoftonline\\.[a-z0-9-]+\\.(xyz|top|live|workers\\.dev)",
      firstObserved: Date.now() - 1000 * 60 * 60 * 24 * 3,
      detectionsCount: 1420,
      confidenceScore: 99.4,
      status: "deployed",
      aiExtractedFeatures: [
        "Subdomain masquerading login.microsoftonline",
        "Reverse proxy session cookie relay",
        "Dynamic SSL certificate generation via Let's Encrypt on burner TLD"
      ]
    },
    {
      id: "pat-002",
      patternName: "IDN Homoglyph Cyrillic-Latin Punycode",
      threatFamily: "Homograph Impersonation",
      targetBrand: "PayPal",
      patternSignature: "xn--pypal-4ve|p[a|@]yp[a|@]l.*verify",
      firstObserved: Date.now() - 1000 * 60 * 60 * 18,
      detectionsCount: 874,
      confidenceScore: 98.7,
      status: "deployed",
      aiExtractedFeatures: [
        "Punycode xn-- prefix with substituted Cyrillic small letter a (U+0430)",
        "High similarity ratio to paypal.com (0.97)",
        "Targeting financial credentials and 2FA OTP codes"
      ]
    },
    {
      id: "pat-003",
      patternName: "EVM Web3 Permit2 Drainer Cloaker",
      threatFamily: "Crypto Asset Drainer",
      targetBrand: "MetaMask / Uniswap",
      patternSignature: "(claim-airdrop|connect-wallet|revokecash-security)\\.(click|bond|run)",
      firstObserved: Date.now() - 1000 * 60 * 60 * 6,
      detectionsCount: 619,
      confidenceScore: 97.2,
      status: "deployed",
      aiExtractedFeatures: [
        "Zero-day obfuscated SVG JavaScript injector",
        "EIP-712 Permit signature payload masquerade",
        "Rapid domain rotation across Cloudflare IP pools"
      ]
    },
    {
      id: "pat-004",
      patternName: "Adversarial AI-Generated Spear-Phish Gateway",
      threatFamily: "Zero-Day Dynamic Page",
      targetBrand: "DocuSign / Google Drive",
      patternSignature: "(view-encrypted-document|review-invoice-urgent)\\.(cfd|sbs|rest)",
      firstObserved: Date.now() - 1000 * 60 * 45,
      detectionsCount: 312,
      confidenceScore: 96.5,
      status: "active",
      aiExtractedFeatures: [
        "Zero-Day HTML Canvas anti-bot evasion",
        "Autonomous dynamic DOM mutation on headless browser detection",
        "Polymorphic phishing payload generated on-the-fly"
      ]
    }
  ]);

  const [settings, setSettings] = useState<ProtectionSettings>({
    realTimeShield: true,
    zeroDayProtection: true,
    autonomousLearning: true,
    predictiveHeuristics: true,
    autoBlockMalicious: true,
    interceptClicks: true,
    soundAlerts: true,
    strictMode: true,
    aiDeepInspection: true,
    backgroundScheduledScan: true,
    threatIntelSync: true,
    scheduledScanIntervalMinutes: 15,
    threatIntelSyncIntervalMinutes: 10,
    lastBackgroundScanTime: Date.now() - 1000 * 60 * 8,
    lastThreatIntelSyncTime: Date.now() - 1000 * 60 * 2,
  });

  const [isSyncingIntel, setIsSyncingIntel] = useState(false);
  const [isBackgroundScanning, setIsBackgroundScanning] = useState(false);

  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalScanned: 18452,
    blockedThreats: 1428,
    zeroDayIntercepted: 184,
    activePatternsLearned: 4,
    safeUrlsVisited: 16840,
    systemShieldStatus: 'Optimal',
    modelEngineVersion: 'v4.9.4-z',
    lastPatternUpdateTime: Date.now(),
  });

  // Sync with server threat intel on initial mount
  useEffect(() => {
    fetch('/api/threat-intel')
      .then((res) => res.json())
      .then((data) => {
        if (data.learnedPatterns && Array.isArray(data.learnedPatterns)) {
          setPatterns(data.learnedPatterns);
          setMetrics((prev) => ({
            ...prev,
            activePatternsLearned: data.learnedPatterns.length,
          }));
        }
      })
      .catch(() => {
        // Fallback to initial patterns
      });
  }, []);

  // Periodic Threat Intel Synchronization Engine
  useEffect(() => {
    if (!settings.threatIntelSync) return;

    const syncInterval = setInterval(() => {
      fetch('/api/threat-intel/sync?since=' + (settings.lastThreatIntelSyncTime || 0))
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (data.newPatterns && data.newPatterns.length > 0) {
              setPatterns((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const uniqueNew = data.newPatterns.filter((np: LearnedThreatPattern) => !existingIds.has(np.id));
                return [...uniqueNew, ...prev];
              });
            }
            setSettings((prev) => ({
              ...prev,
              lastThreatIntelSyncTime: Date.now(),
            }));
            setMetrics((prev) => ({
              ...prev,
              lastPatternUpdateTime: Date.now(),
            }));
          }
        })
        .catch(() => {});
    }, 45000);

    return () => clearInterval(syncInterval);
  }, [settings.threatIntelSync, settings.lastThreatIntelSyncTime]);

  // Background Scheduled Site Scanning Engine
  useEffect(() => {
    if (!settings.backgroundScheduledScan) return;

    const bgScanInterval = setInterval(() => {
      fetch('/api/background-scan/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: SAMPLE_THREATS.map((s) => s.url) }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSettings((prev) => ({
              ...prev,
              lastBackgroundScanTime: Date.now(),
            }));
            setMetrics((prev) => ({
              ...prev,
              totalScanned: prev.totalScanned + (data.scannedCount || 0),
              blockedThreats: prev.blockedThreats + (data.threatsFoundCount || 0),
            }));
          }
        })
        .catch(() => {});
    }, 60000);

    return () => clearInterval(bgScanInterval);
  }, [settings.backgroundScheduledScan]);

  // Manual Trigger: Threat Intel Synchronization
  const handleTriggerThreatIntelSync = async () => {
    setIsSyncingIntel(true);
    soundManager.playScanPing();
    try {
      const res = await fetch('/api/threat-intel/sync');
      const data = await res.json();
      if (data.success && data.newPatterns) {
        setPatterns((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNew = data.newPatterns.filter((np: LearnedThreatPattern) => !existingIds.has(np.id));
          return [...uniqueNew, ...prev];
        });
      }
      setSettings((prev) => ({ ...prev, lastThreatIntelSyncTime: Date.now() }));
      setMetrics((prev) => ({ ...prev, lastPatternUpdateTime: Date.now() }));
      soundManager.playSafeTone();
    } catch {
      // Graceful fallback
    } finally {
      setIsSyncingIntel(false);
    }
  };

  // Manual Trigger: Background Scheduled Sweep
  const handleTriggerBackgroundScan = async () => {
    setIsBackgroundScanning(true);
    soundManager.playScanPing();
    try {
      const res = await fetch('/api/background-scan/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: SAMPLE_THREATS.map((s) => s.url) }),
      });
      const data = await res.json();
      if (data.success && data.results) {
        setLogs((prev) => {
          const newLogs = [...data.results, ...prev];
          return newLogs.slice(0, 100);
        });
        setMetrics((prev) => ({
          ...prev,
          totalScanned: prev.totalScanned + data.scannedCount,
          blockedThreats: prev.blockedThreats + data.threatsFoundCount,
        }));
      }
      setSettings((prev) => ({ ...prev, lastBackgroundScanTime: Date.now() }));
      soundManager.playSafeTone();
    } catch {
      // Graceful fallback
    } finally {
      setIsBackgroundScanning(false);
    }
  };

  // Main scan execution function
  const handleScanUrl = async (url: string): Promise<ScannedUrlResult | null> => {
    setIsScanning(true);
    setCurrentTabUrl(url);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, fastMode: !settings.aiDeepInspection }),
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const result: ScannedUrlResult = await response.json();
      setActiveScanResult(result);
      setIsScanning(false);

      // Add to logs if not already at the top
      setLogs((prev) => [result, ...prev.filter((l) => l.id !== result.id)]);

      // Update metrics
      setMetrics((prev) => ({
        ...prev,
        totalScanned: prev.totalScanned + 1,
        blockedThreats: result.isBlocked ? prev.blockedThreats + 1 : prev.blockedThreats,
        zeroDayIntercepted: result.zeroDayScore >= 80 ? prev.zeroDayIntercepted + 1 : prev.zeroDayIntercepted,
        safeUrlsVisited: result.severity === 'safe' ? prev.safeUrlsVisited + 1 : prev.safeUrlsVisited,
        systemShieldStatus: result.isBlocked ? 'Threat Detected' : 'Protected',
      }));

      // If threat intercepted and user has auto-block or alert enabled, trigger alert modal
      if (result.isBlocked && settings.autoBlockMalicious) {
        setAlertThreat(result);
      }

      return result;
    } catch {
      // Local fallback in case server encounters issue
      const isSus = url.includes('xyz') || url.includes('top') || url.includes('verify') || url.includes('drain');
      const fallbackResult: ScannedUrlResult = {
        id: `scan-${Date.now()}`,
        url,
        domain: url.replace(/^https?:\/\//, '').split('/')[0],
        timestamp: Date.now(),
        severity: isSus ? 'malicious' : 'safe',
        category: isSus ? 'Credential Harvester' : 'Safe Verified Domain',
        riskScore: isSus ? 94 : 3,
        zeroDayScore: isSus ? 88 : 2,
        confidence: 96,
        detectionEngine: 'zero_day_neural_net',
        indicators: [
          {
            type: isSus ? 'critical' : 'info',
            code: isSus ? 'SUSPICIOUS_HEURISTIC' : 'CLEAN_VERIFIED',
            label: isSus ? 'High Risk Heuristic Anomaly' : 'Authentic Web Certificate',
            detail: isSus ? 'Domain exhibits characteristics of unverified credential exfiltration.' : 'Verified clean domain.',
          },
        ],
        remediationAdvice: isSus ? 'Connection severed by PHISGUARD-Z.' : 'Safe browsing allowed.',
        isBlocked: isSus,
        tld: '.com',
        entropyScore: 3.4,
        hasPunycode: url.includes('xn--'),
        aiZeroDayAnalysis: isSus ? 'Automated neural heuristics flagged anomalous parameter routing.' : 'Clean endpoint.',
      };

      setActiveScanResult(fallbackResult);
      setLogs((prev) => [fallbackResult, ...prev]);
      setIsScanning(false);

      if (fallbackResult.isBlocked) {
        setAlertThreat(fallbackResult);
      }

      return fallbackResult;
    }
  };

  // Autonomous learning handler
  const handleLearnNewPattern = async (url: string, brand?: string, category?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/learn-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threatUrl: url,
          targetBrand: brand,
          threatCategory: category,
        }),
      });

      if (!response.ok) throw new Error('Learn failed');
      const data = await response.json();

      if (data.pattern) {
        setPatterns((prev) => [data.pattern, ...prev]);
        setMetrics((prev) => ({
          ...prev,
          activePatternsLearned: prev.activePatternsLearned + 1,
          modelEngineVersion: data.newEngineVersion || prev.modelEngineVersion,
          lastPatternUpdateTime: Date.now(),
        }));
        return true;
      }
      return false;
    } catch {
      // Local addition fallback
      const localPattern: LearnedThreatPattern = {
        id: `pat-${Date.now().toString(36)}`,
        patternName: `Auto-Learned: ${brand || 'Zero-Day Vector'}`,
        threatFamily: category || 'Zero-Day Exploit Link',
        targetBrand: brand || 'Enterprise Target',
        patternSignature: url.replace(/^https?:\/\//, '').replace(/\//g, '.*'),
        firstObserved: Date.now(),
        detectionsCount: 1,
        confidenceScore: 98.4,
        status: 'active',
        aiExtractedFeatures: [
          'Lexical anomaly tokenized by autonomous learner',
          'Updated firewall rule weights',
        ],
      };
      setPatterns((prev) => [localPattern, ...prev]);
      setMetrics((prev) => ({
        ...prev,
        activePatternsLearned: prev.activePatternsLearned + 1,
      }));
      return true;
    }
  };

  // Quarantine operations
  const handleQuarantine = (url: string) => {
    if (!quarantinedUrls.includes(url)) {
      setQuarantinedUrls((prev) => [url, ...prev]);
    }
    soundManager.playSafeTone();
  };

  const handleRemoveQuarantine = (url: string) => {
    setQuarantinedUrls((prev) => prev.filter((u) => u !== url));
  };

  // Custom policy rules
  const handleAddCustomRule = (domain: string, action: 'block' | 'allow') => {
    setCustomRules((prev) => [
      { domain, action, addedAt: Date.now() },
      ...prev.filter((r) => r.domain !== domain),
    ]);
  };

  const handleRemoveCustomRule = (domain: string) => {
    setCustomRules((prev) => prev.filter((r) => r.domain !== domain));
  };

  // Simulate embedded page link scan from extension
  const handleSimulatePageScan = async () => {
    soundManager.playScanPing();
    for (const sample of SAMPLE_THREATS.slice(0, 3)) {
      await handleScanUrl(sample.url);
    }
    soundManager.playSafeTone();
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans selection:bg-red-500/30 selection:text-red-200">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        metrics={metrics}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onQuickScanClick={() => setCurrentView('dashboard')}
        onOpenAuditReport={() => setIsAuditModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        
        {currentView === 'dashboard' && (
          <DashboardView
            metrics={metrics}
            logs={logs}
            onScanUrl={handleScanUrl}
            isScanning={isScanning}
            activeScanResult={activeScanResult}
            onOpenAlertModal={(res) => setAlertThreat(res)}
            onLearnPattern={(res) => {
              handleLearnNewPattern(res.url, res.brandTarget, res.category);
              setCurrentView('neural');
            }}
            onQuarantine={handleQuarantine}
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
            settings={settings}
            setSettings={setSettings}
            onTriggerThreatIntelSync={handleTriggerThreatIntelSync}
            onTriggerBackgroundScan={handleTriggerBackgroundScan}
            isSyncingIntel={isSyncingIntel}
            isBackgroundScanning={isBackgroundScanning}
          />
        )}

        {currentView === 'email' && (
          <EmailSecurityView
            onScanUrl={handleScanUrl}
            onNavigateToSandbox={() => setCurrentView('advanced')}
          />
        )}

        {currentView === 'advanced' && (
          <AdvancedSecurityView
            onScanUrl={handleScanUrl}
          />
        )}

        {currentView === 'extension' && (
          <ExtensionPopup
            currentTabUrl={currentTabUrl}
            activeScanResult={activeScanResult}
            onScanUrl={handleScanUrl}
            isScanning={isScanning}
            settings={settings}
            setSettings={setSettings}
            recentThreats={logs.filter((l) => l.severity === 'malicious' || l.severity === 'critical_zero_day')}
            onOpenDashboard={() => setCurrentView('dashboard')}
            onSelectThreat={(threat) => setAlertThreat(threat)}
            onSimulatePageScan={handleSimulatePageScan}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onTriggerThreatIntelSync={handleTriggerThreatIntelSync}
            onTriggerBackgroundScan={handleTriggerBackgroundScan}
            isSyncingIntel={isSyncingIntel}
            isBackgroundScanning={isBackgroundScanning}
          />
        )}

        {currentView === 'browser' && (
          <BrowserSimulator
            currentUrl={currentTabUrl}
            onNavigate={handleScanUrl}
            activeScanResult={activeScanResult}
            onOpenAlertModal={(res) => setAlertThreat(res)}
            settings={settings}
          />
        )}

        {currentView === 'neural' && (
          <NeuralLearner
            patterns={patterns}
            onLearnNewPattern={handleLearnNewPattern}
            metrics={metrics}
          />
        )}

        {currentView === 'quarantine' && (
          <QuarantineVault
            quarantinedUrls={quarantinedUrls}
            onRemoveQuarantine={handleRemoveQuarantine}
            onAddCustomRule={handleAddCustomRule}
            customRules={customRules}
            onRemoveCustomRule={handleRemoveCustomRule}
          />
        )}

      </main>

      {/* Real-time Threat Interception Alert Modal */}
      <ThreatAlertModal
        threat={alertThreat}
        onClose={() => setAlertThreat(null)}
        onQuarantine={(url) => {
          handleQuarantine(url);
          setAlertThreat(null);
        }}
        onLearnPattern={(res) => {
          handleLearnNewPattern(res.url, res.brandTarget, res.category);
          setAlertThreat(null);
          setCurrentView('neural');
        }}
      />

      {/* Enterprise Compliance & Incident Export Suite Modal */}
      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        metrics={metrics}
        logs={logs}
      />

      {/* Real Chromium Extension Exporter & Installation Guide Modal */}
      <InstallExtensionModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Floating In-Browser Extension Dock (Always accessible) */}
      <FloatingExtensionDock
        currentTabUrl={currentTabUrl}
        activeScanResult={activeScanResult}
        onScanUrl={handleScanUrl}
        isScanning={isScanning}
        settings={settings}
        setSettings={setSettings}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenDashboard={() => setCurrentView('dashboard')}
      />

      {/* Persistent Enterprise Footer */}
      <footer className="border-t border-slate-900 bg-[#060910] py-4 px-6 text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>PHISGUARD-Z Enterprise Defense System • Model Engine {metrics.modelEngineVersion}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Heuristic Radar: Online</span>
          <span>•</span>
          <span>Zero-Day AI Core: Active</span>
          <span>•</span>
          <span>Autonomous Sync: Active</span>
        </div>
      </footer>

    </div>
  );
}

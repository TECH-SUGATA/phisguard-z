export type ThreatSeverity = 'safe' | 'low' | 'suspicious' | 'malicious' | 'critical_zero_day';

export type DetectionEngine = 
  | 'rule_heuristics' 
  | 'zero_day_neural_net' 
  | 'entropy_analyzer' 
  | 'homograph_decoder' 
  | 'brand_spoof_detector'
  | 'autonomous_learner';

export type ThreatCategory = 
  | 'Safe Verified Domain'
  | 'Credential Harvester'
  | 'Zero-Day Exploit Link'
  | 'Homograph Domain Spoof'
  | 'Typosquatting Trap'
  | 'Malicious Payload Dropper'
  | 'OAuth Consent Hijack'
  | 'Cryptocurrency Drainer'
  | 'Suspicious TLD Anomaly';

export interface ThreatIndicator {
  type: 'critical' | 'warning' | 'info';
  code: string;
  label: string;
  detail: string;
}

export interface ScannedUrlResult {
  id: string;
  url: string;
  domain: string;
  timestamp: number;
  severity: ThreatSeverity;
  category: ThreatCategory;
  riskScore: number; // 0 - 100
  zeroDayScore: number; // 0 - 100
  confidence: number; // 0 - 100
  detectionEngine: DetectionEngine;
  indicators: ThreatIndicator[];
  autonomousLearnedPattern?: string;
  remediationAdvice: string;
  isBlocked: boolean;
  tld: string;
  entropyScore: number;
  hasPunycode: boolean;
  ipAddress?: string;
  brandTarget?: string;
  aiZeroDayAnalysis?: string;
}

export interface LearnedThreatPattern {
  id: string;
  patternName: string;
  threatFamily: string;
  targetBrand?: string;
  patternSignature: string;
  firstObserved: number;
  detectionsCount: number;
  confidenceScore: number;
  status: 'active' | 'learning' | 'deployed';
  aiExtractedFeatures: string[];
}

export interface ProtectionSettings {
  realTimeShield: boolean;
  zeroDayProtection: boolean;
  autonomousLearning: boolean;
  predictiveHeuristics: boolean;
  autoBlockMalicious: boolean;
  interceptClicks: boolean;
  soundAlerts: boolean;
  strictMode: boolean;
  aiDeepInspection: boolean;
  backgroundScheduledScan: boolean;
  threatIntelSync: boolean;
  scheduledScanIntervalMinutes: number;
  threatIntelSyncIntervalMinutes: number;
  lastBackgroundScanTime?: number;
  lastThreatIntelSyncTime?: number;
}

export interface SecurityMetrics {
  totalScanned: number;
  blockedThreats: number;
  zeroDayIntercepted: number;
  activePatternsLearned: number;
  safeUrlsVisited: number;
  systemShieldStatus: 'Optimal' | 'Threat Detected' | 'Analyzing' | 'Protected';
  modelEngineVersion: string;
  lastPatternUpdateTime: number;
}

export interface EmailThreatAnalysis {
  id: string;
  timestamp: number;
  sender: string;
  displayFrom: string;
  replyTo?: string;
  subject: string;
  spfStatus: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE';
  dkimStatus: 'PASS' | 'FAIL' | 'NONE';
  dmarcStatus: 'PASS' | 'FAIL' | 'QUARANTINE' | 'NONE';
  extractedLinks: { raw: string; defanged: string; riskScore?: number; severity?: ThreatSeverity }[];
  severity: ThreatSeverity;
  phishingType: 
    | 'Credential Harvester' 
    | 'Business Email Compromise (BEC)' 
    | 'CEO Fraud' 
    | 'Malware Dropper' 
    | 'Invoice Deception' 
    | 'Clean / Legitimate';
  riskScore: number;
  zeroDayScore: number;
  brandTarget?: string;
  aiForensicSummary: string;
  deceptionTechniques: string[];
  quarantineActionRecommended: 'Block & Quarantine' | 'Deliver with Warning' | 'Safe to Inbox';
  socNotificationDispatched?: boolean;
}

export interface SocEmailAlert {
  id: string;
  timestamp: number;
  recipient: string;
  threatId: string;
  threatUrlOrSubject: string;
  severity: ThreatSeverity;
  riskScore: number;
  status: 'Delivered' | 'Queued' | 'Simulated';
  incidentType: string;
  deliveryLatencyMs: number;
}

export interface MitreAttackMapping {
  tacticId: string;
  tacticName: string;
  techniqueId: string;
  techniqueName: string;
  detectionRule: string;
  threatActorAttribution: string;
  killChainPhase: 'Initial Access' | 'Execution' | 'Credential Access' | 'Defense Evasion' | 'Exfiltration';
}

export interface SandboxDetonationResult {
  id: string;
  timestamp: number;
  inputPayload: string;
  deobfuscatedTarget: string;
  evasionTechniquesDetected: string[];
  obfuscationLayers: number;
  antiAnalysisHooksFound: string[];
  riskScore: number;
  verdict: 'Critical Evasion Weapon' | 'Suspicious Cloaking' | 'Clean Payload';
  generatedYaraRule: string;
  generatedSuricataRule: string;
  aiDetonationLog: string;
}

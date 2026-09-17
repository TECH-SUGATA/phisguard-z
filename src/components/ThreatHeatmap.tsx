/**
 * ThreatHeatmap.tsx
 * High-performance Global Threat Heatmap & Attack Origin Radar powered by D3.js.
 * Visualizes real-time global phishing attack origins, bulletproof hosting infrastructure,
 * enterprise target hot-spots, and autonomous interception trajectories.
 */

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { 
  Globe, 
  Shield, 
  ShieldAlert, 
  Zap, 
  Crosshair, 
  Activity, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  Pause, 
  Radio, 
  MapPin, 
  AlertTriangle,
  Server,
  Layers,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { soundManager } from "../utils/audio";

// Geographic simplified coordinates for world landmasses (GeoJSON FeatureCollection)
const WORLD_CONTINENTS_GEOJSON: any = {
  type: "FeatureCollection",
  features: [
    // North America
    {
      type: "Feature",
      properties: { name: "North America" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-168, 65], [-160, 71], [-130, 70], [-95, 74], [-75, 77], [-60, 62],
          [-55, 48], [-68, 43], [-75, 35], [-81, 25], [-88, 21], [-97, 26],
          [-97, 19], [-83, 9], [-77, 8], [-80, 16], [-92, 16], [-105, 23],
          [-115, 30], [-124, 38], [-124, 48], [-135, 57], [-153, 58], [-168, 65]
        ]]
      }
    },
    // South America
    {
      type: "Feature",
      properties: { name: "South America" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-77, 8], [-72, 12], [-60, 9], [-50, 0], [-35, -5], [-37, -12],
          [-40, -22], [-48, -28], [-54, -34], [-65, -45], [-68, -55], [-75, -50],
          [-73, -40], [-71, -30], [-77, -15], [-80, -2], [-77, 8]
        ]]
      }
    },
    // Europe
    {
      type: "Feature",
      properties: { name: "Europe" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-10, 36], [-9, 43], [0, 44], [-4, 48], [2, 51], [8, 55], [10, 58],
          [5, 62], [14, 68], [24, 71], [32, 69], [40, 65], [45, 55], [38, 46],
          [28, 41], [24, 37], [18, 40], [12, 44], [0, 38], [-6, 36], [-10, 36]
        ]]
      }
    },
    // Africa
    {
      type: "Feature",
      properties: { name: "Africa" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-17, 32], [-5, 36], [10, 37], [25, 32], [32, 31], [34, 28],
          [43, 12], [51, 12], [45, 0], [40, -10], [35, -25], [28, -34],
          [18, -34], [12, -18], [9, -5], [2, 5], [-15, 11], [-17, 21], [-17, 32]
        ]]
      }
    },
    // Asia
    {
      type: "Feature",
      properties: { name: "Asia" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [40, 65], [60, 70], [80, 74], [105, 78], [140, 72], [170, 66],
          [160, 52], [142, 52], [132, 43], [120, 38], [122, 30], [110, 20],
          [103, 10], [98, 4], [90, 22], [80, 10], [70, 23], [60, 25],
          [50, 30], [40, 38], [35, 35], [30, 42], [40, 65]
        ]]
      }
    },
    // Australia
    {
      type: "Feature",
      properties: { name: "Australia" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [114, -22], [120, -15], [135, -12], [142, -11], [146, -20], [153, -28],
          [150, -37], [140, -38], [130, -32], [116, -35], [113, -26], [114, -22]
        ]]
      }
    },
    // United Kingdom & Ireland
    {
      type: "Feature",
      properties: { name: "United Kingdom" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-5, 50], [1, 51], [0, 53], [-2, 58], [-5, 59], [-6, 54], [-5, 50]
        ]]
      }
    },
    // Japan
    {
      type: "Feature",
      properties: { name: "Japan" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [130, 32], [136, 35], [141, 41], [141, 44], [138, 38], [132, 34], [130, 32]
        ]]
      }
    }
  ]
};

export interface AttackOrigin {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  threatActor: string;
  asn: string;
  threatVolumePerHour: number;
  primaryVector: "AiTM Reverse Proxy" | "BEC Wire Fraud" | "Zero-Day Exploit" | "Web3 Permit2 Drainer";
  intensity: number; // 1 to 100
  activePayloadUrl: string;
}

export interface EnterpriseTarget {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  sector: string;
  riskExposure: "Critical" | "High" | "Elevated";
  intercepted24h: number;
  mitigationProtocol: string;
}

export interface LiveAttackArc {
  id: string;
  origin: AttackOrigin;
  target: EnterpriseTarget;
  timestamp: number;
  status: "intercepted" | "analyzing" | "contained";
  payloadFamily: string;
  latencyMs: number;
}

// 8 High-Profile Threat Origins
const ATTACK_ORIGINS: AttackOrigin[] = [
  {
    id: "org-01",
    name: "St. Petersburg Cyber Hub",
    country: "Russian Federation",
    lat: 59.93,
    lng: 30.33,
    threatActor: "Midnight Blizzard (APT29)",
    asn: "AS48251 (Bulletproof Cloud SAS)",
    threatVolumePerHour: 14850,
    primaryVector: "AiTM Reverse Proxy",
    intensity: 98,
    activePayloadUrl: "https://login.microsoftonline.corp-auth-verify.xyz/auth"
  },
  {
    id: "org-02",
    name: "Lagos Financial Lure Ring",
    country: "Nigeria",
    lat: 6.52,
    lng: 3.37,
    threatActor: "SilverTerrier BEC Syndicate",
    asn: "AS37108 (MainOne Trans-Atlantic)",
    threatVolumePerHour: 8920,
    primaryVector: "BEC Wire Fraud",
    intensity: 85,
    activePayloadUrl: "https://docusign.document-review-overdue.cfd/invoice"
  },
  {
    id: "org-03",
    name: "Pyongyang Cryptographic Nexus",
    country: "DPRK / Offshore",
    lat: 39.03,
    lng: 125.76,
    threatActor: "Lazarus Advanced Threat Group",
    asn: "AS131279 (Star Joint Venture)",
    threatVolumePerHour: 11200,
    primaryVector: "Web3 Permit2 Drainer",
    intensity: 95,
    activePayloadUrl: "https://revoke-permit2-cash.click/drain"
  },
  {
    id: "org-04",
    name: "Amsterdam Burner Fast-Flux",
    country: "Netherlands",
    lat: 52.37,
    lng: 4.89,
    threatActor: "Scattered Spider (UNC3944)",
    asn: "AS206238 (Offshore VPS Relay)",
    threatVolumePerHour: 18400,
    primaryVector: "AiTM Reverse Proxy",
    intensity: 99,
    activePayloadUrl: "https://okta-verify.identity-saml-login.top/login"
  },
  {
    id: "org-05",
    name: "São Paulo Banking Overlay",
    country: "Brazil",
    lat: -23.55,
    lng: -46.63,
    threatActor: "Grandoreiro Banking Trojan",
    asn: "AS28573 (Claro Telecom)",
    threatVolumePerHour: 6400,
    primaryVector: "Zero-Day Exploit",
    intensity: 78,
    activePayloadUrl: "https://chase-security.fraud-resolution.bond/verify"
  },
  {
    id: "org-06",
    name: "Phnom Penh Telegram C2 Cluster",
    country: "Cambodia",
    lat: 11.55,
    lng: 104.92,
    threatActor: "PhishLabs Syndicate 14",
    asn: "AS45431 (Ezecom Fiber)",
    threatVolumePerHour: 7150,
    primaryVector: "BEC Wire Fraud",
    intensity: 82,
    activePayloadUrl: "https://paypal-resolution.account-verify.info/login"
  },
  {
    id: "org-07",
    name: "Tehran State Harvester",
    country: "Iran",
    lat: 35.68,
    lng: 51.38,
    threatActor: "Charming Kitten (APT35)",
    asn: "AS58224 (TIC Gateway)",
    threatVolumePerHour: 9340,
    primaryVector: "Zero-Day Exploit",
    intensity: 88,
    activePayloadUrl: "https://mail-google.security-notification.top/auth"
  },
  {
    id: "org-08",
    name: "Nassau Offshore Shadow Proxy",
    country: "Bahamas",
    lat: 25.03,
    lng: -77.39,
    threatActor: "Bulletproof Reverse-Proxy Mesh",
    asn: "AS12389 (BTC Caribbean)",
    threatVolumePerHour: 5100,
    primaryVector: "Web3 Permit2 Drainer",
    intensity: 74,
    activePayloadUrl: "https://claim-airdrop-rewards.click/connect"
  }
];

// 8 High-Value Enterprise Target Hot-Spots
const ENTERPRISE_TARGETS: EnterpriseTarget[] = [
  {
    id: "tgt-01",
    name: "Wall Street Financial Exchange",
    city: "New York",
    country: "United States",
    lat: 40.71,
    lng: -74.00,
    sector: "Banking & Global Clearing",
    riskExposure: "Critical",
    intercepted24h: 342190,
    mitigationProtocol: "PHISGUARD Zero-Trust Edge v4.9"
  },
  {
    id: "tgt-02",
    name: "Silicon Valley Cloud Identity Core",
    city: "San Francisco",
    country: "United States",
    lat: 37.77,
    lng: -122.41,
    sector: "Enterprise SaaS & IdP Providers",
    riskExposure: "Critical",
    intercepted24h: 489120,
    mitigationProtocol: "Autonomous Neural Token Shield"
  },
  {
    id: "tgt-03",
    name: "London City FinTech Quadrant",
    city: "London",
    country: "United Kingdom",
    lat: 51.50,
    lng: -0.12,
    sector: "Cross-Border Wealth & Hedge Funds",
    riskExposure: "High",
    intercepted24h: 219400,
    mitigationProtocol: "AiTM Reverse-Proxy Neutralizer"
  },
  {
    id: "tgt-04",
    name: "Frankfurt Banking & Euro Clear",
    city: "Frankfurt",
    country: "Germany",
    lat: 50.11,
    lng: 8.68,
    sector: "European Central Banking Hub",
    riskExposure: "High",
    intercepted24h: 184500,
    mitigationProtocol: "RFC-5322 Inbound Mail Firewall"
  },
  {
    id: "tgt-05",
    name: "Tokyo High-Tech & Sovereign Data Hub",
    city: "Tokyo",
    country: "Japan",
    lat: 35.67,
    lng: 139.65,
    sector: "Semiconductor & Automotive IP",
    riskExposure: "Elevated",
    intercepted24h: 142800,
    mitigationProtocol: "DGA Shannon Entropy Radar"
  },
  {
    id: "tgt-06",
    name: "Singapore Maritime & Wealth Gateway",
    city: "Singapore",
    country: "Singapore",
    lat: 1.35,
    lng: 103.81,
    sector: "APAC Trade & Sovereign Capital",
    riskExposure: "High",
    intercepted24h: 198200,
    mitigationProtocol: "Real-Time MITRE T1566 Dropper Filter"
  },
  {
    id: "tgt-07",
    name: "Sydney Critical Infrastructure",
    city: "Sydney",
    country: "Australia",
    lat: -33.86,
    lng: 151.20,
    sector: "Telecommunications & Energy Grid",
    riskExposure: "Elevated",
    intercepted24h: 112400,
    mitigationProtocol: "Punycode Homoglyph Quarantine"
  },
  {
    id: "tgt-08",
    name: "Toronto Financial & Healthcare Core",
    city: "Toronto",
    country: "Canada",
    lat: 43.65,
    lng: -79.38,
    sector: "North American Health & Insurance",
    riskExposure: "Elevated",
    intercepted24h: 96400,
    mitigationProtocol: "Gemini Deep Neural Disassembler"
  }
];

interface ThreatHeatmapProps {
  onScanUrl?: (url: string) => void;
  className?: string;
}

export const ThreatHeatmap: React.FC<ThreatHeatmapProps> = ({
  onScanUrl,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [selectedVectorFilter, setSelectedVectorFilter] = useState<string>("all");
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<{
    type: "origin" | "target";
    data: AttackOrigin | EnterpriseTarget;
    x: number;
    y: number;
  } | null>(null);

  const [activeArcs, setActiveArcs] = useState<LiveAttackArc[]>([]);
  const [tickerEvents, setTickerEvents] = useState<string[]>([]);
  const [interceptCounter, setInterceptCounter] = useState<number>(1829420);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 900,
    height: 480
  });

  // Track container sizing with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          // Maintain a 16:9 to 2:1 dynamic aspect ratio
          const targetHeight = Math.max(380, Math.min(520, Math.round(width * 0.48)));
          setDimensions({ width, height: targetHeight });
        }
      }
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Filtered origins & targets based on selected vector
  const filteredOrigins = useMemo(() => {
    if (selectedVectorFilter === "all") return ATTACK_ORIGINS;
    return ATTACK_ORIGINS.filter((o) => o.primaryVector === selectedVectorFilter);
  }, [selectedVectorFilter]);

  // Generate continuous attack arcs
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      const randomOrigin = filteredOrigins[Math.floor(Math.random() * filteredOrigins.length)];
      const randomTarget = ENTERPRISE_TARGETS[Math.floor(Math.random() * ENTERPRISE_TARGETS.length)];
      if (!randomOrigin || !randomTarget) return;

      const newArc: LiveAttackArc = {
        id: `arc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        origin: randomOrigin,
        target: randomTarget,
        timestamp: Date.now(),
        status: "intercepted",
        payloadFamily: randomOrigin.primaryVector,
        latencyMs: Number((Math.random() * 1.4 + 0.6).toFixed(2))
      };

      setActiveArcs((prev) => [newArc, ...prev.slice(0, 11)]);
      setInterceptCounter((c) => c + 1);

      // Add to live telemetry ticker
      const timeStr = new Date().toLocaleTimeString("en-US", { hour12: false });
      const eventMsg = `[${timeStr}] ZERO-DAY INTERCEPT: ${randomOrigin.threatActor} -> ${randomTarget.name} (${randomOrigin.primaryVector}) neutralized in ${newArc.latencyMs}ms`;
      setTickerEvents((prev) => [eventMsg, ...prev.slice(0, 4)]);
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveActive, filteredOrigins]);

  // Main D3 Rendering Pipeline
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    // D3 Projection: Natural Earth 1 gives a mathematically proportional curved world representation
    const projection = d3.geoNaturalEarth1()
      .scale(width / 5.6)
      .translate([width / 2, height / 2 + 10]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Zoom container
    const g = svg.append("g").attr("class", "map-zoom-layer");

    // Configure D3 zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 4.5])
      .translateExtent([[0, 0], [width, height]])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Save zoom handler to DOM for external controls
    (svgRef.current as any).__d3_zoom = zoom;
    (svgRef.current as any).__d3_g = g;

    // Defs: Gradients and Markers
    const defs = svg.append("defs");

    // Graticule (Lat/Long Grid)
    const graticule = d3.geoGraticule().step([30, 30]);

    g.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", pathGenerator as any)
      .attr("fill", "none")
      .attr("stroke", "#1E293B")
      .attr("stroke-width", 0.75)
      .attr("stroke-dasharray", "2,3")
      .attr("opacity", 0.6);

    // Render Continents Base Paths
    g.selectAll(".continent-path")
      .data(WORLD_CONTINENTS_GEOJSON.features)
      .enter()
      .append("path")
      .attr("class", "continent-path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#0F172A")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1.2)
      .attr("stroke-linejoin", "round")
      .attr("opacity", 0.95);

    // Create D3 Radial Heatmap Density Halos around high-intensity attack origins
    filteredOrigins.forEach((origin) => {
      const coords = projection([origin.lng, origin.lat]);
      if (!coords) return;

      const gradId = `heat-grad-${origin.id}`;
      const radialGrad = defs.append("radialGradient")
        .attr("id", gradId)
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");

      radialGrad.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#EF4444")
        .attr("stop-opacity", (origin.intensity / 100) * 0.75);

      radialGrad.append("stop")
        .attr("offset", "60%")
        .attr("stop-color", "#F43F5E")
        .attr("stop-opacity", 0.25);

      radialGrad.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#EF4444")
        .attr("stop-opacity", 0);

      // Heat halo circle
      g.append("circle")
        .attr("cx", coords[0])
        .attr("cy", coords[1])
        .attr("r", (origin.intensity / 100) * 36 + 14)
        .attr("fill", `url(#${gradId})`)
        .attr("pointer-events", "none");
    });

    // Render Trajectory Attack Arcs
    activeArcs.forEach((arc) => {
      const p1 = projection([arc.origin.lng, arc.origin.lat]);
      const p2 = projection([arc.target.lng, arc.target.lat]);
      if (!p1 || !p2) return;

      // Calculate Bezier midpoint curvature
      const dx = p2[0] - p1[0];
      const dy = p2[1] - p1[1];
      const dr = Math.sqrt(dx * dx + dy * dy);
      const midX = (p1[0] + p2[0]) / 2;
      const midY = (p1[1] + p2[1]) / 2 - Math.min(60, dr * 0.25);

      const pathData = `M ${p1[0]} ${p1[1]} Q ${midX} ${midY} ${p2[0]} ${p2[1]}`;

      // Background path
      g.append("path")
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", "#EF4444")
        .attr("stroke-width", 1.2)
        .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.4);

      // Animated glowing projectile
      const projectile = g.append("circle")
        .attr("r", 3)
        .attr("fill", "#06B6D4")
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 1);

      // Animate projectile along the curved path
      const pathNode = g.append("path")
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", "none")
        .node();

      if (pathNode) {
        const totalLength = pathNode.getTotalLength();
        projectile
          .transition()
          .duration(1600)
          .ease(d3.easeCubicOut)
          .attrTween("transform", () => {
            return (t) => {
              const point = pathNode.getPointAtLength(t * totalLength);
              return `translate(${point.x}, ${point.y})`;
            };
          })
          .on("end", () => {
            // Target impact ripple
            g.append("circle")
              .attr("cx", p2[0])
              .attr("cy", p2[1])
              .attr("r", 4)
              .attr("fill", "none")
              .attr("stroke", "#10B981")
              .attr("stroke-width", 2)
              .transition()
              .duration(600)
              .attr("r", 18)
              .attr("opacity", 0)
              .remove();

            projectile.remove();
          });
      }
    });

    // Render Enterprise Target Hot-Spots (Protected nodes)
    ENTERPRISE_TARGETS.forEach((target) => {
      const coords = projection([target.lng, target.lat]);
      if (!coords) return;

      const targetGroup = g.append("g")
        .attr("class", "enterprise-target-node cursor-pointer")
        .attr("transform", `translate(${coords[0]}, ${coords[1]})`)
        .on("mouseenter", (event) => {
          const [x, y] = d3.pointer(event, svgRef.current);
          setHoveredNode({ type: "target", data: target, x, y });
          soundManager.playScanPing();
        })
        .on("mouseleave", () => {
          setHoveredNode(null);
        });

      // Target static outer ring
      targetGroup.append("circle")
        .attr("r", 7)
        .attr("fill", "#06B6D4")
        .attr("fill-opacity", 0.2)
        .attr("stroke", "#06B6D4")
        .attr("stroke-width", 1.5);

      // Target central core
      targetGroup.append("circle")
        .attr("r", 3.5)
        .attr("fill", "#38BDF8");

      // City label
      targetGroup.append("text")
        .attr("x", 9)
        .attr("y", 3)
        .attr("fill", "#94A3B8")
        .attr("font-size", "9px")
        .attr("font-family", "monospace")
        .attr("font-weight", "600")
        .text(target.city);
    });

    // Render Attack Origins (Hostile nodes)
    filteredOrigins.forEach((origin) => {
      const coords = projection([origin.lng, origin.lat]);
      if (!coords) return;

      const originGroup = g.append("g")
        .attr("class", "attack-origin-node cursor-pointer")
        .attr("transform", `translate(${coords[0]}, ${coords[1]})`)
        .on("mouseenter", (event) => {
          const [x, y] = d3.pointer(event, svgRef.current);
          setHoveredNode({ type: "origin", data: origin, x, y });
          soundManager.playScanPing();
        })
        .on("mouseleave", () => {
          setHoveredNode(null);
        })
        .on("click", () => {
          if (onScanUrl && origin.activePayloadUrl) {
            onScanUrl(origin.activePayloadUrl);
          }
        });

      // Pulsing outer ripple
      originGroup.append("circle")
        .attr("r", 6)
        .attr("fill", "none")
        .attr("stroke", "#EF4444")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.9)
        .append("animate")
        .attr("attributeName", "r")
        .attr("values", "5;14;5")
        .attr("dur", "2.4s")
        .attr("repeatCount", "indefinite");

      // Hostile core dot
      originGroup.append("circle")
        .attr("r", 4)
        .attr("fill", "#EF4444");

      // Label
      originGroup.append("text")
        .attr("x", -8)
        .attr("y", -7)
        .attr("text-anchor", "end")
        .attr("fill", "#FCA5A5")
        .attr("font-size", "9px")
        .attr("font-family", "monospace")
        .attr("font-weight", "bold")
        .text(origin.name.split(" ")[0]);
    });

  }, [dimensions, filteredOrigins, activeArcs, onScanUrl]);

  // Zoom control triggers
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = (svgRef.current as any).__d3_zoom;
    if (zoom) {
      svg.transition().duration(300).call(zoom.scaleBy, 1.35);
    }
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = (svgRef.current as any).__d3_zoom;
    if (zoom) {
      svg.transition().duration(300).call(zoom.scaleBy, 0.75);
    }
  };

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = (svgRef.current as any).__d3_zoom;
    if (zoom) {
      svg.transition().duration(350).call(zoom.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className={`bg-[#0F172A] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col ${className}`}>
      
      {/* Header Controls Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-[#0B0F19]/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <Crosshair className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
              GLOBAL THREAT ORIGIN HEATMAP & ATTACK RADAR
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                D3 GEOGRAPHIC ENGINE
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Real-time geolocation telemetry mapping bulletproof hosting ASNs, AiTM reverse-proxy staging nodes, and enterprise defense perimeters.
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Vector Filter Pills */}
          <div className="flex items-center gap-1 bg-[#090D18] p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {[
              { id: "all", label: "All Vectors" },
              { id: "AiTM Reverse Proxy", label: "AiTM Reverse-Proxy" },
              { id: "BEC Wire Fraud", label: "BEC & Wire Fraud" },
              { id: "Zero-Day Exploit", label: "Zero-Day Exploits" },
              { id: "Web3 Permit2 Drainer", label: "Web3 Drainers" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVectorFilter(v.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedVectorFilter === v.id
                    ? "bg-slate-800 text-cyan-300 font-bold border border-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Stream pause/resume */}
          <button
            id="heatmap-stream-toggle-btn"
            onClick={() => setIsLiveActive(!isLiveActive)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isLiveActive
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title="Toggle Live Ingestion Feed"
          >
            {isLiveActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isLiveActive ? "LIVE FEED" : "PAUSED"}</span>
          </button>

          {/* D3 Zoom Controls */}
          <div className="flex items-center gap-1 bg-[#090D18] p-1 rounded-xl border border-slate-800">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Heatmap Stage */}
      <div 
        ref={containerRef} 
        className="relative w-full bg-[#080C16] overflow-hidden select-none"
        style={{ minHeight: "380px" }}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
        />

        {/* Map Legend & Overlays */}
        <div className="absolute top-4 left-4 p-3 bg-[#0B0F19]/90 backdrop-blur-md rounded-xl border border-slate-800 text-xs font-mono space-y-2 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-slate-200 font-bold">Hostile Attack Origin ({filteredOrigins.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-slate-200 font-bold">Enterprise Target Hub (8)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Intercepted (24h): <strong className="text-slate-200">{interceptCounter.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Dynamic D3 Hover Tooltip */}
        {hoveredNode && (
          <div
            className="absolute z-20 pointer-events-none p-3.5 bg-[#0B0F19]/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl max-w-xs font-mono text-xs transition-transform duration-75"
            style={{
              left: `${Math.min(dimensions.width - 240, Math.max(10, hoveredNode.x + 12))}px`,
              top: `${Math.min(dimensions.height - 180, Math.max(10, hoveredNode.y - 40))}px`
            }}
          >
            {hoveredNode.type === "origin" ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-red-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    ATTACK CLUSTER
                  </span>
                  <span className="text-[10px] text-red-300 bg-red-500/20 px-1.5 py-0.5 rounded">
                    {(hoveredNode.data as AttackOrigin).intensity}% Heat
                  </span>
                </div>
                <p className="font-bold text-slate-100 text-sm">{(hoveredNode.data as AttackOrigin).name}</p>
                <p className="text-[11px] text-slate-400">{(hoveredNode.data as AttackOrigin).country}</p>
                <div className="space-y-1 pt-1 text-[11px]">
                  <p><span className="text-slate-400">Actor:</span> <strong className="text-amber-300">{(hoveredNode.data as AttackOrigin).threatActor}</strong></p>
                  <p><span className="text-slate-400">ASN:</span> <code className="text-slate-300">{(hoveredNode.data as AttackOrigin).asn}</code></p>
                  <p><span className="text-slate-400">Vector:</span> <span className="text-cyan-300">{(hoveredNode.data as AttackOrigin).primaryVector}</span></p>
                  <p><span className="text-slate-400">Volume:</span> <span className="text-red-400 font-bold">{(hoveredNode.data as AttackOrigin).threatVolumePerHour.toLocaleString()} hits/hr</span></p>
                </div>
                <div className="pt-1.5 text-[10px] text-cyan-400 flex items-center gap-1 border-t border-slate-800">
                  <ExternalLink className="w-3 h-3" />
                  <span>Click to load active payload in Deep Scan</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-cyan-400 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    PROTECTED HUB
                  </span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                    Active Defense
                  </span>
                </div>
                <p className="font-bold text-slate-100 text-sm">{(hoveredNode.data as EnterpriseTarget).name}</p>
                <p className="text-[11px] text-slate-400">{(hoveredNode.data as EnterpriseTarget).city}, {(hoveredNode.data as EnterpriseTarget).country}</p>
                <div className="space-y-1 pt-1 text-[11px]">
                  <p><span className="text-slate-400">Sector:</span> <strong className="text-slate-200">{(hoveredNode.data as EnterpriseTarget).sector}</strong></p>
                  <p><span className="text-slate-400">Shielded (24h):</span> <strong className="text-emerald-400 font-bold">{(hoveredNode.data as EnterpriseTarget).intercepted24h.toLocaleString()} attacks</strong></p>
                  <p><span className="text-slate-400">Policy:</span> <span className="text-cyan-300 text-[10px]">{(hoveredNode.data as EnterpriseTarget).mitigationProtocol}</span></p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Stream Ticker & Telemetry Strip */}
      <div className="p-3 bg-[#0A0E1A] border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400 overflow-hidden w-full sm:w-auto">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
          <span className="text-[11px] font-bold text-cyan-400 shrink-0">LIVE INTERCEPTION STREAM:</span>
          <div className="truncate text-[11px] text-slate-300">
            {tickerEvents[0] || "Monitoring global threat origins via BGP and HTTP interceptors..."}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-400">
          <span>Active Origin ASNs: <strong className="text-slate-200">8</strong></span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">Global Mitigation SLA: <strong className="text-emerald-400">&lt; 1.2ms</strong></span>
        </div>
      </div>

    </div>
  );
};

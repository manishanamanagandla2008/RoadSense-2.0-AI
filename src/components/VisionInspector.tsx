import React, { useState } from 'react';
import { INSPECTION_PRESETS, InspectionPreset } from '../data/mockRoadData.js';
import { DetectedBoundingBox } from '../types/roadsense.js';
import {
  Scan,
  AlertTriangle,
  Upload,
  Gauge,
  Activity,
  CheckCircle2,
  Maximize2,
  ShieldAlert,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

interface VisionInspectorProps {
  onHazardReported?: (hazard: any) => void;
  onNavigateToMap: () => void;
}

export const VisionInspector: React.FC<VisionInspectorProps> = ({ onNavigateToMap }) => {
  const [selectedPreset, setSelectedPreset] = useState<InspectionPreset>(INSPECTION_PRESETS[0]);
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const [showOverlays, setShowOverlays] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customBoxes, setCustomBoxes] = useState<DetectedBoundingBox[] | null>(null);
  const [customStats, setCustomStats] = useState<{
    score: number;
    iri: number;
    vibration: number;
    speed: number;
  } | null>(null);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Handle preset switch
  const handleSelectPreset = (preset: InspectionPreset) => {
    setIsScanning(true);
    setSelectedPreset(preset);
    setUploadedImage(null);
    setCustomBoxes(null);
    setCustomStats(null);
    setActiveBoxId(null);
    setTimeout(() => setIsScanning(false), 350);
  };

  // Handle user custom photo upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setUploadedImage(url);
      setIsScanning(true);

      // Simulate neural network inference on uploaded image
      setTimeout(() => {
        setIsScanning(false);
        setCustomBoxes([
          {
            id: 'upload-box-1',
            label: 'Surface Distress / Depressed Asphalt',
            category: 'pothole',
            severity: 'critical',
            confidence: 96,
            x: 32,
            y: 58,
            width: 32,
            height: 22,
            dimensions: 'Est. Depth: 6.4cm · Area: 0.35m²'
          },
          {
            id: 'upload-box-2',
            label: 'Longitudinal Joint Crack',
            category: 'crack',
            severity: 'moderate',
            confidence: 91,
            x: 68,
            y: 48,
            width: 18,
            height: 30,
            dimensions: 'Width: 12mm'
          }
        ]);
        setCustomStats({
          score: 44,
          iri: 4.1,
          vibration: 2.1,
          speed: 25
        });
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const currentImage = uploadedImage || selectedPreset.image;
  const currentBoxes = customBoxes || selectedPreset.detectedBoxes;
  const currentScore = customStats?.score ?? selectedPreset.pavementQualityScore;
  const currentIri = customStats?.iri ?? selectedPreset.iriEstimated;
  const currentVibration = customStats?.vibration ?? selectedPreset.vibrationImpactG;
  const currentSpeed = customStats?.speed ?? selectedPreset.recommendedSpeedMph;

  const handleDispatch = (hazardLabel: string) => {
    setDispatchSuccess(`Municipal ticket dispatched for: ${hazardLabel}. Work order dispatched to Rapid Pavement Unit.`);
    setTimeout(() => setDispatchSuccess(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner / Headline */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI VISION ROAD INSPECTION ENGINE · YOLOv11 & RESNET-PVMNT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Real-Time Computer Vision Hazard & Surface Analysis
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Continuous automated telemetry detects potholes, longitudinal fatigue fissures, and hydroplane pooling from dashcams and mobile telemetry in under 40 milliseconds with verified dimensional metrics.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Preset Selector & Upload Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap pl-1">
            Presets:
          </span>
          {INSPECTION_PRESETS.map((preset) => {
            const isSelected = !uploadedImage && selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-amber-400 shadow-sm font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {preset.name.split('·')[0].trim()}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Overlays */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showOverlays
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showOverlays ? 'Hide Boxes' : 'Show Boxes'}</span>
          </button>

          {/* Upload Custom Image */}
          <label className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-sm transition-all hover:scale-[1.02]">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Road Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {dispatchSuccess && (
        <div className="bg-emerald-900/90 text-emerald-100 border border-emerald-700 rounded-xl p-4 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{dispatchSuccess}</span>
          </div>
          <button onClick={() => setDispatchSuccess(null)} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Vision Stage & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Vision Canvas (7 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
          {/* Video / Camera Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>DASHCAM_INFERENCE_FEED // 60FPS</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400">{uploadedImage ? 'Custom Telemetry Image' : selectedPreset.category}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <span>CONFIDENCE: 96.8%</span>
              <span>·</span>
              <span>LATENCY: 38ms</span>
            </div>
          </div>

          {/* Visual Canvas Container with Bounding Boxes */}
          <div className="relative aspect-video w-full bg-slate-900 overflow-hidden group select-none">
            <img
              src={currentImage}
              alt="Road Inspection Feed"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isScanning ? 'opacity-40 blur-xs' : 'opacity-100'
              }`}
            />

            {/* Neural Net Scanning Line Animation */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center bg-slate-950/60 z-20">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-3" />
                <span className="font-mono text-xs text-amber-300 tracking-wider">SEGMENTING ASPHALT DISTRESS...</span>
              </div>
            )}

            {/* Bounding Box Overlays */}
            {showOverlays && !isScanning && currentBoxes.map((box) => {
              const isActive = activeBoxId === box.id;
              const isCritical = box.severity === 'critical';
              const isHigh = box.severity === 'high';

              const borderColor = isCritical
                ? 'border-rose-500'
                : isHigh
                ? 'border-amber-500'
                : 'border-sky-400';

              const badgeBg = isCritical
                ? 'bg-rose-600'
                : isHigh
                ? 'bg-amber-600'
                : 'bg-sky-600';

              return (
                <div
                  key={box.id}
                  onClick={() => setActiveBoxId(isActive ? null : box.id)}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                  className={`absolute border-2 ${borderColor} cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-500/20 ring-4 ring-amber-400/50 scale-[1.02] z-20'
                      : 'hover:bg-slate-900/30'
                  }`}
                >
                  {/* Tag Header */}
                  <div className={`absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded-t text-[10px] font-mono font-bold text-white ${badgeBg} shadow-sm whitespace-nowrap`}>
                    <span>{box.label}</span>
                    <span className="text-white/80">{box.confidence}%</span>
                  </div>

                  {/* Corner Targets */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />

                  {/* Inspection Dimension Tooltip */}
                  {box.dimensions && (
                    <div className="absolute -bottom-6 left-0 bg-slate-950/90 text-[10px] font-mono text-slate-200 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
                      {box.dimensions}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lower Action Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-3 text-slate-300">
              <span className="text-slate-400">Distress Count:</span>
              <span className="font-mono font-bold text-amber-400">{currentBoxes.length} Anomaly Detections</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Active Selection:</span>
              <span className="font-mono text-slate-200">
                {activeBoxId ? currentBoxes.find(b => b.id === activeBoxId)?.label : 'Click any box to inspect'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToMap}
                className="px-3 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                View on Digital Twin Map
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Pavement Health & Hazard Telemetry (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Road Health Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pavement Health Index</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                currentScore >= 75 ? 'bg-emerald-100 text-emerald-800' :
                currentScore >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {currentScore >= 75 ? 'Optimal' : currentScore >= 50 ? 'Compromised' : 'Severe Distress'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900">{currentScore}</span>
              <span className="text-slate-400 text-sm font-medium">/ 100 RHI</span>
            </div>

            {/* Health Meter Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                style={{ width: `${currentScore}%` }}
                className={`h-full transition-all duration-500 ${
                  currentScore >= 75 ? 'bg-emerald-500' :
                  currentScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
            </div>

            {/* Engineering Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Roughness (IRI)</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{currentIri} m/km</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Vibration Impact</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{currentVibration} G</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[11px]">Driver Safe Advisory Speed</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{currentSpeed} MPH Recommended</span>
                </div>
                <Gauge className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Detected Anomalies List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Anomaly Detections ({currentBoxes.length})
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {currentBoxes.map((box) => (
                <div
                  key={box.id}
                  onClick={() => setActiveBoxId(box.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    activeBoxId === box.id
                      ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{box.label}</span>
                    <span className="font-mono text-[11px] text-slate-500">{box.confidence}% match</span>
                  </div>

                  {box.dimensions && (
                    <div className="text-[11px] font-mono text-slate-600 mb-2">
                      {box.dimensions}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                      box.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                      box.severity === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {box.severity} Hazard
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDispatch(box.label);
                      }}
                      className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                    >
                      Dispatch Repair ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

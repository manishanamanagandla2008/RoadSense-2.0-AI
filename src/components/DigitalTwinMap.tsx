import React, { useState, useEffect, useRef } from 'react';
import { RoadHazard, RoadSegment } from '../types/roadsense.js';
import {
  MapPin,
  AlertTriangle,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  TrendingDown,
  Navigation,
  ThumbsUp,
  X
} from 'lucide-react';
import L from 'leaflet';

interface DigitalTwinMapProps {
  hazards: RoadHazard[];
  segments: RoadSegment[];
  onUpvoteHazard: (hazardId: string) => void;
  onNavigateToVision: () => void;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  hazards,
  segments,
  onUpvoteHazard,
  onNavigateToVision
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const segmentsLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedHazard, setSelectedHazard] = useState<RoadHazard | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<RoadSegment | null>(null);
  const [hazardFilter, setHazardFilter] = useState<string>('all');
  const [showSegments, setShowSegments] = useState<boolean>(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on Bay Area Corridor (San Francisco - Peninsula - South Valley)
    const map = L.map(mapContainerRef.current, {
      center: [37.72, -122.35],
      zoom: 11,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // High quality CartoDB Positron tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);
    segmentsLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Road Segments (Polylines)
  useEffect(() => {
    if (!mapInstanceRef.current || !segmentsLayerRef.current) return;
    segmentsLayerRef.current.clearLayers();

    if (!showSegments) return;

    segments.forEach((seg) => {
      const color =
        seg.healthScore >= 75 ? '#10B981' : // Emerald
        seg.healthScore >= 50 ? '#F59E0B' : // Amber
        '#EF4444'; // Red

      const poly = L.polyline(seg.coordinates, {
        color,
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      });

      poly.on('click', () => {
        setSelectedHazard(null);
        setSelectedSegment(seg);
      });

      poly.bindTooltip(
        `<strong>${seg.name}</strong><br/>Health: ${seg.healthScore}/100 · IRI: ${seg.iri} m/km`,
        { sticky: true, className: 'roadsense-tooltip' }
      );

      segmentsLayerRef.current?.addLayer(poly);
    });
  }, [segments, showSegments]);

  // Update Hazard Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    const filtered = hazards.filter((h) => {
      if (hazardFilter === 'all') return true;
      return h.type === hazardFilter;
    });

    filtered.forEach((h) => {
      const isCritical = h.severity === 'critical';
      const isHigh = h.severity === 'high';
      const bgColor = isCritical ? '#EF4444' : isHigh ? '#F59E0B' : '#0284C7';

      // Custom SVG Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-hazard-marker',
        html: `
          <div style="background-color: ${bgColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.35); border: 2px solid white; cursor: pointer;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([h.latitude, h.longitude], { icon: customIcon });

      marker.on('click', () => {
        setSelectedSegment(null);
        setSelectedHazard(h);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [hazards, hazardFilter]);

  const handleFocusHazard = (h: RoadHazard) => {
    setSelectedHazard(h);
    setSelectedSegment(null);
    mapInstanceRef.current?.setView([h.latitude, h.longitude], 14, { animate: true });
  };

  return (
    <div className="space-y-4">
      {/* Map Control Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap pl-1 mr-1">
            Hazard Filters:
          </span>
          {['all', 'pothole', 'waterlogging', 'crack', 'debris', 'cave_in'].map((type) => {
            const label =
              type === 'all' ? 'All (6)' :
              type === 'pothole' ? 'Potholes' :
              type === 'waterlogging' ? 'Waterlogging' :
              type === 'crack' ? 'Fissures' :
              type === 'debris' ? 'Debris' : 'Cave-ins';

            const count = type === 'all' ? hazards.length : hazards.filter(h => h.type === type).length;

            return (
              <button
                key={type}
                onClick={() => setHazardFilter(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  hazardFilter === type
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSegments(!showSegments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showSegments
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showSegments ? 'Road Health Colors ON' : 'Pavement Colors OFF'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas + Floating Inspection Drawer */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 h-[640px]">
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Legend Box Floating in Top Left */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/80 shadow-lg text-xs space-y-2 max-w-[210px]">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Road Health Index (RHI)</div>
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>85 - 100: Pristine / Resurfaced</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>50 - 84: Moderate Wear</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>&lt; 50: Severe Hazard Cluster</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
            Click any pin or road segment to inspect live telemetry.
          </div>
        </div>

        {/* Selected Hazard Inspector Drawer (Bottom Left Floating) */}
        {selectedHazard && (
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  selectedHazard.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                  selectedHazard.severity === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                }`}>
                  {selectedHazard.severity} Severity
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{selectedHazard.title}</h4>
                <p className="text-xs text-slate-500 font-mono">{selectedHazard.roadName}</p>
              </div>
              <button
                onClick={() => setSelectedHazard(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 my-2 border-y border-slate-100">
              <div>
                <span className="text-slate-500 block text-[11px]">AI Confidence</span>
                <span className="font-mono font-bold text-slate-900">{selectedHazard.confidence}% Verified</span>
              </div>
              {selectedHazard.depthCm && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Measured Depth</span>
                  <span className="font-mono font-bold text-rose-600">{selectedHazard.depthCm} cm</span>
                </div>
              )}
              <div>
                <span className="text-slate-500 block text-[11px]">Municipal Status</span>
                <span className="font-medium text-slate-800 capitalize">{selectedHazard.status}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Reported</span>
                <span className="text-slate-600">{selectedHazard.reportedAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => onUpvoteHazard(selectedHazard.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Confirm ({selectedHazard.upvotes || 0})</span>
              </button>

              <button
                onClick={onNavigateToVision}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                <span>Vision Scan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Selected Road Segment Inspector Drawer (Bottom Left Floating) */}
        {selectedSegment && (
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {selectedSegment.region} Corridor
                </span>
                <h4 className="font-bold text-sm text-slate-900">{selectedSegment.name}</h4>
              </div>
              <button
                onClick={() => setSelectedSegment(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 my-2 border-y border-slate-100">
              <div>
                <span className="text-slate-500 block text-[11px]">Road Health Index</span>
                <span className={`font-mono font-bold text-sm ${
                  selectedSegment.healthScore >= 75 ? 'text-emerald-600' :
                  selectedSegment.healthScore >= 50 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {selectedSegment.healthScore} / 100
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Roughness (IRI)</span>
                <span className="font-mono font-bold text-slate-900">{selectedSegment.iri} m/km</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Active Hazards</span>
                <span className="font-mono font-bold text-slate-900">{selectedSegment.activeHazardsCount}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Last Resurfaced</span>
                <span className="text-slate-700">{selectedSegment.lastPaved}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500">
              Surface Type: <strong className="text-slate-800">{selectedSegment.surfaceType}</strong> · Speed Limit: {selectedSegment.speedLimit} MPH
            </div>
          </div>
        )}

        {/* Hazard List Quick Nav (Right Side Floating) */}
        <div className="absolute top-4 right-4 z-10 hidden md:block bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl max-w-xs w-72 overflow-hidden">
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between text-xs font-semibold">
            <span>High-Priority Blackspots</span>
            <span className="font-mono text-amber-400">{hazards.length} Items</span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
            {hazards.map((h) => (
              <div
                key={h.id}
                onClick={() => handleFocusHazard(h)}
                className={`p-3 cursor-pointer transition-colors ${
                  selectedHazard?.id === h.id ? 'bg-amber-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-slate-900 truncate">{h.roadName}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    h.severity === 'critical' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'
                  }`}>
                    {h.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{h.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

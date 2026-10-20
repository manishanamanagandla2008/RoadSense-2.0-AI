import React, { useState } from 'react';
import { ROUTE_OPTIONS } from '../data/mockRoadData.js';
import { RouteOption } from '../types/roadsense.js';
import {
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Compass,
  ArrowRight,
  CheckCircle2,
  Car,
  Sparkles,
  Zap
} from 'lucide-react';

interface RouteNavigatorProps {
  onLaunchHUD: () => void;
}

export const RouteNavigator: React.FC<RouteNavigatorProps> = ({ onLaunchHUD }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-safest');
  const [origin, setOrigin] = useState('San Francisco Int. Airport (SFO)');
  const [destination, setDestination] = useState('Financial District, Downtown SF');

  const activeRoute = ROUTE_OPTIONS.find((r) => r.id === selectedRouteId) || ROUTE_OPTIONS[0];
  const safestRoute = ROUTE_OPTIONS[0];
  const fastestRoute = ROUTE_OPTIONS[1];

  return (
    <div className="space-y-6">
      {/* Search & Waypoint Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-3 flex-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-600 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>ROADSENSE AI SAFEROUTE™ ENGINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Safety-Optimized Road Routing vs. Traditional Fastest Path
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unlike generic GPS apps that only prioritize travel minutes, RoadSense AI dynamically avoids pavement distress, active pothole clusters, low-friction waterlogged zones, and high-fatality blackspots.
            </p>
          </div>

          <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[280px]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Origin</span>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side Route Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ROUTE_OPTIONS.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isSafest = route.id === 'route-safest';

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? isSafest
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-400/20'
                    : 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-400/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isSafest ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {route.tag}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{route.name}</h3>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono font-bold text-slate-900 text-sm">{route.durationMinutes} min</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{route.distanceKm} km</span>
                </div>
              </div>

              {/* Safety Score Meter */}
              <div className="space-y-1.5 my-3 bg-white p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Road Safety Score</span>
                  <span className={`font-mono font-bold ${
                    route.safetyScore >= 85 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {route.safetyScore} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${route.safetyScore}%` }}
                    className={`h-full ${
                      route.safetyScore >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                </div>
              </div>

              {/* Key Differential Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 mb-3">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Potholes</span>
                  <span className={`font-mono font-bold text-sm ${route.potholesEnRoute === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {route.potholesEnRoute}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Waterlogged</span>
                  <span className={`font-mono font-bold text-sm ${route.waterloggedSections === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {route.waterloggedSections}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Roughness IRI</span>
                  <span className="font-mono font-bold text-sm text-slate-800">
                    {route.roughnessAvgIri} m/km
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {route.description}
              </p>

              <button
                className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{isSelected ? 'Selected for Navigation' : 'Select This Route'}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trade-off summary banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-white block">AI Safety Trade-off Analysis:</span>
            <span className="text-slate-300">
              Choosing the SafeRoute adds only <strong>+3 minutes</strong>, while eliminating <strong>100% of severe rim-damaging potholes</strong> and avoiding 2 hydroplaning zones.
            </span>
          </div>
        </div>

        <button
          onClick={onLaunchHUD}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-lg shadow-sm whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1.5"
        >
          <Car className="w-4 h-4" />
          <span>Launch Driver HUD Mode</span>
        </button>
      </div>

      {/* Turn-by-Turn Road Condition Itinerary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            Turn-by-Turn Pavement Itinerary · {activeRoute.name}
          </h3>
          <span className="text-xs font-mono text-slate-500">{activeRoute.turnSteps.length} Maneuver Points</span>
        </div>

        <div className="space-y-3">
          {activeRoute.turnSteps.map((step, idx) => {
            const isHazard = step.roadCondition === 'Hazardous';
            const isCaution = step.roadCondition === 'Caution';
            const isSmooth = step.roadCondition === 'Smooth';

            const badgeBg =
              isHazard ? 'bg-rose-100 text-rose-800 border-rose-200' :
              isCaution ? 'bg-amber-100 text-amber-800 border-amber-200' :
              'bg-emerald-100 text-emerald-800 border-emerald-200';

            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  {idx + 1}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-slate-900">{step.instruction}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border self-start sm:self-auto font-bold uppercase ${badgeBg}`}>
                      {step.roadCondition} Pavement
                    </span>
                  </div>

                  {step.tip && (
                    <p className={`mt-1 text-[11px] font-mono ${
                      isHazard ? 'text-rose-700 font-semibold' : 'text-slate-500'
                    }`}>
                      {step.tip}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

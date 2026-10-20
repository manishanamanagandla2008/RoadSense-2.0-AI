import React from 'react';
import { NavView } from '../types/roadsense.js';
import {
  ShieldAlert,
  Eye,
  Map as MapIcon,
  Navigation,
  Gauge,
  Building2,
  Sparkles,
  PlusCircle,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';

interface NavbarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenReportModal: () => void;
  activeHazardsCount: number;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenReportModal,
  activeHazardsCount,
  audioEnabled,
  onToggleAudio
}) => {
  const navItems: Array<{ id: NavView; label: string; icon: React.ReactNode }> = [
    { id: 'vision', label: 'Vision AI Inspector', icon: <Eye className="w-4 h-4" /> },
    { id: 'map', label: 'Digital Twin Map', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'routes', label: 'SafeRoute Navigator', icon: <Navigation className="w-4 h-4" /> },
    { id: 'hud', label: 'Driver HUD Simulator', icon: <Gauge className="w-4 h-4" /> },
    { id: 'municipal', label: 'Municipal Command', icon: <Building2 className="w-4 h-4" /> },
    { id: 'advisor', label: 'AI Safety Advisor', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectView('vision')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center shadow-md shadow-orange-950/30 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-white">RoadSense<span className="text-amber-400">.AI</span></span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-normal">Next-Gen Road Safety & Hazard Vision</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Audio alert toggle */}
            <button
              onClick={onToggleAudio}
              title={audioEnabled ? 'Audio hazard warnings enabled' : 'Audio hazard warnings muted'}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                audioEnabled
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Active Hazard Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-ping" />
              <span>{activeHazardsCount} Hazards Active</span>
            </div>

            {/* Report Citizen Hazard Button */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md shadow-orange-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Defect</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { playHazardAlert } from '../utils/audioAlert.js';
import {
  Gauge,
  AlertTriangle,
  Radio,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudRain,
  ShieldAlert,
  Flame,
  Activity,
  Maximize2
} from 'lucide-react';

interface DriverHUDProps {
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onExitHUD: () => void;
}

export const DriverHUD: React.FC<DriverHUDProps> = ({
  audioEnabled,
  onToggleAudio,
  onExitHUD
}) => {
  const [speed, setSpeed] = useState<number>(45);
  const [roadHealth, setRoadHealth] = useState<number>(78);
  const [gForce, setGForce] = useState<number>(0.12);
  const [weatherMode, setWeatherMode] = useState<'Clear' | 'Rain' | 'Fog'>('Rain');
  const [isDriving, setIsDriving] = useState<boolean>(true);
  const [hazardDistance, setHazardDistance] = useState<number>(240); // meters
  const [activeHazardTitle, setActiveHazardTitle] = useState<string>('Severe 7.8cm Pothole Cluster in Right Lane');
  const [hazardSeverity, setHazardSeverity] = useState<'moderate' | 'high' | 'critical'>('critical');
  const [vibrationLog, setVibrationLog] = useState<number[]>([0.1, 0.12, 0.11, 0.14, 0.13, 0.12, 0.15, 0.12]);

  // Driving Simulation Loop
  useEffect(() => {
    if (!isDriving) return;

    const interval = setInterval(() => {
      setHazardDistance((prev) => {
        if (prev <= 20) {
          // Hazard passed! Trigger impact vibration & chime if audio enabled
          if (audioEnabled) {
            playHazardAlert('critical');
          }
          setGForce(2.8); // High spike on impact!
          setRoadHealth(38);

          // Reset to next upcoming hazard
          setTimeout(() => {
            setRoadHealth(82);
            setGForce(0.14);
            setActiveHazardTitle('Standing Water / Hydroplane Zone (5.2cm depth)');
            setHazardSeverity('high');
          }, 2500);

          return 380; // Next hazard distance
        }

        // Warning trigger at 100 meters
        if (prev === 100 && audioEnabled) {
          playHazardAlert('warning');
        }

        return prev - 10;
      });

      // Subtle vibration noise
      setVibrationLog((prev) => {
        const nextVal = Number((Math.random() * 0.15 + 0.08).toFixed(2));
        return [...prev.slice(1), nextVal];
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isDriving, audioEnabled]);

  const handleManualAlertTest = () => {
    playHazardAlert('critical');
  };

  const handleImpactTest = () => {
    setGForce(3.1);
    setRoadHealth(32);
    if (audioEnabled) playHazardAlert('critical');
    setTimeout(() => {
      setGForce(0.12);
      setRoadHealth(78);
    }, 2000);
  };

  return (
    <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top HUD Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ROADSENSE HUD // ACTIVE COCKPIT TELEMETRY</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">·</span>
          <span className="text-slate-400 hidden sm:inline">GPS FIX: HIGH PRECISION (±0.8m)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Weather Toggle */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            {(['Clear', 'Rain', 'Fog'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setWeatherMode(w)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  weatherMode === w ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-lg border text-xs ${
              audioEnabled ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-slate-800 text-slate-500'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsDriving(!isDriving)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs"
          >
            {isDriving ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isDriving ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={onExitHUD}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 text-xs"
          >
            Exit Cockpit
          </button>
        </div>
      </div>

      {/* Main HUD Gauge Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 items-center">
        {/* Speedometer Gauge */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 text-center space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Ground Velocity</span>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-black font-mono tracking-tight text-white">{speed}</span>
            <span className="text-sm font-mono text-slate-400">MPH</span>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setSpeed((s) => Math.max(10, s - 5))}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono"
            >
              -5 Brake
            </button>
            <button
              onClick={() => setSpeed((s) => Math.min(85, s + 5))}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-amber-400"
            >
              +5 Accel
            </button>
          </div>
        </div>

        {/* Center: Live Hazard Radar & Proximity Countdown */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border-2 border-rose-500/40 p-6 text-center space-y-3 relative overflow-hidden shadow-rose-950/20 shadow-2xl">
          {/* Radar sweep animation */}
          <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>Incoming Pavement Hazard</span>
          </div>

          <div className="py-2">
            <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
              {hazardDistance} <span className="text-lg font-normal text-slate-400">METERS</span>
            </div>
            <p className="text-xs text-amber-300 font-medium mt-1">
              {activeHazardTitle}
            </p>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              style={{ width: `${Math.min(100, Math.max(5, (hazardDistance / 380) * 100))}%` }}
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 text-[11px] font-mono text-slate-400">
            <button
              onClick={handleManualAlertTest}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <Volume2 className="w-3 h-3" /> Test Chime
            </button>
            <span>·</span>
            <button
              onClick={handleImpactTest}
              className="text-rose-400 hover:underline"
            >
              Simulate Pothole Strike
            </button>
          </div>
        </div>

        {/* Road Health Index & Vibration Sensor */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 text-center space-y-3">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Pavement Quality (RHI)</span>
          <div className="flex items-baseline justify-center gap-2">
            <span className={`text-6xl font-black font-mono tracking-tight ${
              roadHealth >= 70 ? 'text-emerald-400' : roadHealth >= 50 ? 'text-amber-400' : 'text-rose-500'
            }`}>
              {roadHealth}
            </span>
            <span className="text-sm font-mono text-slate-400">/ 100</span>
          </div>

          {/* Accelerometer Vertical G-Force */}
          <div className="pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-1">
              <span>Accelerometer Z-Axis</span>
              <span className={`font-bold ${gForce > 1.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {gForce} G
              </span>
            </div>

            {/* Micro G-Force bar chart */}
            <div className="flex items-end gap-1 h-6 pt-1">
              {vibrationLog.map((val, idx) => (
                <div
                  key={idx}
                  style={{ height: `${Math.min(100, (val / 3) * 100)}%` }}
                  className={`flex-1 rounded-xs transition-all ${
                    val > 1.5 ? 'bg-rose-500' : val > 0.8 ? 'bg-amber-400' : 'bg-cyan-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Live Advisory Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2.5 text-slate-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {weatherMode === 'Rain'
              ? 'Inclement Rain Multiplier Active: Friction reduced by 34%. Increase braking distance by 2.2x.'
              : weatherMode === 'Fog'
              ? 'Low Visibility Advisory: Maintain 40 MPH max speed on approaching blind curves.'
              : 'Clear Pavement Conditions: Baseline traction nominal.'}
          </span>
        </div>

        <span className="text-amber-400 font-bold shrink-0">
          RECOMMENDED SPEED: 35 MPH
        </span>
      </div>
    </div>
  );
};

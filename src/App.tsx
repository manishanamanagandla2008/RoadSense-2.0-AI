import React, { useState } from 'react';
import { NavView, RoadHazard } from './types/roadsense.js';
import { INITIAL_HAZARDS, ROAD_SEGMENTS } from './data/mockRoadData.js';
import { Navbar } from './components/Navbar.js';
import { VisionInspector } from './components/VisionInspector.js';
import { DigitalTwinMap } from './components/DigitalTwinMap.js';
import { RouteNavigator } from './components/RouteNavigator.js';
import { DriverHUD } from './components/DriverHUD.js';
import { MunicipalCommand } from './components/MunicipalCommand.js';
import { AiSafetyAdvisor } from './components/AiSafetyAdvisor.js';
import { CitizenReportModal } from './components/CitizenReportModal.js';
import { ShieldCheck, Heart, Github, Activity } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('vision');
  const [hazards, setHazards] = useState<RoadHazard[]>(INITIAL_HAZARDS);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpvoteHazard = (hazardId: string) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === hazardId ? { ...h, upvotes: (h.upvotes || 0) + 1 } : h))
    );
    setToastMessage('Hazard confirmation recorded. Community verification score updated.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddReport = (newHazard: RoadHazard) => {
    setHazards((prev) => [newHazard, ...prev]);
    setToastMessage(`Hazard "${newHazard.title}" verified by RoadSense AI & broadcasted to driver network.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeHazardsCount={hazards.length}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="sticky top-16 z-40 px-4 pt-3 max-w-7xl mx-auto w-full">
          <div className="bg-slate-900 text-amber-300 border border-amber-500/40 rounded-xl px-4 py-3 text-xs flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-4">✕</button>
          </div>
        </div>
      )}

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'vision' && (
          <VisionInspector
            onNavigateToMap={() => setCurrentView('map')}
          />
        )}

        {currentView === 'map' && (
          <DigitalTwinMap
            hazards={hazards}
            segments={ROAD_SEGMENTS}
            onUpvoteHazard={handleUpvoteHazard}
            onNavigateToVision={() => setCurrentView('vision')}
          />
        )}

        {currentView === 'routes' && (
          <RouteNavigator
            onLaunchHUD={() => setCurrentView('hud')}
          />
        )}

        {currentView === 'hud' && (
          <DriverHUD
            audioEnabled={audioEnabled}
            onToggleAudio={() => setAudioEnabled(!audioEnabled)}
            onExitHUD={() => setCurrentView('routes')}
          />
        )}

        {currentView === 'municipal' && (
          <MunicipalCommand
            hazards={hazards}
            onNavigateToMap={() => setCurrentView('map')}
          />
        )}

        {currentView === 'advisor' && (
          <AiSafetyAdvisor />
        )}
      </main>

      {/* Citizen Hazard Report Modal */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleAddReport}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-bold text-white tracking-tight">RoadSense<span className="text-amber-400">.AI</span></span>
            <span>·</span>
            <span>Next-Generation Intelligent Road Surface Safety & Hazard Telemetry</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Computer Vision & Edge Telemetry</span>
            <span>·</span>
            <span className="text-slate-500 font-mono">v4.2.0-STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

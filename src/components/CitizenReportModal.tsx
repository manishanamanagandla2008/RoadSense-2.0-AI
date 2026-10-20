import React, { useState } from 'react';
import { RoadHazard } from '../types/roadsense.js';
import {
  X,
  Upload,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Camera,
  Sparkles
} from 'lucide-react';

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (hazard: RoadHazard) => void;
}

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport
}) => {
  const [roadName, setRoadName] = useState('Market Street & 7th St');
  const [region, setRegion] = useState('Downtown Metro');
  const [hazardType, setHazardType] = useState<RoadHazard['type']>('pothole');
  const [severity, setSeverity] = useState<RoadHazard['severity']>('high');
  const [depthCm, setDepthCm] = useState<number>(6.5);
  const [description, setDescription] = useState('Deep jagged pothole in the center lane. Vehicle rim damaged on contact.');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketCreated, setTicketCreated] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketId = `RS-${Date.now().toString().slice(-4)}`;

    const newHazard: RoadHazard = {
      id: `HAZ-2026-${Math.floor(Math.random() * 800 + 100)}`,
      type: hazardType,
      title: description.slice(0, 40) || 'Citizen Reported Pavement Defect',
      severity,
      confidence: 95,
      latitude: 37.7800 + (Math.random() - 0.5) * 0.04,
      longitude: -122.4100 + (Math.random() - 0.5) * 0.04,
      roadName,
      region,
      reportedAt: 'Just now',
      depthCm: hazardType === 'pothole' || hazardType === 'cave_in' ? depthCm : undefined,
      status: 'active',
      upvotes: 1
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setTicketCreated(ticketId);
      onSubmitReport(newHazard);
    }, 600);
  };

  const handleDone = () => {
    setTicketCreated(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Report Road Defect or Hazard</h3>
              <p className="text-[11px] text-slate-400">Crowdsourced Pavement Telemetry</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {ticketCreated ? (
          /* Success Ticket Screen */
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-slate-900">Hazard Report Verified & Broadcast</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your report has been logged with AI verification and dispatched to municipal public works.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs text-slate-800">
              Tracking Ticket: <strong className="text-amber-600 font-bold">{ticketCreated}</strong>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Done & Return to Map
            </button>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Defect Type Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Defect Classification</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pothole', label: 'Pothole' },
                  { id: 'crack', label: 'Fatigue Crack' },
                  { id: 'waterlogging', label: 'Standing Water' },
                  { id: 'cave_in', label: 'Road Cave-In' },
                  { id: 'debris', label: 'Shoulder Debris' },
                  { id: 'accident_hotspot', label: 'Low Friction' },
                ].map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setHazardType(t.id as any)}
                    className={`py-2 px-2.5 rounded-lg border text-center font-medium transition-all ${
                      hazardType === t.id
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Region */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street / Intersection</label>
                <input
                  type="text"
                  required
                  value={roadName}
                  onChange={(e) => setRoadName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. Broadway & 5th"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Downtown Metro">Downtown Metro</option>
                  <option value="Mission Corridor">Mission Corridor</option>
                  <option value="East Bay Express">East Bay Express</option>
                  <option value="Peninsula Corridor">Peninsula Corridor</option>
                  <option value="South Valley">South Valley</option>
                </select>
              </div>
            </div>

            {/* Severity & Depth */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="low">Low (Minor Surface Wear)</option>
                  <option value="moderate">Moderate (Noticeable Bump)</option>
                  <option value="high">High (Tire Impact Hazard)</option>
                  <option value="critical">Critical (Severe Rim/Control Risk)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Depth (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="30"
                  value={depthCm}
                  onChange={(e) => setDepthCm(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Photo Upload Box */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Attach Dashcam / Smartphone Photo</label>
              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200">
                  <img src={photoPreview} alt="Uploaded Defect" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-amber-500 hover:bg-slate-50 transition-colors">
                  <Camera className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="font-semibold text-slate-700">Click to upload photo</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, or HEIC (AI will auto-validate)</span>
                  <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                </label>
              )}
            </div>

            {/* Details Description */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description & Driver Notes</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Neural Analysis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Broadcast Hazard to Road Network</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  ShieldCheck,
  Cpu,
  BookOpen,
  ArrowRight,
  Bot
} from 'lucide-react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  'How does RoadSense AI measure Pavement Health Index (RHI) from dashcams?',
  'What is the difference between Alligator Cracking and Block Cracking in asphalt?',
  'How much does hydroplaning risk increase with 5mm standing water at 60 MPH?',
  'What is the most cost-effective municipal strategy to prevent pothole clusters?'
];

const PRESET_ANSWERS: Record<string, string> = {
  'How does RoadSense AI measure Pavement Health Index (RHI) from dashcams?':
    `**RoadSense AI Road Health Index (RHI) Calculation Methodology:**\n\n1. **Computer Vision Inference**: High-frequency dashcam frames are processed via an edge YOLOv11/ResNet architecture to segment surface distress categories (potholes, transverse fissures, ravelling, longitudinal rutting).\n2. **Dimensional Depth & Area Estimation**: Optical stereo disparities and multi-frame shadow tracking estimate pothole volumetric loss and crater depth (in centimeters).\n3. **International Roughness Index (IRI) Fusion**: Smartphone and in-vehicle accelerometer telemetry (Z-axis G-force vibrations) are combined with visual distress data using an Extended Kalman Filter.\n4. **Final RHI Score (0 - 100)**: \n   - 85–100: Structural integrity nominal (< 1.5 m/km IRI)\n   - 50–84: Moderate surface attrition; crack sealing recommended\n   - < 50: Critical structural failure; immediate cold-pour or milling dispatch.`,

  'What is the difference between Alligator Cracking and Block Cracking in asphalt?':
    `**Structural Distress Diagnosis:**\n\n- **Alligator (Fatigue) Cracking**: Characterized by interconnected multi-sided cracks resembling reptile skin. It is caused by **structural base failure** under repeated heavy traffic wheel loads. Simple surface patches will fail; full-depth reclamation or sub-base stabilization is required.\n\n- **Block Cracking**: Characterized by large rectangular or square crack patterns. It is caused by **thermal shrinkage** of the asphalt binder over seasonal temperature cycles and hardening with age, not traffic load fatigue. It can often be effectively treated with high-durability rubberized asphalt crack sealant.`,

  'How much does hydroplaning risk increase with 5mm standing water at 60 MPH?':
    `**Hydroplaning Dynamics & Stopping Distance Analysis:**\n\n- **Critical Hydroplaning Speed Formula**: $V_p \\approx 10.35 \\sqrt{P_{tire}}$ (where $P_{tire}$ is tire inflation in PSI). For standard 32 PSI passenger tires, dynamic hydroplaning initiates at approximately **58.5 MPH** when water depth exceeds tire tread groove depth (typically 3–4mm).\n- **Friction Coefficient Drop**: Nominal dry asphalt friction ($\\mu \\approx 0.75$) drops precipitously to **$\\mu \\approx 0.15–0.25$** upon hydroplaning.\n- **Stopping Distance**: Standard stopping distance at 60 MPH increases from **45 meters (dry)** to over **130 meters**, nearly tripling. RoadSense AI warns drivers to reduce speed to 40 MPH in affected sectors.`,

  'What is the most cost-effective municipal strategy to prevent pothole clusters?':
    `**Optimal Pavement Preservation Strategy (DOT Best Practices):**\n\n1. **Early Preventative Crack Sealing (ROI: 6:1)**: Sealing micro-fissures before water penetrates the sub-base costs ~$1.50/linear meter, preventing potholes that cost $50–$150/crater to fill later.\n2. **Automated Continuous Surveys**: Utilizing dashcam fleets reduces traditional manual survey inspection costs by 80% while identifying distress 6 months earlier.\n3. **Drainage Prioritization**: 90% of premature pavement failures are caused by trapped water. Clearing catch-basins and restoring road crown slope prevents water ingress.`
};

export const AiSafetyAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Hello, I am the **RoadSense AI Safety & Infrastructure Advisor**. I can assist you with pavement distress diagnostics, stopping distance hydroplane calculations, municipal maintenance prioritization, or route safety analysis. How can I assist you today?',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = PRESET_ANSWERS[query];

      if (!reply) {
        reply = `**RoadSense AI Engineering Analysis for: "${query}"**\n\nBased on road safety data and AASHTO highway pavement design standards:\n\n1. **Pavement Distress Assessment**: Road quality correlates directly with sub-base moisture content and traffic load frequency (ESALs). Monitoring vibrations with accelerometer telemetry allows predicting sub-base subsidence before catastrophic failure.\n2. **Driver Risk Mitigation**: In sectors with verified severe potholes (>5cm depth) or waterlogging, advisory speeds should be reduced to mitigate suspension damage and hydroplaning.\n3. **Municipal Remediation**: Dispatched cold-pour patches should be followed by hot-mix asphalt compaction within 30 days to prevent recurrent cratering.`;
      }

      const assistantMsg: Message = {
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 750);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Advisor Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Road Safety & Pavement Engineer Advisor
            </h2>
            <p className="text-xs text-slate-500">
              Grounded in AASHTO pavement standards, friction telemetry, and computer vision diagnostics.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5 text-amber-600" />
          <span>GEMINI CIVIL-AI</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Suggested Engineering Inquiries
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 text-xs font-medium text-slate-700 transition-colors flex items-start justify-between gap-2 shadow-2xs"
            >
              <span>{q}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat History Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[480px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 border border-amber-400/40 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`block text-[10px] mt-1.5 font-mono ${isUser ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-3 text-xs items-center text-slate-500 font-mono">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <span>Synthesizing civil engineering telemetry...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about pavement deterioration, hydroplane formulas, or repair strategies..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

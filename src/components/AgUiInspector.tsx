import React, { useState } from 'react';
import { 
  Terminal, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Radio, 
  Sliders, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Zap,
  Key,
  Database
} from 'lucide-react';
import { UseAgUiStreamReturn } from '../hooks/useAgUiStream';

interface AgUiInspectorProps {
  stream: UseAgUiStreamReturn;
  isOpen: boolean;
  onToggle: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const AgUiInspector: React.FC<AgUiInspectorProps> = ({
  stream,
  isOpen,
  onToggle,
  apiKey,
  setApiKey
}) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'waterfall' | 'settings'>('stream');
  const [showKeyInput, setShowKeyInput] = useState(false);

  return (
    <>
      {/* Floating Status Pill Button at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full font-mono text-xs font-bold border transition-all duration-300 shadow-xl ${
            stream.isRunning
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20'
              : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 shadow-slate-950/50'
          } backdrop-blur-md`}
        >
          <span className="flex h-2 w-2 relative">
            {stream.isRunning && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                stream.isRunning ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            ></span>
          </span>
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>AG-UI STREAM</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
            {stream.events.length}
          </span>
          {stream.pendingHitl && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] animate-pulse">
              HITL ACTION
            </span>
          )}
        </button>
      </div>

      {/* Slide-over / Modal Inspector Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col font-sans backdrop-blur-2xl">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white font-mono">AG-UI Telemetry Inspector</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Protocol v1.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Agent User Interaction Protocol stream monitor</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Inspector"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Subheader Navigation */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1 font-mono">
              <button
                onClick={() => setActiveTab('stream')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'stream'
                    ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Live Stream
              </button>
              <button
                onClick={() => setActiveTab('waterfall')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'waterfall'
                    ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Event Waterfall ({stream.events.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Settings / Key
              </button>
            </div>

            {stream.isRunning && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                RUNNING
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {activeTab === 'stream' && (
              <>
                {/* Active Step Indicator */}
                {stream.activeStep && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Active Step</div>
                        <div className="text-xs font-bold text-white">{stream.activeStep}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 animate-spin">◌</span>
                  </div>
                )}

                {/* Human-in-the-Loop (HITL) Interactive Gate */}
                {stream.pendingHitl && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <div className="font-bold text-amber-300">Human-in-the-Loop Review Required</div>
                          <div className="text-[11px] text-slate-300 font-sans">{stream.pendingHitl.description}</div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono uppercase">
                        TOOL_CALL_APPROVAL
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto max-h-40">
                      <pre className="font-mono text-emerald-300">
                        {JSON.stringify(stream.pendingHitl.payload, null, 2)}
                      </pre>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => stream.resolveHitl(stream.pendingHitl!.toolCallId, false, 'User declined draft in inspector')}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/60 transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject / Revise
                      </button>
                      <button
                        onClick={() => stream.resolveHitl(stream.pendingHitl!.toolCallId, true, 'User approved draft in inspector')}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve & Publish
                      </button>
                    </div>
                  </div>
                )}

                {/* Reasoning Thought Stream */}
                {stream.currentThought && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>REASONING THOUGHT STREAM</span>
                      </span>
                      <span className="text-[10px] text-purple-400">Gemini 2.5 Flash CoT</span>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-200 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                      {stream.currentThought}
                    </div>
                  </div>
                )}

                {/* Generated Text Message Stream */}
                {stream.streamedText && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-cyan-400" />
                        <span>STREAMED TEXT OUTPUT (TEXT_MESSAGE_CHUNK)</span>
                      </span>
                      <span className="text-[10px] text-cyan-400">assistant</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                      {stream.streamedText}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!stream.isRunning && stream.events.length === 0 && (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div className="text-slate-400">No active AG-UI stream</div>
                    <div className="text-[11px] text-slate-500 font-sans max-w-xs mx-auto">
                      Click any simulator action in PropSocial to witness typed event streaming, reasoning tokens, and tool calls.
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Event Waterfall Tab */}
            {activeTab === 'waterfall' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                  <span>Standardized Event Envelopes</span>
                  <button
                    onClick={stream.clearHistory}
                    className="text-slate-500 hover:text-slate-300 underline text-[10px]"
                  >
                    Clear History
                  </button>
                </div>
                {stream.events.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No events captured yet.</div>
                ) : (
                  stream.events.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          ev.type.startsWith('RUN_') ? 'bg-emerald-500/20 text-emerald-300' :
                          ev.type.startsWith('STEP_') ? 'bg-cyan-500/20 text-cyan-300' :
                          ev.type.startsWith('TOOL_') ? 'bg-amber-500/20 text-amber-300' :
                          ev.type.startsWith('REASONING_') ? 'bg-purple-500/20 text-purple-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {ev.type}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(ev.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <pre className="text-[10px] text-slate-400 overflow-x-auto max-h-24 font-mono">
                        {JSON.stringify(ev, null, 2)}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-sans">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-white text-xs">Live Gemini API Key (Optional)</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    PropSocial AI defaults to high-fidelity agent simulations. Enter your Gemini API key below to switch to live Gemini 2.5 Flash execution.
                  </p>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="text-[10px] text-slate-500">
                    Stored locally in browser session memory. Never sent to any third-party server.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-sans">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-bold text-white text-xs">RESO Web API Configuration</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    OData endpoints are currently bound to the sandbox RESO 2.0 Web API emulator with simulated MLS deltas for Gilbert (85296) and Scottsdale (85251).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

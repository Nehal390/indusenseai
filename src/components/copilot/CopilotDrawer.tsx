import React, { useState, useRef, useEffect } from 'react';
import { ProductItem, CopilotMessage } from '../../types';
import { askCopilot } from '../../services/aiService';
import { voiceAssistant } from '../../services/voiceService';
import { X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Bot, Trash2, ArrowRight, AlertCircle, Play, RefreshCw, HelpCircle, ChevronDown, ChevronUp, Cpu, ShieldAlert, Layers } from 'lucide-react';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  activeDatasetName: string;
  selectedProduct?: ProductItem | null;
  comparedProducts?: ProductItem[];
  onSelectProduct?: (product: ProductItem) => void;
}

interface PromptCategory {
  id: string;
  name: string;
  prompts: string[];
}

const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: 'all',
    name: '🌟 Featured',
    prompts: [
      'Which motors have IE4 efficiency rating?',
      'Identify duplicate bearing clusters in this catalog',
      'Find sensors with IO-Link and IP67 rating',
      'Compare high pressure centrifugal pumps',
      'Which records have missing torque or mounting specs?',
      'Find bearings suitable for >5000 RPM high speed',
    ],
  },
  {
    id: 'motors',
    name: '⚡ Motors & Sizing',
    prompts: [
      'Which motors have IE4 efficiency rating?',
      'Compare Siemens SIMOTICS 5HP with ABB M3BP motor',
      'Find 3-phase induction motors with cast iron frame',
      'What are the voltage and frequency ratings of active motors?',
    ],
  },
  {
    id: 'dedup',
    name: '🛡️ Duplicates & Quality',
    prompts: [
      'Identify duplicate bearing clusters in this catalog',
      'Which records have missing torque or mounting specs?',
      'Summarize duplicate inventory reconciliation savings',
      'Audit data quality and completeness across all categories',
    ],
  },
  {
    id: 'sensors_pumps',
    name: '📡 Sensors & Pumps',
    prompts: [
      'Find sensors with IO-Link and IP67 rating',
      'Which vibration transmitter measures 3-axis velocity?',
      'What is the maximum head pressure of Grundfos pump?',
      'List all double-acting pneumatic actuators ISO 15552',
    ],
  },
  {
    id: 'procurement',
    name: '💰 Sourcing & Standards',
    prompts: [
      'Compare high pressure centrifugal pumps under $3,500',
      'Which products comply with ATEX / IEC standards?',
      'Which supplier has the fastest lead time for bearings?',
      'Recommend the best overall motor based on MTBF and capex',
    ],
  },
];

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  products,
  activeDatasetName,
  selectedProduct,
  comparedProducts,
  onSelectProduct,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello! I am **InduSense Copilot**. I have loaded **${activeDatasetName}** (${products.length} industrial SKUs).\n\nYou can ask me **ANY question** regarding industrial equipment specifications, DIN/ISO standards, duplicate SKU resolution, product sizing, or data health diagnostics.\n\n*(Note: Please keep questions focused on industrial components and catalog engineering!)*`,
      suggestedActions: [
        { label: 'Summarize active dataset', action: 'summarize' },
        { label: 'Audit duplicate clusters', action: 'duplicates' },
        { label: 'Which category needs cleanup?', action: 'cleanup' },
        { label: 'Find IE4 motors', action: 'motors' },
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [selectedCatId, setSelectedCatId] = useState('all');
  const [showPromptHelper, setShowPromptHelper] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Auto-dismiss voice error after 7 seconds
  useEffect(() => {
    if (voiceError) {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setVoiceError(null);
      }, 7000);
    }
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [voiceError]);

  if (!isOpen) return null;

  const currentCategory = PROMPT_CATEGORIES.find(c => c.id === selectedCatId) || PROMPT_CATEGORIES[0];
  const displayedPrompts = currentCategory.prompts;

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isThinking) return;

    setVoiceError(null);
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const reply = await askCopilot(queryText, {
        activeDatasetName,
        productCount: products.length,
        activeProduct: selectedProduct,
        comparedProducts,
      });

      const assistantMsg: CopilotMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: reply,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (autoSpeak) {
        voiceAssistant.speak(reply, () => setVoiceState('idle'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleVoiceInput = async () => {
    setVoiceError(null);
    if (voiceState === 'listening') {
      voiceAssistant.stopListening();
      setVoiceState('idle');
    } else {
      const started = await voiceAssistant.startListening(
        (transcript) => {
          setInput(transcript);
          handleSendMessage(transcript);
        },
        (state) => setVoiceState(state),
        (errMsg) => {
          setVoiceError(errMsg);
          setVoiceState('idle');
        }
      );
      if (!started && !voiceError) {
        setVoiceError('Microphone input is inactive in this window. You can click prompt buttons or type directly.');
      }
    }
  };

  const handlePlayVoice = (text: string) => {
    voiceAssistant.speak(text, () => setVoiceState('idle'));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[500px] h-[680px] max-h-[90vh] flex flex-col rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden font-mono animate-slide-up">
      
      {/* Top Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-100 flex items-center gap-2">
              <span>INDUSENSE COPILOT</span>
              <span className={`w-2 h-2 rounded-full ${voiceState === 'listening' ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
            </div>
            <div className="text-[10px] text-zinc-400 font-sans truncate max-w-[200px]">
              Context: {activeDatasetName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* TTS Mute Toggle */}
          <button
            onClick={() => {
              if (autoSpeak) voiceAssistant.cancelSpeech();
              setAutoSpeak(!autoSpeak);
            }}
            className={`p-2 rounded-lg border transition ${
              autoSpeak
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title={autoSpeak ? 'Voice Audio Output Enabled' : 'Voice Audio Output Muted'}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clear chat */}
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
            title="Close Copilot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
        
        {/* Dynamic & Multi-Category Prompt Ideas Bar */}
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SAMPLE PROMPT SHORTCUTS</span>
            </div>
            <button
              onClick={() => setShowPromptHelper(!showPromptHelper)}
              className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-0.5 transition"
            >
              <span>{showPromptHelper ? 'Hide' : 'Show Ideas'}</span>
              {showPromptHelper ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showPromptHelper && (
            <>
              {/* Category tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {PROMPT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap border transition ${
                      selectedCatId === cat.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Prompts list */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {displayedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 hover:border-cyan-400 text-zinc-300 hover:text-cyan-300 transition flex items-center gap-1 text-left"
                  >
                    <Play className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-zinc-500 font-sans italic pt-0.5 border-t border-zinc-900">
                Tip: You can ask or speak <strong>ANY custom question</strong> using the input box or microphone below.
              </div>
            </>
          )}
        </div>

        {messages.map((msg) => {
          const isOutOfScope = msg.text.includes('Out of Scope Query') || msg.text.includes('⚠️');

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500 text-zinc-950 font-medium'
                    : isOutOfScope
                    ? 'bg-zinc-950 border border-amber-500/40 text-zinc-200 shadow-inner'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-200 shadow-inner'
                }`}
              >
                {msg.text}

                {msg.sender === 'assistant' && (
                  <div className="pt-2 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                    <button
                      onClick={() => handlePlayVoice(msg.text)}
                      className="flex items-center gap-1 text-cyan-400 hover:underline"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Play Audio</span>
                    </button>
                    <span>{msg.timestamp}</span>
                  </div>
                )}
              </div>

              {/* Suggested actions chips */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-1">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(action.label)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-cyan-400 text-cyan-300 transition"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono p-2">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Analyzing engineering parameters...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Non-intrusive Voice Error or Info Banner */}
      {voiceError && (
        <div className="px-3.5 py-2 bg-amber-950/70 border-t border-amber-800/80 flex items-center justify-between text-[11px] text-amber-200 font-sans gap-2 animate-fade-in">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">{voiceError}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleVoiceInput}
              className="text-cyan-400 hover:text-cyan-300 text-[10px] font-mono font-bold uppercase underline"
            >
              Retry Mic
            </button>
            <button
              onClick={() => setVoiceError(null)}
              className="text-zinc-400 hover:text-zinc-200 text-[10px]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Active Voice Waveform Activity Banner */}
      {voiceState === 'listening' && (
        <div className="px-4 py-2.5 bg-rose-950/80 border-t border-rose-800 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-rose-400 animate-pulse" />
              <span className="w-1 h-5 bg-rose-400 animate-pulse" style={{ animationDelay: '0.15s' }} />
              <span className="w-1 h-2 bg-rose-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 h-4 bg-rose-400 animate-pulse" style={{ animationDelay: '0.45s' }} />
            </div>
            <span>Listening to microphone... Speak now</span>
          </div>
          <button onClick={toggleVoiceInput} className="text-rose-300 font-bold px-2 py-0.5 rounded bg-rose-900 text-[10px]">
            Done
          </button>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] text-zinc-500 px-1">
          <span>Ask ANY question (specs, DIN/ISO, duplicates, sizing, procurement)</span>
          <span className="text-cyan-400/80">Voice / Text Enabled</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition ${
              voiceState === 'listening'
                ? 'bg-rose-500 border-rose-400 text-zinc-950 animate-pulse'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-cyan-300'
            }`}
            title="Click to speak through microphone"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Ask Copilot anything about industrial components or active catalog..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none transition"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isThinking}
            className="p-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

import { useState, useCallback, useRef } from 'react';
import { AgUiEngine, RunAgentOptions } from '../services/agUiEngine';
import { AgUiEvent, HitlPendingApproval } from '../types/agUi';

export interface UseAgUiStreamReturn {
  events: AgUiEvent[];
  isRunning: boolean;
  currentThought: string;
  activeStep: string | null;
  pendingHitl: HitlPendingApproval | null;
  streamedText: string;
  runAgent: (prompt: string, agentId?: RunAgentOptions['agentId'], apiKey?: string) => Promise<void>;
  resolveHitl: (toolCallId: string, approved: boolean, notes?: string) => void;
  clearHistory: () => void;
}

export function useAgUiStream(): UseAgUiStreamReturn {
  const [events, setEvents] = useState<AgUiEvent[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentThought, setCurrentThought] = useState<string>('');
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [pendingHitl, setPendingHitl] = useState<HitlPendingApproval | null>(null);
  const [streamedText, setStreamedText] = useState<string>('');

  // Promise resolver for interactive HITL
  const hitlResolverRef = useRef<((result: Record<string, unknown>) => void) | null>(null);

  const handleEvent = useCallback((event: AgUiEvent) => {
    setEvents((prev) => [...prev, event]);

    switch (event.type) {
      case 'RUN_STARTED':
        setIsRunning(true);
        setCurrentThought('');
        setStreamedText('');
        setActiveStep('Initializing Agent Run');
        break;

      case 'STEP_STARTED':
        setActiveStep(event.stepName);
        break;

      case 'STEP_FINISHED':
        break;

      case 'REASONING_MESSAGE_CHUNK':
        setCurrentThought((prev) => prev + event.delta);
        break;

      case 'TEXT_MESSAGE_CHUNK':
        setStreamedText((prev) => prev + event.delta);
        break;

      case 'TEXT_MESSAGE_END':
        setStreamedText(event.content);
        break;

      case 'RUN_FINISHED':
      case 'RUN_ERROR':
        setIsRunning(false);
        setActiveStep(null);
        setPendingHitl(null);
        break;
    }
  }, []);

  const runAgent = useCallback(
    async (prompt: string, agentId?: RunAgentOptions['agentId'], apiKey?: string) => {
      // Cleanly resolve any stranded HITL from previous runs
      if (hitlResolverRef.current) {
        try {
          hitlResolverRef.current({ approved: false, superseded: true });
        } catch {}
        hitlResolverRef.current = null;
      }

      setIsRunning(true);
      setEvents([]);
      setCurrentThought('');
      setStreamedText('');
      setPendingHitl(null);

      await AgUiEngine.runAgent({
        prompt,
        agentId: agentId || 'pocket-dealfinder',
        apiKey,
        onEvent: handleEvent,
        onHitlRequired: (pending: HitlPendingApproval) => {
          setPendingHitl(pending);
          return new Promise<Record<string, unknown>>((resolve) => {
            hitlResolverRef.current = resolve;
          });
        }
      });
    },
    [handleEvent]
  );

  const resolveHitl = useCallback(
    (toolCallId: string, approved: boolean, notes?: string) => {
      if (hitlResolverRef.current && pendingHitl?.toolCallId === toolCallId) {
        const result = {
          approved,
          userDecidedAt: Date.now(),
          notes: notes || (approved ? 'User approved via AG-UI modal' : 'User declined via AG-UI modal')
        };
        hitlResolverRef.current(result);
        hitlResolverRef.current = null;
        setPendingHitl(null);
      }
    },
    [pendingHitl]
  );

  const clearHistory = useCallback(() => {
    setEvents([]);
    setCurrentThought('');
    setStreamedText('');
    setPendingHitl(null);
    setActiveStep(null);
  }, []);

  return {
    events,
    isRunning,
    currentThought,
    activeStep,
    pendingHitl,
    streamedText,
    runAgent,
    resolveHitl,
    clearHistory
  };
}

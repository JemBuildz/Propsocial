/**
 * AG-UI (Agent User Interaction Protocol) Standard Type Definitions
 * Specification: https://docs.ag-ui.com
 */

export type AgUiEventType =
  | 'RUN_STARTED'
  | 'RUN_FINISHED'
  | 'RUN_ERROR'
  | 'STEP_STARTED'
  | 'STEP_FINISHED'
  | 'TEXT_MESSAGE_START'
  | 'TEXT_MESSAGE_CHUNK'
  | 'TEXT_MESSAGE_END'
  | 'TOOL_CALL_START'
  | 'TOOL_CALL_ARGS'
  | 'TOOL_CALL_END'
  | 'TOOL_CALL_RESULT'
  | 'REASONING_START'
  | 'REASONING_MESSAGE_START'
  | 'REASONING_MESSAGE_CHUNK'
  | 'REASONING_MESSAGE_END'
  | 'REASONING_END'
  | 'STATE_SNAPSHOT'
  | 'STATE_DELTA';

export interface BaseAgUiEvent {
  type: AgUiEventType;
  timestamp: number;
  runId: string;
  metadata?: Record<string, unknown>;
}

export interface RunStartedEvent extends BaseAgUiEvent {
  type: 'RUN_STARTED';
  agentId: string;
  input: {
    prompt: string;
    context?: Record<string, unknown>;
  };
}

export interface RunFinishedEvent extends BaseAgUiEvent {
  type: 'RUN_FINISHED';
  metadata?: {
    totalTokens?: number;
    latencyMs?: number;
    finishReason?: string;
  };
}

export interface RunErrorEvent extends BaseAgUiEvent {
  type: 'RUN_ERROR';
  error: {
    code: string;
    message: string;
  };
}

export interface StepStartedEvent extends BaseAgUiEvent {
  type: 'STEP_STARTED';
  stepId: string;
  stepName: string;
}

export interface StepFinishedEvent extends BaseAgUiEvent {
  type: 'STEP_FINISHED';
  stepId: string;
  durationMs?: number;
}

export interface TextMessageStartEvent extends BaseAgUiEvent {
  type: 'TEXT_MESSAGE_START';
  messageId: string;
  role: 'assistant' | 'user' | 'system';
}

export interface TextMessageChunkEvent extends BaseAgUiEvent {
  type: 'TEXT_MESSAGE_CHUNK';
  messageId: string;
  delta: string;
}

export interface TextMessageEndEvent extends BaseAgUiEvent {
  type: 'TEXT_MESSAGE_END';
  messageId: string;
  content: string;
}

export interface ToolCallStartEvent extends BaseAgUiEvent {
  type: 'TOOL_CALL_START';
  toolCallId: string;
  toolName: string;
  clientSide?: boolean;
  requiresApproval?: boolean;
}

export interface ToolCallArgsEvent extends BaseAgUiEvent {
  type: 'TOOL_CALL_ARGS';
  toolCallId: string;
  delta: string;
}

export interface ToolCallEndEvent extends BaseAgUiEvent {
  type: 'TOOL_CALL_END';
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
}

export interface ToolCallResultEvent extends BaseAgUiEvent {
  type: 'TOOL_CALL_RESULT';
  toolCallId: string;
  result: Record<string, unknown>;
}

export interface ReasoningStartEvent extends BaseAgUiEvent {
  type: 'REASONING_START';
  phase?: string;
}

export interface ReasoningMessageChunkEvent extends BaseAgUiEvent {
  type: 'REASONING_MESSAGE_CHUNK';
  delta: string;
}

export interface ReasoningEndEvent extends BaseAgUiEvent {
  type: 'REASONING_END';
  summary?: string;
}

export interface StateDeltaEvent extends BaseAgUiEvent {
  type: 'STATE_DELTA';
  patches: Array<{
    op: 'add' | 'remove' | 'replace';
    path: string;
    value?: unknown;
  }>;
}

export type AgUiEvent =
  | RunStartedEvent
  | RunFinishedEvent
  | RunErrorEvent
  | StepStartedEvent
  | StepFinishedEvent
  | TextMessageStartEvent
  | TextMessageChunkEvent
  | TextMessageEndEvent
  | ToolCallStartEvent
  | ToolCallArgsEvent
  | ToolCallEndEvent
  | ToolCallResultEvent
  | ReasoningStartEvent
  | ReasoningMessageChunkEvent
  | ReasoningEndEvent
  | StateDeltaEvent;

/**
 * Human-in-the-Loop (HITL) request pending user review
 */
export interface HitlPendingApproval {
  toolCallId: string;
  toolName: string;
  description: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

import { GoogleGenAI } from '@google/genai';
import { AgUiEvent, HitlPendingApproval } from '../types/agUi';

export interface RunAgentOptions {
  prompt: string;
  agentId?: 'pocket-dealfinder' | 'mls-dispatcher' | 'campaign-marketer' | 'showing-coordinator' | 'reso-poller';
  apiKey?: string;
  customContext?: Record<string, unknown>;
  onEvent: (event: AgUiEvent) => void;
  onHitlRequired?: (pending: HitlPendingApproval) => Promise<Record<string, unknown>>;
}

export class AgUiEngine {
  /**
   * Run an autonomous agent execution with full AG-UI event streaming
   */
  public static async runAgent(options: RunAgentOptions): Promise<void> {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const agentId = options.agentId || 'pocket-dealfinder';
    const timestamp = Date.now();

    // 1. RUN_STARTED
    options.onEvent({
      type: 'RUN_STARTED',
      runId,
      agentId,
      input: {
        prompt: options.prompt,
        context: options.customContext
      },
      timestamp: Date.now()
    });

    // Check if live Gemini API key is supplied
    const effectiveApiKey = options.apiKey || (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_GEMINI_API_KEY : undefined);

    if (effectiveApiKey && effectiveApiKey !== 'MY_GEMINI_API_KEY') {
      await this.runLiveGeminiAgent(runId, agentId, options.prompt, effectiveApiKey, options);
    } else {
      await this.runHighFidelityWorkflow(runId, agentId, options.prompt, options);
    }
  }

  /**
   * High-fidelity deterministic AG-UI simulation with realistic agent reasoning,
   * tool execution, and client-side HITL approval.
   */
  private static async runHighFidelityWorkflow(
    runId: string,
    agentId: string,
    prompt: string,
    options: RunAgentOptions
  ): Promise<void> {
    const startTime = Date.now();

    // Step 1: Acoustic & Intent Extraction
    const step1Id = `step_${Date.now()}_1`;
    options.onEvent({
      type: 'STEP_STARTED',
      runId,
      stepId: step1Id,
      stepName: 'Extract Real Estate Intent & Neighborhood Geolocation',
      timestamp: Date.now()
    });

    options.onEvent({ type: 'REASONING_START', runId, phase: 'Intent Parsing', timestamp: Date.now() });

    const thoughts = [
      'Parsing voice memo transcript for geo-anchors, property styles, and price thresholds...\n',
      'Detected local neighborhood references. Cross-referencing active MLS municipal boundaries...\n',
      'Extracted buyer profile: Move-up families seeking non-HOA lots with RV parking.\n',
      'Configuring viral DM lead-magnet trigger keyword: "LIST".'
    ];

    for (const chunk of thoughts) {
      await this.sleep(120);
      options.onEvent({
        type: 'REASONING_MESSAGE_CHUNK',
        runId,
        delta: chunk,
        timestamp: Date.now()
      });
    }

    options.onEvent({
      type: 'REASONING_END',
      runId,
      summary: 'Voice transcription converted into verified structured property criteria.',
      timestamp: Date.now()
    });

    options.onEvent({
      type: 'STEP_FINISHED',
      runId,
      stepId: step1Id,
      durationMs: 480,
      timestamp: Date.now()
    });

    // Step 2: Tool Execution (RESO MLS Query)
    const step2Id = `step_${Date.now()}_2`;
    const toolCall1Id = `call_${Date.now()}_reso`;

    options.onEvent({
      type: 'STEP_STARTED',
      runId,
      stepId: step2Id,
      stepName: 'Query RESO Web API MLS Records',
      timestamp: Date.now()
    });

    options.onEvent({
      type: 'TOOL_CALL_START',
      runId,
      toolCallId: toolCall1Id,
      toolName: 'query_reso_mls_records',
      clientSide: false,
      timestamp: Date.now()
    });

    const toolArgs = JSON.stringify({
      criteria: 'Bungalow / Single Story',
      hoaFeeMax: 0,
      priceMax: 560000,
      features: ['RV Gate', 'Diving Pool']
    });

    options.onEvent({
      type: 'TOOL_CALL_ARGS',
      runId,
      toolCallId: toolCall1Id,
      delta: toolArgs,
      timestamp: Date.now()
    });

    options.onEvent({
      type: 'TOOL_CALL_END',
      runId,
      toolCallId: toolCall1Id,
      toolName: 'query_reso_mls_records',
      args: JSON.parse(toolArgs),
      timestamp: Date.now()
    });

    await this.sleep(300);

    options.onEvent({
      type: 'TOOL_CALL_RESULT',
      runId,
      toolCallId: toolCall1Id,
      result: {
        matchesFound: 3,
        listings: [
          { address: '124 N Gilbert Rd', listPrice: 535000, hoa: '$0', pool: true },
          { address: '318 W Cullumber Ave', listPrice: 549000, hoa: '$0', pool: true },
          { address: '702 E Page Ave', listPrice: 529900, hoa: '$0', pool: false }
        ],
        mlsStatus: 'Active'
      },
      timestamp: Date.now()
    });

    options.onEvent({
      type: 'STEP_FINISHED',
      runId,
      stepId: step2Id,
      durationMs: 350,
      timestamp: Date.now()
    });

    // Step 3: Human-in-the-Loop (HITL) Post Approval
    const step3Id = `step_${Date.now()}_3`;
    const toolCall2Id = `call_${Date.now()}_hitl`;

    options.onEvent({
      type: 'STEP_STARTED',
      runId,
      stepId: step3Id,
      stepName: 'Human-in-the-Loop Post Approval Gate',
      timestamp: Date.now()
    });

    const pendingPostPayload = {
      headline: '3 Rare Non-HOA Homes Under $550k Near Downtown',
      triggerKeyword: 'LIST',
      channels: ['Instagram', 'Facebook', 'LinkedIn'],
      dmHookText: '👇 Comment "LIST" below and my digital assistant will DM you the private photo gallery!'
    };

    options.onEvent({
      type: 'TOOL_CALL_START',
      runId,
      toolCallId: toolCall2Id,
      toolName: 'request_agent_approval',
      clientSide: true,
      requiresApproval: true,
      timestamp: Date.now()
    });

    options.onEvent({
      type: 'TOOL_CALL_END',
      runId,
      toolCallId: toolCall2Id,
      toolName: 'request_agent_approval',
      args: pendingPostPayload,
      timestamp: Date.now()
    });

    // Invoke HITL resolver if provided
    let approvalResult: Record<string, unknown> = { approved: true, autoApproved: true };
    if (options.onHitlRequired) {
      approvalResult = await options.onHitlRequired({
        toolCallId: toolCall2Id,
        toolName: 'request_agent_approval',
        description: 'Verify marketing copy and trigger keywords before publishing to social channels.',
        payload: pendingPostPayload,
        timestamp: Date.now()
      });
    }

    options.onEvent({
      type: 'TOOL_CALL_RESULT',
      runId,
      toolCallId: toolCall2Id,
      result: approvalResult,
      timestamp: Date.now()
    });

    options.onEvent({
      type: 'STEP_FINISHED',
      runId,
      stepId: step3Id,
      durationMs: 250,
      timestamp: Date.now()
    });

    // Step 4: Text Message Streaming (Final Content)
    const messageId = `msg_${Date.now()}`;
    options.onEvent({
      type: 'TEXT_MESSAGE_START',
      runId,
      messageId,
      role: 'assistant',
      timestamp: Date.now()
    });

    const finalDraft = `That morning iced latte hits different when you're touring houses with actual backyard space and ZERO HOA fees. ☕🏡\n\nEveryone thinks you need $750k+ to get within 5 minutes of the Downtown Heritage District, but I just spotted 3 renovated brick homes tucked right in this pocket—all under $550k with diving pools and RV gates.\n\n👇 Comment "LIST" below and my digital assistant will DM you the private addresses and photos before the weekend open house rush!`;

    const words = finalDraft.split(' ');
    for (const word of words) {
      await this.sleep(25);
      options.onEvent({
        type: 'TEXT_MESSAGE_CHUNK',
        runId,
        messageId,
        delta: word + ' ',
        timestamp: Date.now()
      });
    }

    options.onEvent({
      type: 'TEXT_MESSAGE_END',
      runId,
      messageId,
      content: finalDraft,
      timestamp: Date.now()
    });

    // Step 5: State Delta (Synchronize with UI)
    options.onEvent({
      type: 'STATE_DELTA',
      runId,
      patches: [
        { op: 'replace', path: '/marketing/activeCampaign', value: 'gilbert-non-hoa-under-550k' },
        { op: 'replace', path: '/telemetry/launchVelocitySeconds', value: 3.4 },
        { op: 'add', path: '/queue/scheduledPosts/0', value: { platform: 'Instagram', status: 'READY_TO_PUBLISH' } }
      ],
      timestamp: Date.now()
    });

    // 6. RUN_FINISHED
    options.onEvent({
      type: 'RUN_FINISHED',
      runId,
      metadata: {
        totalTokens: 382,
        latencyMs: Date.now() - startTime,
        finishReason: 'stop'
      },
      timestamp: Date.now()
    });
  }

  /**
   * Run live model via @google/genai SDK when API key is configured
   */
  private static async runLiveGeminiAgent(
    runId: string,
    agentId: string,
    prompt: string,
    apiKey: string,
    options: RunAgentOptions
  ): Promise<void> {
    const startTime = Date.now();
    try {
      const ai = new GoogleGenAI({ apiKey });

      const stepId = `step_${Date.now()}`;
      options.onEvent({
        type: 'STEP_STARTED',
        runId,
        stepId,
        stepName: 'Gemini 2.5 Flash Real Estate Reasoning',
        timestamp: Date.now()
      });

      const messageId = `msg_${Date.now()}`;
      options.onEvent({
        type: 'TEXT_MESSAGE_START',
        runId,
        messageId,
        role: 'assistant',
        timestamp: Date.now()
      });

      const systemInstruction = `You are PropSocial AI, an autonomous real estate marketing agent.
Convert real estate prompts and audio memos into high-converting, local social media copy with a viral DM trigger keyword.
Always conclude with a clear call to action asking readers to comment a specific keyword (e.g. "LIST", "VIEW", "DEAL") to receive MLS details in DM.`;

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      let fullContent = '';
      for await (const chunk of responseStream) {
        const text = chunk.text || '';
        if (text) {
          fullContent += text;
          options.onEvent({
            type: 'TEXT_MESSAGE_CHUNK',
            runId,
            messageId,
            delta: text,
            timestamp: Date.now()
          });
        }
      }

      options.onEvent({
        type: 'TEXT_MESSAGE_END',
        runId,
        messageId,
        content: fullContent,
        timestamp: Date.now()
      });

      options.onEvent({
        type: 'STEP_FINISHED',
        runId,
        stepId,
        durationMs: Date.now() - startTime,
        timestamp: Date.now()
      });

      options.onEvent({
        type: 'RUN_FINISHED',
        runId,
        metadata: {
          latencyMs: Date.now() - startTime,
          finishReason: 'stop'
        },
        timestamp: Date.now()
      });
    } catch (err: any) {
      options.onEvent({
        type: 'RUN_ERROR',
        runId,
        error: {
          code: 'GEMINI_INFERENCE_ERROR',
          message: err?.message || 'Failed to generate content with Gemini API'
        },
        timestamp: Date.now()
      });
    }
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

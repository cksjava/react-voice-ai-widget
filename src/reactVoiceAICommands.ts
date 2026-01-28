export type AgentCommandMessage =
  | { command: "navigate"; data: string }
  | { command: string; data?: unknown };

export function parseAgentCommandMessage(raw: string): AgentCommandMessage | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const command = (parsed as any).command;
    const data = (parsed as any).data;
    if (typeof command !== "string") return null;
    return { command, data } as AgentCommandMessage;
  } catch {
    return null;
  }
}


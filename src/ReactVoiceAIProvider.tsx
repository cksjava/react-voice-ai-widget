import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { LiveKitRoom, RoomAudioRenderer, useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import {
  ReactVoiceAIConnectParams,
  ReactVoiceAIProviderContext,
  useReactVoiceAI,
  useReactVoiceAINavigatorState,
} from "./ReactVoiceAIContext";
import { parseAgentCommandMessage } from "./reactVoiceAICommands";
import { ParticipantAttributesSetter } from "./ParticipantAttributesSetter";

export type ReactVoiceAIProviderProps = ReactVoiceAIConnectParams & {
  connect?: boolean;
  children?: React.ReactNode;
  className?: string;
  /** Defaults to "agent_commands". */
  commandsTopic?: string;
};

function ReactVoiceAICommandsSubscriber({ topic }: { topic: string }) {
  const room = useRoomContext();
  const { navigator } = useReactVoiceAI();

  // NOTE: this component is rendered inside LiveKitRoom, so it is inside room context.
  useEffect(() => {
    if (!room) return;
    const decoder = new TextDecoder();

    const handler = (payload: Uint8Array, _participant: any, _kind: any, receivedTopic?: string) => {
      if (receivedTopic !== topic) return;
      const raw = decoder.decode(payload);
      const msg = parseAgentCommandMessage(raw);
      if (!msg) return;

      if (msg.command === "navigate" && typeof msg.data === "string") {
        navigator?.(msg.data);
      }
    };

    room.on(RoomEvent.DataReceived, handler);
    return () => {
      room.off(RoomEvent.DataReceived, handler);
    };
  }, [room, topic, navigator]);

  return null;
}

export function ReactVoiceAIProvider({
  serverUrl,
  livekitUrl,
  clientToken,
  agentId,
  sessionId,
  connect = false,
  children,
  className,
  commandsTopic = "agent_commands",
  uiAccessToken,
}: ReactVoiceAIProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [requestedConnect, setRequestedConnect] = useState(connect);

  const paramsRef = useRef<ReactVoiceAIConnectParams>({
    serverUrl,
    livekitUrl,
    clientToken,
    agentId,
    sessionId,
    uiAccessToken,
  });

  // Keep latest params available for imperative connect().
  useEffect(() => {
    paramsRef.current = { serverUrl, livekitUrl, clientToken, agentId, sessionId, uiAccessToken };
  }, [serverUrl, livekitUrl, clientToken, agentId, sessionId, uiAccessToken]);

  // Prop-driven connect (optional).
  useEffect(() => {
    if (connect) setRequestedConnect(true);
  }, [connect]);

  const { navigator, setNavigator } = useReactVoiceAINavigatorState();

  const fetchToken = useCallback(async (p: ReactVoiceAIConnectParams) => {
    setIsConnecting(true);
    try {
      const body: Record<string, string> = { agentId: p.agentId, sessionId: p.sessionId };
      if (p.uiAccessToken != null && p.uiAccessToken !== "") {
        body.uiAccessToken = p.uiAccessToken;
      }
      const response = await axios.post(p.serverUrl, body, {
        headers: { Authorization: `Bearer ${p.clientToken}` },
      });
      setToken(response.data.token);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectFn = useCallback(
    (override?: Partial<ReactVoiceAIConnectParams>) => {
      setRequestedConnect(true);
      const p = { ...paramsRef.current, ...(override ?? {}) };
      fetchToken(p);
    },
    [fetchToken]
  );

  const disconnectFn = useCallback(() => {
    setRequestedConnect(false);
    setToken(null);
  }, []);

  // If connect was requested and we don't yet have a token, fetch it once.
  useEffect(() => {
    if (!requestedConnect) return;
    if (token) return;
    fetchToken(paramsRef.current);
  }, [requestedConnect, token, fetchToken]);

  const ctxValue = useMemo(
    () => ({
      connect: connectFn,
      disconnect: disconnectFn,
      isConnecting,
      isConnected: Boolean(token) && requestedConnect,
      setNavigator,
      navigator,
    }),
    [connectFn, disconnectFn, isConnecting, navigator, requestedConnect, setNavigator, token]
  );

  return (
    <div className={className}>
      <ReactVoiceAIProviderContext value={ctxValue}>
        {token ? (
          <LiveKitRoom serverUrl={livekitUrl} token={token} connect={requestedConnect} audio>
            <RoomAudioRenderer />
            <ReactVoiceAICommandsSubscriber topic={commandsTopic} />
            {uiAccessToken != null && uiAccessToken !== "" ? (
              <ParticipantAttributesSetter attributes={{ uiAccessToken }} />
            ) : null}
            {children}
          </LiveKitRoom>
        ) : (
          children ?? null
        )}
      </ReactVoiceAIProviderContext>
    </div>
  );
}


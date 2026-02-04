import React, { useEffect, useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import axios from "axios";
import { ParticipantAttributesSetter } from "./ParticipantAttributesSetter";

export type ReactVoiceAIWidgetProps = {
  serverUrl: string;
  livekitUrl: string;
  clientToken: string;
  agentId: string;
  sessionId: string;
  /** Optional. Sent to backend when fetching token and set as participant attribute for the agent. */
  uiAccessToken?: string;
  connect?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export function ReactVoiceAIWidget({
  serverUrl,
  livekitUrl,
  connect = true,
  clientToken,
  agentId,
  sessionId,
  uiAccessToken,
  children,
  className,
}: ReactVoiceAIWidgetProps) {
  const [token, setToken] = useState<string | null>(null);

  const getToken = async () => {
    const response = await axios.post(
      serverUrl,
      { agentId, sessionId },
      { headers: { Authorization: `Bearer ${clientToken}` } }
    );
    setToken(response.data.token);
  }

  useEffect(() => {
    if (connect) getToken();
  }, [connect]);

  return (
    <div className={className}>
      {token && (
        <LiveKitRoom serverUrl={livekitUrl} token={token} connect audio>
          <RoomAudioRenderer />
          {uiAccessToken != null && uiAccessToken !== "" ? (
            <ParticipantAttributesSetter attributes={{ uiAccessToken }} />
          ) : null}
          {children}
        </LiveKitRoom>
      )}
    </div>
  );
}

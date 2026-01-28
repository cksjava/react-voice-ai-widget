import React, { useEffect, useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import axios from "axios";

export type ReactVoiceAIWidgetProps = {
  serverUrl: string;
  livekitUrl: string;
  clientToken: string;
  agentId: string;
  sessionId: string;
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
  children,
  className,
}: ReactVoiceAIWidgetProps) {
  const [token, setToken] = useState<string | null>(null);

  const getToken = async () => {
    let response = await axios.post(serverUrl, {
      "agentId": agentId,
      "sessionId": sessionId
    }, {
      headers: {
        Authorization: `Bearer ${clientToken}`
      }
    });
    setToken(response.data.token);
  }

  useEffect(() => {
    if (connect) getToken();
  }, [connect]);

  return (
    <div className={className}>
      {token && <LiveKitRoom serverUrl={livekitUrl} token={token} connect audio>
        <RoomAudioRenderer />
        {children}
      </LiveKitRoom>}
    </div>
  );
}

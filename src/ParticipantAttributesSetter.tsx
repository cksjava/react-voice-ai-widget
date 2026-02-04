import React, { useEffect } from "react";
import { useRoomContext } from "@livekit/components-react";

/**
 * Sets attributes on the local participant (e.g. uiAccessToken for the agent).
 * Must be rendered inside LiveKitRoom. Requires canUpdateOwnMetadata in the token
 * if the backend did not set these attributes in the JWT.
 */
export function ParticipantAttributesSetter({
  attributes,
}: {
  attributes: Record<string, string>;
}) {
  const room = useRoomContext();

  const attrsKey = JSON.stringify(attributes);
  useEffect(() => {
    if (!room?.localParticipant || Object.keys(attributes).length === 0) return;
    room.localParticipant.setAttributes(attributes);
  }, [room, attrsKey]);

  return null;
}

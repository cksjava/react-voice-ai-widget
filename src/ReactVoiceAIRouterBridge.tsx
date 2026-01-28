import React, { useEffect } from "react";
import { useReactVoiceAI } from "./ReactVoiceAIContext";

export type ReactVoiceAIRouterBridgeProps = {
  /**
   * Pass `useNavigate()` from react-router (or any compatible navigator).
   * This keeps this package free of a hard `react-router-dom` dependency.
   */
  navigate: (to: string, options?: { replace?: boolean }) => void;
  /**
   * Optional transform for URLs coming from the agent.
   * Useful if the agent sends absolute URLs and you only want the path.
   */
  normalizeUrl?: (url: string) => string;
  /**
   * When true, uses replace navigation instead of push.
   */
  replace?: boolean;
};

/**
 * Render this ONCE inside your React Router tree (or any component that has access
 * to a navigation function like `useNavigate()`).
 *
 * It wires agent "navigate" commands -> UI navigation.
 */
export function ReactVoiceAIRouterBridge({
  navigate,
  normalizeUrl,
  replace = false,
}: ReactVoiceAIRouterBridgeProps) {
  const { setNavigator } = useReactVoiceAI();

  useEffect(() => {
    setNavigator((to) => {
      const finalTo = normalizeUrl ? normalizeUrl(to) : to;
      navigate(finalTo, { replace });
    });
    return () => setNavigator(null);
  }, [navigate, normalizeUrl, replace, setNavigator]);

  return null;
}


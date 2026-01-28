import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ReactVoiceAIConnectParams = {
  serverUrl: string;
  livekitUrl: string;
  clientToken: string;
  agentId: string;
  sessionId: string;
};

export type ReactVoiceAINavigator = (to: string) => void;

export type ReactVoiceAIContextValue = {
  connect: (override?: Partial<ReactVoiceAIConnectParams>) => void;
  disconnect: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  setNavigator: (navigator: ReactVoiceAINavigator | null) => void;
  navigator: ReactVoiceAINavigator | null;
};

const ReactVoiceAIContext = createContext<ReactVoiceAIContextValue | null>(null);

export function ReactVoiceAIProviderContext({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ReactVoiceAIContextValue;
}) {
  return <ReactVoiceAIContext.Provider value={value}>{children}</ReactVoiceAIContext.Provider>;
}

export function useReactVoiceAI(): ReactVoiceAIContextValue {
  const ctx = useContext(ReactVoiceAIContext);
  if (!ctx) {
    throw new Error(
      "useReactVoiceAI must be used within <ReactVoiceAIProvider>. " +
        "If you only render <ReactVoiceAIWidget />, this hook won't be available."
    );
  }
  return ctx;
}

export function useReactVoiceAINavigatorState() {
  const [navigator, setNavigator] = useState<ReactVoiceAINavigator | null>(null);

  const setNavigatorStable = useCallback((next: ReactVoiceAINavigator | null) => {
    setNavigator(() => next);
  }, []);

  const value = useMemo(
    () => ({
      navigator,
      setNavigator: setNavigatorStable,
    }),
    [navigator, setNavigatorStable]
  );

  return value;
}


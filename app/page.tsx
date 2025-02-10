"use client";

import { useEffect, useRef, useState } from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { RTVIClient } from "realtime-ai";
import { DailyTransport } from "realtime-ai-daily";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";

import App from "@/components/App";
import { CharacterProvider } from "@/components/context";
import Splash from "@/components/Splash";
import {
  BOT_READY_TIMEOUT,
  defaultServices,
  getDefaultConfig,
} from "@/rtvi.config";
import { useUser } from "@/components/providers/user";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<RTVIClient | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!showSplash || !user || voiceClientRef.current) {
      return;
    }

    const voiceClient = new RTVIClient({
      transport: new DailyTransport(),
      services: defaultServices,
      timeout: BOT_READY_TIMEOUT,
      enableCam: true,
      enableMic: true,
      params: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "/api",
        endpoints: {
          connect: "/connect",
          action: "/actions",
        },
        requestData: {
          services: defaultServices,
        },
        config: getDefaultConfig(user),
      }
    });

    voiceClientRef.current = voiceClient;
  }, [showSplash, user]);

  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }

  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <CharacterProvider>
        <TooltipProvider>
          <main>
            <div id="app">
              <App />
            </div>
          </main>
          <aside id="tray" />
        </TooltipProvider>
      </CharacterProvider>
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}

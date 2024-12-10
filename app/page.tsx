"use client";

import { useEffect, useRef, useState } from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { LLMHelper, RTVIClient } from "realtime-ai";
import { DailyTransport } from "realtime-ai-daily";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";

import App from "@/components/App";
import { CharacterProvider } from "@/components/context";
import Header from "@/components/Header";
import Splash from "@/components/Splash";
import {
  BOT_READY_TIMEOUT,
  defaultConfig,
  defaultServices,
} from "@/rtvi.config";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<RTVIClient | null>(null);

  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
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
        config: defaultConfig,
      }
    });
    const llmHelper = new LLMHelper({
      callbacks: {
        onLLMFunctionCall: () => {
          const audio = new Audio("shutter.mp3");
          audio.play();
        },
      },
    });
    voiceClient.registerHelper("llm", llmHelper);

    voiceClientRef.current = voiceClient;
  }, [showSplash]);

  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }

  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <CharacterProvider>
        <TooltipProvider>
          <main>
            <Header />
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

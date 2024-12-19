"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { RTVIClient } from "realtime-ai";
import { DailyTransport } from "realtime-ai-daily";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";

import App from "@/components/App";
import { CharacterProvider } from "@/components/context";
import Header from "@/components/Header";
import Splash from "@/components/Splash";
import {
  BOT_READY_TIMEOUT,
  defaultServices,
  getDefaultConfig,
} from "@/rtvi.config";
const SALES_INTERVIEW_PROMPT_API_URL = 'https://api-staging.huzzle.app/api/v1/config';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<RTVIClient | null>(null);
  const [prompt, setPrompt] = useState("");
  const [_, fetchPrompt] = useTransition();

  useEffect(() => {
    fetchPrompt(async () => {
      try {
        const res = await fetch(SALES_INTERVIEW_PROMPT_API_URL);
        const data = await res.json();
        setPrompt(data.sales_interview_prompt);
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  useEffect(() => {
    if (!showSplash || !prompt || voiceClientRef.current) {
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
        config: getDefaultConfig(prompt),
      }
    });

    voiceClientRef.current = voiceClient;
  }, [showSplash, prompt]);

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

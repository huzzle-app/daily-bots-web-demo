"use client";

import { useCallback, useEffect, useState } from "react";
import { Ear, Loader2 } from "lucide-react";
import { RTVIError, RTVIEvent, RTVIMessage } from "realtime-ai";
import {
  useRTVIClient,
  useRTVIClientEvent,
  useRTVIClientTransportState,
} from "realtime-ai-react";

import { Alert } from "./ui/alert";
import { Button } from "./ui/button";
import * as Card from "./ui/card";
import Session from "./Session";
import { Configure } from "./Setup";
import { useUser } from "./providers/user";

const status_text = {
  idle: "Initializing...",
  initializing: "Initializing...",
  initialized: "Start",
  authenticating: "Requesting bot...",
  connecting: "Connecting...",
};

export default function App() {
  const voiceClient = useRTVIClient()!;
  const transportState = useRTVIClientTransportState();
  const { resetTranscripts } = useUser();

  const [appState, setAppState] = useState<
    "idle" | "ready" | "connecting" | "connected"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);

  useRTVIClientEvent(
    RTVIEvent.Error,
    useCallback((message: RTVIMessage) => {
      const errorData = message.data as { error: string; fatal: boolean };
      if (!errorData.fatal) return;
      setError(errorData.error);
    }, [])
  );

  useEffect(() => {
    // Initialize local audio devices
    if (!voiceClient || appState !== "idle") return;
    voiceClient.initDevices();
  }, [appState, voiceClient]);

  useEffect(() => {
    // Update app state based on voice client transport state.
    // We only need a subset of states to determine the ui state,
    // so this effect helps avoid excess inline conditionals.
    switch (transportState) {
      case "initialized":
        setAppState("ready");
        break;
      case "authenticating":
      case "connecting":
        setAppState("connecting");
        break;
      case "connected":
      case "ready":
        setAppState("connected");
        break;
      default:
        setAppState("idle");
    }
  }, [transportState]);

  async function start() {
    if (!voiceClient) return;

    // Join the session
    try {
      // Disable the mic until the bot has joined
      // to avoid interrupting the bot's welcome message
      voiceClient.enableMic(false);

      await voiceClient.connect();
    } catch (e) {
      setError((e as RTVIError).message || "Unknown error occured");
      voiceClient.disconnect();
    }
  }

  async function leave() {
    await voiceClient.disconnect();
    resetTranscripts();
  }

  /**
   * UI States
   */

  // Error: show full screen message
  if (error) {
    return (
      <Alert intent="danger" title="An error occurred">
        {error}
      </Alert>
    );
  }

  // Connected: show session view
  if (appState === "connected") {
    return (
      <Session
        state={transportState}
        onLeave={() => leave()}
      />
    );
  }

  // Default: show setup view
  const isReady = appState === "ready";

  return (
    <Card.Card shadow className="animate-appear max-w-lg mb-14">
      <Card.CardHeader>
        <Card.CardTitle>Configuration</Card.CardTitle>
      </Card.CardHeader>
      <Card.CardContent stack>
        <div className="flex flex-row gap-2 bg-primary-50 px-4 py-2 md:p-2 text-sm items-center justify-center rounded-md font-medium text-pretty">
          <Ear className="size-7 md:size-5 text-primary-400" />
          Works best in a quiet environment with a good internet.
        </div>
        <Configure
          startAudioOff={startAudioOff}
          handleStartAudioOff={() => setStartAudioOff(!startAudioOff)}
          state={appState}
        />
      </Card.CardContent>
      <Card.CardFooter>
        <Button
          key="start"
          fullWidthMobile
          onClick={() => start()}
          disabled={!isReady}
        >
          {!isReady && <Loader2 className="animate-spin" />}
          {status_text[transportState as keyof typeof status_text]}
        </Button>
      </Card.CardFooter>
    </Card.Card>
  );
}

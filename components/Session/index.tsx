import React, { useCallback, useEffect, useRef, useState } from "react";
import { LogOut, LucidePhoneOff, Settings } from "lucide-react";
import { BotLLMTextData, RTVIEvent,TranscriptData,TransportState } from "realtime-ai";
import { useRTVIClient, useRTVIClientEvent } from "realtime-ai-react";

import { Configure } from "../Setup";
import { Button } from "../ui/button";
import * as Card from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useUser } from "../providers/user";
import { Transcriptions } from "../ui/transcriptions";

import Agent from "./Agent";

interface SessionProps {
  state: TransportState;
  onLeave: () => void;
  openMic?: boolean;
}

export const Session = React.memo(
  ({ state, onLeave }: SessionProps) => {
    const { addTranscript } = useUser();
    const voiceClient = useRTVIClient()!;
    const [showDevices, setShowDevices] = useState<boolean>(false);
    const modalRef = useRef<HTMLDialogElement>(null);

    const onBotStoppedSpeaking = useCallback(() => {
      voiceClient.enableMic(true);
    }, [voiceClient]);

    const onBotStartedSpeaking = useCallback(() => {
      voiceClient.enableMic(false);
    }, [voiceClient]);

    const onBotTranscript = useCallback(
      (botLLMTextData: BotLLMTextData) => {
        addTranscript({ speaker: "bot", text: botLLMTextData.text, });
      },
      [addTranscript]
    );

    const onUserTranscript = useCallback(
      (transcriptData: TranscriptData) => {
        if (transcriptData.final) {
          addTranscript({ speaker: "user", text: transcriptData.text });
        }
      },
      [addTranscript]
    );

    useRTVIClientEvent(RTVIEvent.BotStoppedSpeaking, onBotStoppedSpeaking);
    useRTVIClientEvent(RTVIEvent.BotStartedSpeaking, onBotStartedSpeaking);
    useRTVIClientEvent(RTVIEvent.BotTranscript, onBotTranscript);
    useRTVIClientEvent(RTVIEvent.UserTranscript, onUserTranscript);

    useEffect(() => {
      // Leave the meeting if there is an error
      if (state === "error") {
        onLeave();
      }
    }, [state, onLeave]);

    useEffect(() => {
      // Modal effect
      // Note: backdrop doesn't currently work with dialog open, so we use setModal instead
      const current = modalRef.current;

      if (current && showDevices) {
        current.inert = true;
        current.showModal();
        current.inert = false;
      }
      return () => current?.close();
    }, [showDevices]);

    return (
      <>
        <dialog ref={modalRef}>
          <Card.Card className="w-svw max-w-full md:max-w-md lg:max-w-lg">
            <Card.CardHeader>
              <Card.CardTitle>Configuration</Card.CardTitle>
            </Card.CardHeader>
            <Card.CardContent>
              <Configure state={state} inSession={true} />
            </Card.CardContent>
            <Card.CardFooter>
              <Button onClick={() => setShowDevices(false)}>Close</Button>
            </Card.CardFooter>
          </Card.Card>
        </dialog>

        <div className="flex-1 flex flex-row items-center justify-center w-full gap-x-8 p-8">
          <Card.Card
            fullWidthMobile={false}
            className="w-full max-w-[520px] h-full mt-auto shadow-long"
          >
            <Agent
              isReady={state === "ready"}
            />
          </Card.Card>
          <Transcriptions />
        </div>

        <footer className="absolute bottom-14 left-14 w-full flex flex-row mt-auto self-end md:w-auto">
          <div className="flex flex-row justify-between gap-3 w-full md:w-auto">
            <Tooltip>
              <TooltipContent>Configure</TooltipContent>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDevices(true)}
                >
                  <Settings />
                </Button>
              </TooltipTrigger>
            </Tooltip>
            <Button variant="ghost" size="icon" onClick={() => onLeave()} className="ml-auto bg-red-500 text-white hover:bg-red-600">
              <LucidePhoneOff size={8} />
            </Button>
          </div>
        </footer>
      </>
    );
  },
  (p, n) => p.state === n.state
);

Session.displayName = "Session";

export default Session;

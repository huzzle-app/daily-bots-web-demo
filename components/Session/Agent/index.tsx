import React, { memo, useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { RTVIEvent } from "realtime-ai";
import { RTVIClientVideo,useRTVIClientEvent } from "realtime-ai-react";

import styles from "./styles.module.css";

export const Agent: React.FC<{
  isReady: boolean;
}> = memo(
  ({ isReady }) => {
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [botStatus, setBotStatus] = useState<
      "initializing" | "connected" | "disconnected"
    >("initializing");
    const [botIsTalking, setBotIsTalking] = useState<boolean>(false);

    useEffect(() => {
      // Update the started state when the transport enters the ready state
      if (!isReady) return;
      setHasStarted(true);
      setBotStatus("connected");
    }, [isReady]);

    useRTVIClientEvent(
      RTVIEvent.BotDisconnected,
      useCallback(() => {
        setHasStarted(false);
        setBotStatus("disconnected");
      }, [])
    );

    useRTVIClientEvent(
      RTVIEvent.BotStartedSpeaking,
      useCallback(() => {
        setBotIsTalking(true);
      }, [])
    );

    useRTVIClientEvent(
      RTVIEvent.BotStoppedSpeaking,
      useCallback(() => {
        setBotIsTalking(false);
      }, [])
    );

    // Cleanup
    useEffect(() => () => setHasStarted(false), []);

    const cx = clsx(
      styles.agentWindow,
      hasStarted && styles.ready,
      botIsTalking && styles.talking
    );

    return (
      <div className={styles.agent}>
        <div className={cx}>
          {!hasStarted && (
            <span className={styles.loader}>
              <Loader2 size={32} className="animate-spin" />
            </span>
          )}
        </div>
        <RTVIClientVideo
          participant="local"
          mirror={true}
          className={styles.video}
        />
      </div>
    );
  },
  (p, n) => p.isReady === n.isReady
);
Agent.displayName = "Agent";

export default Agent;

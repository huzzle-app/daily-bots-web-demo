import React, { useEffect, useRef, useState } from "react";

import HelpTip from "../ui/helptip";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

import DeviceSelect from "./DeviceSelect";

interface ConfigureProps {
  state: string;
  startAudioOff?: boolean;
  handleStartAudioOff?: () => void;
  inSession?: boolean;
}

export const Configure: React.FC<ConfigureProps> = React.memo(
  ({ startAudioOff, handleStartAudioOff, inSession = false }) => {
    const [showPrompt, setshowPrompt] = useState<boolean>(false);
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
      // Modal effect
      // Note: backdrop doesn't currently work with dialog open, so we use setModal instead
      const current = modalRef.current;

      if (current && showPrompt) {
        current.inert = true;
        current.showModal();
        current.inert = false;
      }
      return () => current?.close();
    }, [showPrompt]);

    return (
      <section className="flex flex-col flex-wrap gap-3 lg:gap-4">
        <DeviceSelect hideMeter={false} />
      </section>
    );
  },
  (prevProps, nextProps) =>
    prevProps.startAudioOff === nextProps.startAudioOff &&
    prevProps.state === nextProps.state
);

Configure.displayName = "Configure";

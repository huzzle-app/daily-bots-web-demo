import React from "react";
import { Loader2, Upload } from "lucide-react";

import { Button } from "./ui/button";
import { useUser } from "./providers/user";

type SplashProps = {
  handleReady: () => void;
};

export const Splash: React.FC<SplashProps> = ({ handleReady }) => {
  const { user, uploadCV, isCVUploading } = useUser();

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadCV(file);
    }
  };

  return (
    <main className="w-full flex items-center justify-center bg-primary-200 p-4 bg-[length:auto_50%] lg:bg-auto bg-colorWash bg-no-repeat bg-right-top">
      <div className="flex flex-col gap-8 lg:gap-12 items-center max-w-full lg:max-w-3xl">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-balance text-left">
          Huzzle
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              multiple={false}
              onChange={onFileSelect}
              className={`absolute inset-0 w-full h-full opacity-0 ${isCVUploading ? "cursor-default pointer-events-none" : "cursor-pointer"}`}
            />
            <Button variant="ghost" className={`w-full ${isCVUploading ? "cursor-default pointer-events-none" : ""}`}>
              Upload CV
              {isCVUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            </Button>
          </div>
          <Button onClick={() => handleReady()} disabled={!user}>Start Interview</Button>
        </div>
      </div>
    </main>
  );
};

export default Splash;

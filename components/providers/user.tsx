"use client";

import { INGMAR_RESUME_DATA, INGMAR_RESUME_FILENAME } from "@/utils/constants";
import { createContext, useContext, ReactNode, useState, useMemo, useTransition, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';

interface UserContextType {
  user: TUser | null;
  isCVUploading: boolean;
  uploadCV: (file: File) => void;
  transcripts: { id: string; speaker: string; text: string }[];
  addTranscript: (transcript: { speaker: string; text: string }) => void;
  resetTranscripts: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

type TUser = {
  firstName: string;
  lastName: string;
  skills: string[];
  workExperiences: string[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const RESUME_UPLOAD_API_URL = `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/parser/cv/upload`;

function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<TUser | null>(null);
  const [isCVUploading, startUploadingCV] = useTransition();
  const [transcripts, setTranscripts] = useState<{ id: string; speaker: string; text: string }[]>([]);

  const addTranscript = useCallback((transcript: { speaker: string; text: string }) => {
    setTranscripts((prev) => {
      const lastTranscript = prev[prev.length - 1];
      if (lastTranscript?.speaker === transcript.speaker) {
        const formattedText = transcript.text.replace("\n\n", " ").replace("\n", " ");
        const formattedTranscript = { ...lastTranscript, text: formattedText };
        formattedTranscript.text = lastTranscript.speaker === "bot" ? `${lastTranscript.text}${formattedText}` : `${lastTranscript.text} ${formattedText}`;
        prev[prev.length - 1] = formattedTranscript;
        return [...prev];
      } else {
        return [...prev, { id: uuidv4(), ...transcript }];
      }
    });
  }, [setTranscripts]);

  const resetTranscripts = useCallback(() => {
    setTranscripts([]);
  }, [setTranscripts]);

  const uploadCV = useCallback((file: File) => {
    startUploadingCV(async () => {
      try {
        let userData;
        if (file.name === INGMAR_RESUME_FILENAME) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          userData = INGMAR_RESUME_DATA;
        } else {
          const formData = new FormData();
          formData.append('cv', file);
          const response = await fetch(RESUME_UPLOAD_API_URL, {
            method: 'POST',
            body: formData,
          });
          userData = await response.json();
        }

        setUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          skills: userData.skills.map((skill: { skill: string }) => skill.skill),
          workExperiences: userData.workExperiences.reduce((acc: string[], experience: { summaries: string[] }) => {
            const experienceSummaries = experience.summaries.map((summary: string) => summary.trim()).filter((summary: string) => summary.length > 0);
            acc.push(...experienceSummaries);
            return acc;
          }, []),
        });
      } catch (error) {
        console.error('Error uploading CV:', error);
      }
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isCVUploading,
      transcripts,
      addTranscript,
      uploadCV,
      resetTranscripts,
    }),
    [user, isCVUploading, transcripts, addTranscript, uploadCV, resetTranscripts],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within an UserProvider");
  }

  return context;
}

export { UserProvider, useUser };

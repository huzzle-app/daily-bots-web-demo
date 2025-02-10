import { Bot } from "lucide-react";
import { useUser } from "../providers/user";
import { Avatar, AvatarFallback } from "./avatar";

const Transcriptions = () => {
  const { transcripts } = useUser();

  return (
    <section className="flex-1 h-[calc(100vh-64px)] border rounded-xl shadow-sm p-6 dark:bg-neutral-800 dark:border-neutral-700 overflow-y-auto">
        
            <ul className="flex flex-col gap-y-4">
            {
                transcripts.map((transcript) => (
                    transcript.speaker === "bot" ? <BotTranscript text={transcript.text} key={transcript.id} /> : <UserTranscript text={transcript.text} key={transcript.id} />
                ))
            }
            </ul>
        
    </section>
  );
};

const BotTranscript = ({ text }: { text: string }) => {
    return (
        <li className="flex gap-x-2 sm:gap-x-4">
            <div className="bg-white border border-gray-200 rounded-2xl py-3 px-4 space-y-3">
                <Bot className="size-7 text-gray-800" />
            <div className="grow text-start space-y-3">
                <div className="inline-block rounded-2xl">
                    <p className="text-sm text-gray-800 whitespace-pre-line">{text}</p>
                </div>
            </div>
            </div>
        </li>
    );
};

const UserTranscript = ({ text }: { text: string }) => {
    const { user } = useUser();
    const fallback = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

    return (
        <li className="flex gap-x-2 sm:gap-x-4">
            <div className="bg-white border border-gray-200 rounded-2xl py-3 px-4 space-y-3 bg-sky-100">
            <Avatar className="size-8 p-3 bg-white border border-gray-200">
                <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="grow text-start space-y-3">
                <div className="inline-block rounded-2xl">
                    <p className="text-sm text-gray-800 whitespace-pre-line">{text}</p>
                </div>
            </div>
            </div>
        </li>
    );
};

export { Transcriptions };

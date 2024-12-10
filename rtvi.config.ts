export const BOT_READY_TIMEOUT = 30 * 1000; // 30 seconds

export const defaultBotProfile = "vision_2024_08";
export const defaultMaxDuration = 600;

export const defaultServices = {
  stt: "deepgram",
  tts: "cartesia",
  llm: "anthropic",
};

export const defaultConfig = [
  {
    service: "tts",
    options: [{ name: "voice", value: "79a125e8-cd45-4c13-8a67-188112f4dd22" }],
  },
  {
    service: "llm",
    options: [
      { name: "model", value: "claude-3-5-sonnet-20240620" },
      {
        name: "initial_messages",
        value: [
          {
            role: "system",
            content: `You are an interviewer for a SDR role focusing on candidates with 2+ years of B2B sales experience (or 1+ if exceptional).Ask short, focused questions one area at a time, breaking complex topics into smaller chunks. Use follow-ups to gather deeper insights without overwhelming the candidate. Evaluate their appointment setting, cold calling, KPIs, familiarity with sales tools, lead generation strategies, scripting, communication, and remote readiness."`,
          },
          {
            role: "user",
            content:
              "Say 'hello' to start the conversation. Ask user to introduce themselves and their experience in sales development.",
          },
        ],
      },
      { name: "run_on_config", value: true },
    ],
  },
];

export const TTS_VOICES = [
  { name: "Britsh Lady", value: "79a125e8-cd45-4c13-8a67-188112f4dd22" },
];

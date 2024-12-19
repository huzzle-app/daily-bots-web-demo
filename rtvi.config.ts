export const BOT_READY_TIMEOUT = 30 * 1000; // 30 seconds

export const defaultBotProfile = "vision_2024_08";
export const defaultMaxDuration = 600;

export const defaultServices = {
  stt: "deepgram",
  tts: "cartesia",
  llm: "anthropic",
};

export const getDefaultConfig = (systemPrompt: string) => [
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
            content: systemPrompt,
          },
          {
            role: "user",
            content:
              "Say 'hello' to start the conversation. Ask user to introduce themselves.",
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

import {
  convertToModelMessages,
  streamText,
  UIMessage,
  stepCountIs,
} from "ai";
import { getModel } from "@/lib/ai";
import { getMCPTools } from "@/lib/mcp";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const { tools, close } = await getMCPTools();

  const result = streamText({
    model: getModel(),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
    onStepFinish: ({ toolCalls, toolResults, text }) => {
      for (const call of toolCalls) {
        const c = call as Record<string, unknown>;
        console.log(`[tool:call] ${c.toolName}`, JSON.stringify(c.args, null, 2));
      }
      for (const res of toolResults) {
        const r = res as Record<string, unknown>;
        console.log(`[tool:result] ${r.toolName}`, JSON.stringify(r.result, null, 2));
      }
      if (text) {
        console.log(`[ai:response]`, text.slice(0, 200) + (text.length > 200 ? "..." : ""));
      }
    },
    onFinish: close,
    onError: close,
  });

  return result.toUIMessageStreamResponse();
}

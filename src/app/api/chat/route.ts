import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { TOOLS } from "@/lib/tools";
import type { ChatMessage, PageContent } from "@/types";

type ChatRequestBody = {
  messages?: ChatMessage[];
  pageContext?: PageContent;
  pageContent?: PageContent;
};

type ListedModel = {
  name?: string;
  supportedGenerationMethods?: string[];
};

const MODEL_PREFERENCE = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
  "gemini-1.5-flash",
] as const;

let cachedModelName: string | null = null;
let cachedModelExpiresAt = 0;

function buildSystemPrompt(pageContext: PageContent): string {
  const sectionSummary = pageContext.sections
    .map((section) => `${section.id}: ${section.heading || "No heading"}`)
    .join(", ");

  return [
    "You are a co-browsing assistant for a portfolio website. You can:",
    "Answer questions about the portfolio using the provided page context",
    "Use tools to help users navigate and interact with the site",
    `Current page sections: ${sectionSummary}`,
    "When user asks about content, reference specific sections.",
    "When user wants to navigate or interact, use appropriate tools.",
    "Always confirm before filling forms or clicking destructive buttons.",
  ].join("\n");
}

function toGeminiContents(messages: ChatMessage[]): Array<{
  role: "user" | "model";
  parts: Array<{ text: string }>;
}> {
  return messages
    .filter(
      (message) => message.role === "user" || message.role === "assistant",
    )
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));
}

async function resolveModelName(apiKey: string): Promise<string> {
  const now = Date.now();
  if (cachedModelName && cachedModelExpiresAt > now) {
    return cachedModelName;
  }

  const listResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    { method: "GET", cache: "no-store" },
  );

  if (!listResponse.ok) {
    throw new Error(`Unable to list Gemini models (${listResponse.status}).`);
  }

  const listPayload = (await listResponse.json()) as { models?: ListedModel[] };
  const models = listPayload.models || [];
  const envModel = process.env.GEMINI_MODEL?.trim();

  const generatableModelIds = models
    .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
    .map((model) => model.name || "")
    .filter(Boolean)
    .map((name) => name.replace(/^models\//, ""));

  if (generatableModelIds.length === 0) {
    throw new Error("No generateContent-capable Gemini models were found for this key.");
  }

  if (envModel && generatableModelIds.includes(envModel)) {
    cachedModelName = envModel;
    cachedModelExpiresAt = now + 10 * 60 * 1000;
    return envModel;
  }

  if (envModel) {
    console.warn(
      `[api/chat] GEMINI_MODEL="${envModel}" is unavailable for this key. Falling back automatically.`,
    );
  }

  const preferred = MODEL_PREFERENCE.find((candidate) =>
    generatableModelIds.includes(candidate),
  );

  const resolved =
    preferred ||
    generatableModelIds.find((model) => model.startsWith("gemini") && model.includes("flash")) ||
    generatableModelIds.find((model) => model.startsWith("gemini")) ||
    generatableModelIds[0];

  cachedModelName = resolved;
  cachedModelExpiresAt = now + 10 * 60 * 1000;

  return resolved;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as ChatRequestBody;
    const messages = body.messages || [];
    const pageContext = body.pageContext || body.pageContent || { sections: [] };
    const modelName = await resolveModelName(apiKey);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: buildSystemPrompt(pageContext),
      tools: [
        {
          functionDeclarations: TOOLS.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          })),
        },
      ] as unknown as Parameters<typeof genAI.getGenerativeModel>[0]["tools"],
    });

    const contents = toGeminiContents(messages);
    const response = await model.generateContent({
      contents:
        contents.length > 0
          ? contents
          : [{ role: "user", parts: [{ text: "Introduce yourself briefly." }] }],
    });

    const geminiResponse = response.response;
    const toolCalls =
      typeof geminiResponse.functionCalls === "function"
        ? geminiResponse.functionCalls()
        : [];

    if (toolCalls && toolCalls.length > 0) {
      return NextResponse.json({
        type: "tool_calls",
        calls: toolCalls.map((call, index) => ({
          id: `${call.name}-${index}`,
          name: call.name,
          arguments: call.args || {},
        })),
      });
    }

    return NextResponse.json({
      type: "text",
      content: geminiResponse.text() || "",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process chat request.";

    console.error("[/api/chat] Gemini request failed:", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

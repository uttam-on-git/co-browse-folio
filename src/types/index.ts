export type PageSectionType =
  | "heading"
  | "paragraph"
  | "list"
  | "table"
  | "form"
  | "navigation"
  | "media"
  | "other";

export interface PageElement {
  id: string;
  tagName: string;
  text?: string;
  selector?: string;
  attributes?: Record<string, string>;
}

export interface PageSection {
  id: string;
  type: PageSectionType;
  text: string;
  elements: PageElement[];
}

export interface PageContent {
  sections: PageSection[];
}

export type ChatRole = "system" | "user" | "assistant" | "tool";

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  name: string;
  result: unknown;
  error?: string;
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

export type JsonSchema = {
  type?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  enum?: Array<string | number | boolean>;
  additionalProperties?: boolean | JsonSchema;
};

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: JsonSchema;
}

export interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export type NavigateAction = {
  type: "navigate";
  url: string;
};

export type ClickAction = {
  type: "click";
  selector: string;
};

export type InputAction = {
  type: "input";
  selector: string;
  value: string;
};

export type SelectAction = {
  type: "select";
  selector: string;
  value: string;
};

export type ScrollAction = {
  type: "scroll";
  selector?: string;
  x?: number;
  y?: number;
};

export type HoverAction = {
  type: "hover";
  selector: string;
};

export type SubmitAction = {
  type: "submit";
  selector: string;
};

export type KeyPressAction = {
  type: "keypress";
  key: string;
  selector?: string;
};

export type WaitAction = {
  type: "wait";
  milliseconds: number;
};

export type ExtractAction = {
  type: "extract";
  selector: string;
  attribute?: string;
};

export type CoBrowseAction =
  | NavigateAction
  | ClickAction
  | InputAction
  | SelectAction
  | ScrollAction
  | HoverAction
  | SubmitAction
  | KeyPressAction
  | WaitAction
  | ExtractAction;

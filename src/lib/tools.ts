import type { ToolDefinition } from "@/types";

export const TOOLS: ToolDefinition[] = [
  {
    name: "scroll_to_section",
    description: "Scroll the viewport to a specific section of the page",
    parameters: {
      type: "object",
      properties: {
        sectionId: {
          type: "string",
          description: "ID of the target section element",
        },
        behavior: {
          type: "string",
          description: "Scroll behavior mode",
          enum: ["smooth", "auto"],
        },
      },
      required: ["sectionId", "behavior"],
    },
  },
  {
    name: "highlight_element",
    description:
      "Add a temporary visual highlight effect to draw attention to an element",
    parameters: {
      type: "object",
      properties: {
        elementId: {
          type: "string",
          description: "ID of the element to highlight",
        },
        durationSeconds: {
          type: "number",
          description: "How long the highlight should remain visible",
        },
        color: {
          type: "string",
          description: "Optional highlight color value",
        },
      },
      required: ["elementId", "durationSeconds"],
    },
  },
  {
    name: "click_element",
    description: "Programmatically click a button or link element",
    parameters: {
      type: "object",
      properties: {
        elementId: {
          type: "string",
          description: "ID of the button or link element to click",
        },
        requireConfirmation: {
          type: "boolean",
          description: "Whether user confirmation is required before clicking",
        },
      },
      required: ["elementId"],
    },
  },
  {
    name: "fill_input",
    description: "Fill a form input field with a value",
    parameters: {
      type: "object",
      properties: {
        inputId: {
          type: "string",
          description: "ID of the input element to fill",
        },
        value: {
          type: "string",
          description: "Value to place into the input field",
        },
      },
      required: ["inputId", "value"],
    },
  },
  {
    name: "get_element_info",
    description: "Get information about a specific element (text, type, visibility)",
    parameters: {
      type: "object",
      properties: {
        elementId: {
          type: "string",
          description: "ID of the element to inspect",
        },
      },
      required: ["elementId"],
    },
  },
];

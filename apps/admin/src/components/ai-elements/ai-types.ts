export interface FileUIPart {
  type: "file";
  id?: string;
  name?: string;
  filename?: string;
  mediaType?: string;
  url: string;
}

export interface SourceDocumentUIPart {
  type: "source-document";
  id?: string;
  title?: string;
  filename?: string;
  url?: string;
}

export type ChatStatus = "ready" | "submitted" | "streaming" | "error";

export interface UIMessage {
  id: string;
  role: "system" | "user" | "assistant" | "data";
  content: string;
  createdAt?: Date;
  parts?: any[];
  annotations?: any[];
}

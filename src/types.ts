import { IncomingMessage, ServerResponse } from "node:http";

export interface Route {
  method: string;
  path: string;
  handler: (req: IncomingMessage, res: ServerResponse) => void;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  created_at: string;
  completed_at: string | null;
  updated_at?: string;
}

export interface csvRecord {
  title: string;
  description: string;
}

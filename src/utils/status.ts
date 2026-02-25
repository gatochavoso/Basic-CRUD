import type { ServerResponse } from "node:http";

export class Response {
  private res: ServerResponse;
  private headers: { "Content-Type": string };

  constructor(res: ServerResponse) {
    this.res = res;
    this.headers = { "Content-Type": "application/json" };
  }
  success(status: number, data: unknown) {
    this.res.writeHead(status, this.headers);
    this.res.end(JSON.stringify(data));
  }
  error(status: number, message: unknown) {
    this.res.writeHead(status, this.headers);
    this.res.end(JSON.stringify({ error: message }));
  }
}

import { IncomingMessage } from "node:http";

export async function parseBody(
  req: IncomingMessage,
): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf-8");
        const parsed = JSON.parse(body);

        // valida se body e um objeto valido
        if (
          parsed === null ||
          Array.isArray(parsed) ||
          typeof parsed !== "object"
        ) {
          return reject(new Error("INVALID BODY"));
        }

        resolve(parsed);
      } catch (err) {
        reject(new Error("INVALID JSON"));
      }
    });
    req.on("error", reject);
  });
}

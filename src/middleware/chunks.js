export async function parseBody(req) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf-8");
        const parsed = JSON.parse(body);

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

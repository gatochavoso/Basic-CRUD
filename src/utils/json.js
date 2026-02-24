export class Response {
  constructor(res) {
    this.res = res;
    this.headers = { "Content-Type": "application/json" };
  }
  success(status, data) {
    this.res.writeHead(status, this.headers);
    this.res.end(JSON.stringify(data));
  }
  error(status, message) {
    this.res.writeHead(status, this.headers);
    this.res.end(JSON.stringify({ error: message }));
  }
}

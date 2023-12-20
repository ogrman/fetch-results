import * as http from 'http';

export type LastAction =
  | "refused"
  | "get_text"
  | "get_invalid_json"
  | "get_json"
  ;

type Server = http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

export class TestServer {
  public lastAction: LastAction | undefined;
  private server: Server | undefined;

  constructor(port: number) {
    this.server = http.createServer((req, res) => {
      console.log(req.url);
      if (req.url === "/refuse") {
        this.lastAction = "refused";
        res.socket?.destroy();
      } else if (req.method === "GET" && req.url === "/text") {
        this.lastAction = "get_text";
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write("Text");
        res.end();
      } else if (req.method === "GET" && req.url === "/invalid_json") {
        this.lastAction = "get_invalid_json";
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write("{\"bad json\"}");
        res.end(); 
      } else if (req.method === "GET" && req.url === "/json") {
        this.lastAction = "get_json";
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write("\"a string can be json\"");
        res.end();
     } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write("default response");
        res.end();
      }
    }).listen(port, () => {
      console.log(`Test server running on port ${port}`);
    });
  }

  close() {
    if (this.server !== undefined) {
      console.log("Test server shutting down");
      this.server.close();
    }
    this.server = undefined;
  }
}

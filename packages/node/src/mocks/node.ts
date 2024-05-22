import { setupServer } from "msw/node";
import { scenarios } from "./scenarios";

export const server = setupServer(...scenarios["success"]);

export const errorServer = setupServer(...scenarios["error"]);

server.events.on("request:start", ({ request }) => {
  console.log("MSW intercepted:", request.method, request.url);
});

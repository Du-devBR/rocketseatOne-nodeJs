import fastify from "fastify";
import cookie from "@fastify/cookie";
import { transactionRoutes } from "./routes/transactions";

export const app = fastify();

app.register(cookie);

app.addHook("preHandler", async (req) => {
  console.log(`[${req.method}] ${req.url}`);
});

app.register(transactionRoutes, {
  prefix: "transactions",
});

import { FastifyInstance } from "fastify";
import { z } from "zod";
import crypto, { randomUUID } from "node:crypto";
import { kenx } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exist";

export async function transactionRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [checkSessionIdExists] }, async (req) => {
    const { sessionId } = req.cookies;
    const transactions = await kenx("transactions")
      .where("session_id", sessionId)
      .select();

    return {
      transactions,
    };
  });

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (req) => {
    const { sessionId } = req.cookies;
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(req.params);

    const transaction = await kenx("transactions")
      .where("id", id)
      .andWhere("session_id", sessionId)
      .first();

    return {
      transaction,
    };
  });

  app.get("/summary", { preHandler: [checkSessionIdExists] }, async (req) => {
    const { sessionId } = req.cookies;
    const summary = await kenx("transactions")
      .where("session_id", sessionId)
      .sum("amount", { as: "amount" })
      .first();

    return {
      summary,
    };
  });

  app.post("/", async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(req.body);

    // Usado let para ser uma variavel alterada
    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      res.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 24 * 7, // 7 days,
      });
    }

    await kenx("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return res.status(201).send();
  });
}

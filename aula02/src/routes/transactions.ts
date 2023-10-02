import { FastifyInstance } from "fastify";
import { z } from "zod";
import crypto from "node:crypto";
import { kenx } from "../database";

export async function transactionRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const transactions = await kenx("transactions").select();

    return {
      transactions,
    };
  });

  app.get("/:id", async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(req.params);

    const transaction = await kenx("transactions").where("id", id).first();

    return {
      transaction,
    };
  });

  app.post("/", async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(req.body);

    await kenx("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    });

    return res.status(201).send();
  });
}

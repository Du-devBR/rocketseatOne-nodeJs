import { expect, test, beforeAll, afterAll, describe } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("Transaction Routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("User can create a new transaction", async () => {
    const response = await request(app.server).post("/transactions").send({
      title: "New transaction",
      amount: 5000,
      type: "credit",
    });
    expect(response.statusCode).toEqual(201);
  });

  test("User can list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "credit",
      });

    const cokkies = createTransactionResponse.get("Set-Cookie");

    const response = await request(app.server)
      .get("/transactions")
      .set("Cookie", cokkies);
    expect(response.statusCode).toEqual(200);

    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 5000,
      }),
    ]);
  });
});

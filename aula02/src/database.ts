import { knex as setupKnex } from "knex";

export const kenx = setupKnex({
  client: "sqlite",
  connection: {
    filename: "./tmp/app.db",
  },
});

import fastify from "fastify";

/**
 * Uitlizando biblioteca fastify
 * Podemos realizar metodos http
 * GET/ POST/ PUT/ DELETE
 * exemplo
 * http://localhost:3333/hello
 *
 * instalar tsx -D para autmatizar a buil de ts pra js
 * executar com npx tsx + arquivo.ts, utilizar somente em desenvolvimento
 *
 * Configurando eslint
 * npm i eslint @rocketseat/eslint-config -D / utilizado padrão da rocketseat, porem é facultativo
 * chat gpt salvou, deve add "rules": {
    "prettier/prettier": ["error", { "endOfLine": "auto" }]
  } no .eslintrc
 */

const app = fastify();

app.get("/hello", () => {
  return "Hello wordsdsds";
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server running");
  });

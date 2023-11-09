# App

Gympass style app

## Requisitos funcionais

- [ ] Deve ser possivel se cadastrar;
- [ ] Deve ser possivel se autenticar;
- [ ] Deve ser possivel obter o perfil de um usuario logado
- [ ] Deve ser possivel obter o numero de check-ins realizados pelo usuario logado;
- [ ] Deve ser possivel o usario obter seu historico de check-ins;
- [ ] Deve ser possivel obter o usuario buscar academias proximas;
- [ ] Deve ser possivel obter o usuario buscar academias pelo nome;
- [ ] Deve ser possivel obter o usuario realizar check-in em uma academia;
- [ ] Deve ser possivel validar o check-in de um usuario;
- [ ] Deve ser possivel cadastrar uma academia;

## Regras de negócio

- [ ] O usuario não deve poder se cadastrar com um e-mail duplicado;
- [ ] O usuario não pode fazer 2 check-ins no mesmo dia;
- [ ] O usuario não pode fazer check-in se não estiver perto(100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após criado;
- [ ] O check-in só pode ser validado por admins;
- [ ] A academia só pode ser cadastrada por admins;

## Requisitos não funcionais

- [ ] A senha do usuario precisa estar cripotrafada;
- [ ] Os dados da aplicação precisam estar persistidos em um banco PostgreSql;
- [ ] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuario deve ser identificado por um JWT (JSON Web Token);
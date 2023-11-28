import { describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ServiceAuthenticate } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate Use Case", () => {
  it("should be able to Authenticate", async () => {
    const prismaUsersRepository = new InMemoryUsersRepository();

    const sut = new ServiceAuthenticate(prismaUsersRepository);

    await prismaUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to Authenticate with wrong email", async () => {
    const prismaUsersRepository = new InMemoryUsersRepository();
    const sut = new ServiceAuthenticate(prismaUsersRepository);

    expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to Authenticate with wrong password", async () => {
    const prismaUsersRepository = new InMemoryUsersRepository();
    const sut = new ServiceAuthenticate(prismaUsersRepository);

    await prismaUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

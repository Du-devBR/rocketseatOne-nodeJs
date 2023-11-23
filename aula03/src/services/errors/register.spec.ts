import { describe, expect, it } from "vitest";
import { ServiceRegister } from "../register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./user-already-exists-error";

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const prismaUsersRepository = new InMemoryUsersRepository();

    const registerService = new ServiceRegister(prismaUsersRepository);

    const { user } = await registerService.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const prismaUsersRepository = new InMemoryUsersRepository();

    const registerService = new ServiceRegister(prismaUsersRepository);

    const { user } = await registerService.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to regiser with same email twice", async () => {
    const prismaUsersRepository = new InMemoryUsersRepository();
    const registerService = new ServiceRegister(prismaUsersRepository);

    const email = "johndoe@example.com";

    await registerService.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      registerService.execute({
        name: "John Doe",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});

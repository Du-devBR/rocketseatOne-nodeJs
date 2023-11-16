import { describe, expect, it } from "vitest";
import { ServiceRegister } from "../register";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { compare } from "bcryptjs";

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const prismaUsersRepository = new PrismaUserRepository();

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
});

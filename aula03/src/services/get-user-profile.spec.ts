import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { ServiceGetUserProfile } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

describe("Get user profile Use Case", () => {
  let prismaUsersRepository: InMemoryUsersRepository;
  let sut: ServiceGetUserProfile;

  beforeEach(() => {
    prismaUsersRepository = new InMemoryUsersRepository();
    sut = new ServiceGetUserProfile(prismaUsersRepository);
  });
  it("should be able to get user profile", async () => {
    const createdUser = await prismaUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("John Doe");
  });

  it("should not be able to get user profile white wrong id", async () => {
    expect(() =>
      sut.execute({
        userId: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

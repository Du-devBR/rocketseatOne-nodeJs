import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { ServiceCheckin } from "./checkin";

describe("Checkin Use Case", () => {
  let prismaCheckinRepository: InMemoryCheckinsRepository;
  let sut: ServiceCheckin;

  beforeEach(() => {
    prismaCheckinRepository = new InMemoryCheckinsRepository();
    sut = new ServiceCheckin(prismaCheckinRepository);
  });
  it("should be able to checkin", async () => {
    const { checkin } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    expect(checkin.id).toEqual(expect.any(String));
  });
});

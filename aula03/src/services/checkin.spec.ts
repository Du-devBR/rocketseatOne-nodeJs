import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { ServiceCheckin } from "./checkin";

describe("Checkin Use Case", () => {
  let prismaCheckinRepository: InMemoryCheckinsRepository;
  let sut: ServiceCheckin;

  beforeEach(() => {
    prismaCheckinRepository = new InMemoryCheckinsRepository();
    sut = new ServiceCheckin(prismaCheckinRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to checkin", async () => {
    const { checkin } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    console.log(checkin);

    expect(checkin.id).toEqual(expect.any(String));
  });

  it("should not be able to checkin in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 11, 1, 8, 0, 0));
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});

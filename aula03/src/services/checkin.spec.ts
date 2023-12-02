import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { ServiceCheckin } from "./checkin";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

describe("Checkin Use Case", () => {
  let prismaCheckinRepository: InMemoryCheckinsRepository;
  let gymsRepository: InMemoryGymsRepository;
  let sut: ServiceCheckin;

  beforeEach(() => {
    prismaCheckinRepository = new InMemoryCheckinsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new ServiceCheckin(prismaCheckinRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-01",
      title: "Academy",
      description: "test",
      phone: "011222",
      latitude: new Decimal(-23.521599),
      longitude: new Decimal(-46.184407),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to checkin", async () => {
    const { checkin } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -23.521599,
      userLongitude: -46.184407,
    });
    expect(checkin.id).toEqual(expect.any(String));
  });

  it("should not be able to checkin in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 11, 1, 8, 0, 0));
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -23.521599,
      userLongitude: -46.184407,
    });

    expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -23.521599,
        userLongitude: -46.184407,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to checkin in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 11, 1, 8, 0, 0));
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -23.521599,
      userLongitude: -46.184407,
    });

    vi.setSystemTime(new Date(2023, 11, 2, 8, 0, 0));

    const { checkin } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -23.521599,
      userLongitude: -46.184407,
    });

    expect(checkin.id).toEqual(expect.any(String));
  });

  it("should not be able to checkin in distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Academy",
      description: "test",
      phone: "011222",
      latitude: new Decimal(-23.542656),
      longitude: new Decimal(-46.232983),
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-02",
        userLatitude: -23.521599,
        userLongitude: -46.184407,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});

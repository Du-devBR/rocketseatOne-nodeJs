import { CheckIn, Prisma } from "@prisma/client";
import { ICheckinsRepository } from "../checkins-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCheckinsRepository implements ICheckinsRepository {
  public items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkin = {
      id: randomUUID(),
      created_at: new Date(),
      validaded_at: data.validaded_at ? new Date(data.validaded_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    };

    this.items.push(checkin);

    return checkin;
  }
}
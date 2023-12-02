import { CheckIn, Prisma } from "@prisma/client";
import { ICheckinsRepository } from "../checkins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckinsRepository implements ICheckinsRepository {
  public items: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkinOnSameDate = this.items.find((checkin) => {
      const checkinDate = dayjs(checkin.created_at);

      const isOnSameDate =
        checkinDate.isAfter(startOfTheDay) && checkinDate.isBefore(endOfTheDay);

      return checkin.user_id === userId && isOnSameDate;
    });

    if (!checkinOnSameDate) {
      return null;
    }

    return checkinOnSameDate;
  }

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

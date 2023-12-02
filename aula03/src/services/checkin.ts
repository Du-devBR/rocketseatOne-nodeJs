import { CheckIn } from "@prisma/client";
import { ICheckinsRepository } from "@/repositories/checkins-repository";

interface ServiceCheckinRequest {
  userId: string;
  gymId: string;
}

interface ServiceCheckinResponse {
  checkin: CheckIn;
}

export class ServiceCheckin {
  constructor(private checkinsRepository: ICheckinsRepository) {}

  async execute({
    gymId,
    userId,
  }: ServiceCheckinRequest): Promise<ServiceCheckinResponse> {
    const checkinOnSameDate = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkinOnSameDate) {
      throw new Error();
    }
    const checkin = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkin,
    };
  }
}

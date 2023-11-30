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
    const checkin = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkin,
    };
  }
}

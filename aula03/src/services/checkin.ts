import { CheckIn } from "@prisma/client";
import { ICheckinsRepository } from "@/repositories/checkins-repository";
import { IGymsRepository } from "@/repositories/gym-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

interface ServiceCheckinRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface ServiceCheckinResponse {
  checkin: CheckIn;
}

export class ServiceCheckin {
  constructor(
    private checkinsRepository: ICheckinsRepository,
    private gymsRepository: IGymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: ServiceCheckinRequest): Promise<ServiceCheckinResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error();
    }

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

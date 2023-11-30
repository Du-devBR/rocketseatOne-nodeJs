import { IUsersRepository } from "@/repositories/user-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ServiceGetUserProfileRequest {
  userId: string;
}

interface ServiceGetUserProfileResponse {
  user: User;
}

export class ServiceGetUserProfile {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    userId,
  }: ServiceGetUserProfileRequest): Promise<ServiceGetUserProfileResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}

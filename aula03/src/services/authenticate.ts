import { IUsersRepository } from "@/repositories/user-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface ServiceAuthenticateRequest {
  email: string;
  password: string;
}

interface ServiceAuthenticateResponse {
  user: User;
}

export class ServiceAuthenticate {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: ServiceAuthenticateRequest): Promise<ServiceAuthenticateResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}

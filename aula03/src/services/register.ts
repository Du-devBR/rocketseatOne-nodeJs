import { IUsersRepository } from "@/repositories/user-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { User } from "@prisma/client";

interface ServiceRegisterRequest {
  email: string;
  name: string;
  password: string;
}

interface RegisterServiceResponse {
  user: User;
}

export class ServiceRegister {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: ServiceRegisterRequest): Promise<RegisterServiceResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.userRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}

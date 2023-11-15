import { IUsersRepository } from "@/repositories/user-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface ServiceRegisterRequest {
  email: string;
  name: string;
  password: string;
}

export class ServiceRegister {
  constructor(private userRepository: IUsersRepository) {}

  async execute({ email, name, password }: ServiceRegisterRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    await this.userRepository.create({
      name,
      email,
      password_hash,
    });
  }
}

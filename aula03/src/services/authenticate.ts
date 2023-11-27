import { IUsersRepository } from "@/repositories/user-repository";

interface ServiceAuthenticateRequest {
  email: string;
  password: string;
}

type ServiceAuthenticateResponse = void;

export class ServiceAuthenticate {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: ServiceAuthenticateRequest): Promise<ServiceAuthenticateResponse> {
    // auth
  }
}

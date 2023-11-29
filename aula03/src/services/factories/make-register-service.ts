import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { ServiceRegister } from "../register";

export function makeRegisterService() {
  const prismaUserRepository = new PrismaUserRepository();
  const serviceRegister = new ServiceRegister(prismaUserRepository);

  return serviceRegister;
}

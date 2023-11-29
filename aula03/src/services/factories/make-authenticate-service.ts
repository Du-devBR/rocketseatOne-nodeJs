import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { ServiceAuthenticate } from "../authenticate";

export function makeAuthenticateService() {
  const prismaUserRepository = new PrismaUserRepository();
  const authenticateRegister = new ServiceAuthenticate(prismaUserRepository);

  return authenticateRegister;
}

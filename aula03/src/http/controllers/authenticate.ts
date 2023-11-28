import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { ServiceAuthenticate } from "@/services/authenticate";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const prismaUserRepository = new PrismaUserRepository();
    const authenticateRegister = new ServiceAuthenticate(prismaUserRepository);
    await authenticateRegister.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      reply.status(400).send({ message: error.message });
    }
  }

  return reply.status(200).send("User authenticate.");
}

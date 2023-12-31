import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { makeRegisterService } from "@/services/factories/make-register-service";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(request.body);

  try {
    const serviceRegister = makeRegisterService();

    await serviceRegister.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      reply.status(409).send({ message: error.message });
    }
  }

  return reply.status(201).send("Create new user");
}

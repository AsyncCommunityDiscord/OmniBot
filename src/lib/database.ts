import { Prisma, PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export default prisma;
export { Prisma };

import "dotenv/config";
import path from "path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("src", "prisma"),
} satisfies PrismaConfig;

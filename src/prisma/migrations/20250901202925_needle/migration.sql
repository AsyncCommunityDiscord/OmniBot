-- CreateEnum
CREATE TYPE "public"."thread_types" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "public"."ModuleActivation" ALTER COLUMN "activatedVersion" SET DEFAULT '';

-- CreateTable
CREATE TABLE "public"."thread_creator_configs" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "welcomeMessage" TEXT NOT NULL DEFAULT '💬 Utilisez ce fil pour discuter de ce sujet !',
    "threadType" "public"."thread_types" NOT NULL DEFAULT 'PUBLIC',
    "threadNameTemplate" TEXT NOT NULL DEFAULT 'Discussion - {messageAuthor}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "thread_creator_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "thread_creator_configs_guildId_key" ON "public"."thread_creator_configs"("guildId");

/*
  Warnings:

  - You are about to drop the column `threadType` on the `thread_creator_configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."thread_creator_configs" DROP COLUMN "threadType";

-- DropEnum
DROP TYPE "public"."thread_types";

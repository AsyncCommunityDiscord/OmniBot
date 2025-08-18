-- CreateTable
CREATE TABLE "public"."ModuleActivation" (
    "moduleId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "activated" BOOLEAN NOT NULL,

    CONSTRAINT "ModuleActivation_pkey" PRIMARY KEY ("moduleId","guildId")
);

-- CreateEnum
CREATE TYPE "BattleResult" AS ENUM ('win', 'loss');

-- CreateEnum
CREATE TYPE "LogSeverity" AS ENUM ('success', 'info', 'danger', 'warning');

-- CreateTable
CREATE TABLE "trainers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "badge_count" INTEGER NOT NULL,
    "region" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL DEFAULT '',
    "rank" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "pokemon_ids" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battles" (
    "id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "opponent_name" TEXT NOT NULL,
    "team_id" INTEGER NOT NULL,
    "result" "BattleResult" NOT NULL,
    "date" DATE NOT NULL,
    "score_trainer" INTEGER NOT NULL,
    "score_opponent" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_logs" (
    "id" SERIAL NOT NULL,
    "battle_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "LogSeverity" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "battle_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "teams_trainer_id_idx" ON "teams"("trainer_id");

-- CreateIndex
CREATE INDEX "battles_trainer_id_idx" ON "battles"("trainer_id");

-- CreateIndex
CREATE INDEX "battles_team_id_idx" ON "battles"("team_id");

-- CreateIndex
CREATE INDEX "battle_logs_battle_id_idx" ON "battle_logs"("battle_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battles" ADD CONSTRAINT "battles_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battles" ADD CONSTRAINT "battles_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_logs" ADD CONSTRAINT "battle_logs_battle_id_fkey" FOREIGN KEY ("battle_id") REFERENCES "battles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

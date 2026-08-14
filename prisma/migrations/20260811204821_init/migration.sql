/*
  Warnings:

  - You are about to drop the `attendances` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AtendimentoStatus" AS ENUM ('RECEPCAO', 'ENFERMAGEM', 'MEDICO', 'LIBERACAO', 'CANCELADO');

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_personId_fkey";

-- DropTable
DROP TABLE "attendances";

-- DropEnum
DROP TYPE "AttendanceStatus";

-- CreateTable
CREATE TABLE "atendimento" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "status" "AtendimentoStatus" NOT NULL DEFAULT 'RECEPCAO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atendimento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "atendimento" ADD CONSTRAINT "atendimento_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

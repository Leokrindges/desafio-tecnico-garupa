/*
  Warnings:

  - Added the required column `type` to the `transfers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('Entrada', 'Saida');

-- AlterTable
ALTER TABLE "transfers" ADD COLUMN     "type" "Type" NOT NULL;

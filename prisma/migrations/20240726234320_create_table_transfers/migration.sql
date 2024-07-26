-- CreateEnum
CREATE TYPE "StatusTransfer" AS ENUM ('Processing', 'Completed', 'Failed', 'Pending');

-- CreateTable
CREATE TABLE "transfers" (
    "id" UUID NOT NULL,
    "external_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "expected_on" DATE,
    "status" "StatusTransfer" NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

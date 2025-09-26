/*
  Warnings:

  - A unique constraint covering the columns `[tgUserId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicKey]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_tgUserId_key" ON "public"."Users"("tgUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_publicKey_key" ON "public"."Users"("publicKey");

-- CreateIndex
CREATE INDEX "Users_tgUserId_idx" ON "public"."Users"("tgUserId");

-- CreateIndex
CREATE INDEX "Users_publicKey_idx" ON "public"."Users"("publicKey");

/*
  Warnings:

  - The values [ROUND_16,ROUND_8,ROUND_4] on the enum `KnockoutFormat` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KnockoutFormat_new" AS ENUM ('ROUND_OF_16', 'ROUND_OF_8', 'ROUND_OF_4');
ALTER TABLE "Tournament" ALTER COLUMN "knockoutFormat" TYPE "KnockoutFormat_new" USING ("knockoutFormat"::text::"KnockoutFormat_new");
ALTER TYPE "KnockoutFormat" RENAME TO "KnockoutFormat_old";
ALTER TYPE "KnockoutFormat_new" RENAME TO "KnockoutFormat";
DROP TYPE "KnockoutFormat_old";
COMMIT;

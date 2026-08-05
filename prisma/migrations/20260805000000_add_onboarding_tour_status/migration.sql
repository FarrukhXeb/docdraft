-- CreateEnum
CREATE TYPE "OnboardingTourStatus" AS ENUM ('PENDING', 'COMPLETED', 'SKIPPED');

-- AlterTable
ALTER TABLE "user"
ADD COLUMN "onboardingTourStatus" "OnboardingTourStatus" NOT NULL DEFAULT 'PENDING';

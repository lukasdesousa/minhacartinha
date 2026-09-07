ALTER TABLE "letters"
  ADD COLUMN "vouchersEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "loveWheelEnabled" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "love_vouchers" (
  "id" TEXT NOT NULL,
  "letterId" TEXT NOT NULL,
  "title" VARCHAR(80) NOT NULL,
  "description" VARCHAR(180),
  "position" INTEGER NOT NULL,
  "totalUses" INTEGER,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "love_vouchers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "love_vouchers_position_valid" CHECK ("position" >= 0),
  CONSTRAINT "love_vouchers_total_uses_valid" CHECK ("totalUses" IS NULL OR "totalUses" IN (1, 2, 3)),
  CONSTRAINT "love_vouchers_usage_valid" CHECK ("usedCount" >= 0 AND ("totalUses" IS NULL OR "usedCount" <= "totalUses"))
);
CREATE INDEX "love_vouchers_letterId_position_idx" ON "love_vouchers"("letterId", "position");
ALTER TABLE "love_vouchers" ADD CONSTRAINT "love_vouchers_letterId_fkey"
  FOREIGN KEY ("letterId") REFERENCES "letters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "love_wheels" (
  "id" TEXT NOT NULL,
  "letterId" TEXT NOT NULL,
  "usageLimit" INTEGER,
  "spinsUsed" INTEGER NOT NULL DEFAULT 0,
  "removeSelected" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "love_wheels_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "love_wheels_usage_limit_valid" CHECK ("usageLimit" IS NULL OR "usageLimit" > 0),
  CONSTRAINT "love_wheels_spins_used_valid" CHECK ("spinsUsed" >= 0 AND ("usageLimit" IS NULL OR "spinsUsed" <= "usageLimit"))
);
CREATE UNIQUE INDEX "love_wheels_letterId_key" ON "love_wheels"("letterId");
ALTER TABLE "love_wheels" ADD CONSTRAINT "love_wheels_letterId_fkey"
  FOREIGN KEY ("letterId") REFERENCES "letters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "love_wheel_options" (
  "id" TEXT NOT NULL,
  "wheelId" TEXT NOT NULL,
  "title" VARCHAR(80) NOT NULL,
  "description" VARCHAR(180),
  "position" INTEGER NOT NULL,
  CONSTRAINT "love_wheel_options_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "love_wheel_options_position_valid" CHECK ("position" >= 0)
);
CREATE UNIQUE INDEX "love_wheel_options_wheelId_position_key" ON "love_wheel_options"("wheelId", "position");
ALTER TABLE "love_wheel_options" ADD CONSTRAINT "love_wheel_options_wheelId_fkey"
  FOREIGN KEY ("wheelId") REFERENCES "love_wheels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

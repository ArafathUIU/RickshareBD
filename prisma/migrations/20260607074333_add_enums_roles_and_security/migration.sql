/*
  Warnings:

  - Made the column `requesterId` on table `JoinRequest` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `ratedById` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratedUserId` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JoinRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rideId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterRating" REAL NOT NULL DEFAULT 4.5,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JoinRequest_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "RidePost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_JoinRequest" ("createdAt", "id", "message", "requesterId", "requesterName", "requesterRating", "rideId", "status", "updatedAt") SELECT "createdAt", "id", "message", "requesterId", "requesterName", "requesterRating", "rideId", "status", "updatedAt" FROM "JoinRequest";
DROP TABLE "JoinRequest";
ALTER TABLE "new_JoinRequest" RENAME TO "JoinRequest";
CREATE INDEX "JoinRequest_rideId_idx" ON "JoinRequest"("rideId");
CREATE INDEX "JoinRequest_requesterId_idx" ON "JoinRequest"("requesterId");
CREATE TABLE "new_Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rideId" TEXT NOT NULL,
    "ratedById" TEXT NOT NULL,
    "ratedUserId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 5,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rating_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "RidePost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rating_ratedById_fkey" FOREIGN KEY ("ratedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rating_ratedUserId_fkey" FOREIGN KEY ("ratedUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("createdAt", "id", "note", "rideId", "score") SELECT "createdAt", "id", "note", "rideId", "score" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
CREATE INDEX "Rating_ratedUserId_idx" ON "Rating"("ratedUserId");
CREATE UNIQUE INDEX "Rating_rideId_ratedById_key" ON "Rating"("rideId", "ratedById");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 4.5,
    "safetyTag" TEXT NOT NULL DEFAULT 'Phone verified',
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "passwordHash", "rating", "safetyTag", "updatedAt") SELECT "createdAt", "email", "id", "name", "passwordHash", "rating", "safetyTag", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");

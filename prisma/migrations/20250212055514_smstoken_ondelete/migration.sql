-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SMSToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "SMSToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SMSToken" ("createdAt", "id", "token", "updatedAt", "user_id") SELECT "createdAt", "id", "token", "updatedAt", "user_id" FROM "SMSToken";
DROP TABLE "SMSToken";
ALTER TABLE "new_SMSToken" RENAME TO "SMSToken";
CREATE UNIQUE INDEX "SMSToken_token_key" ON "SMSToken"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

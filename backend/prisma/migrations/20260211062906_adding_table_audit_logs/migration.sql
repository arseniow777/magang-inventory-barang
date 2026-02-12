-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'LOGIN', 'LOGOUT', 'ARCHIVE', 'RESET_PASSWORD_REQUEST');

-- CreateTable
CREATE TABLE "AuditLogs" (
    "id" SERIAL NOT NULL,
    "actor_id" INTEGER NOT NULL,
    "actor_role" "Role" NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "description" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

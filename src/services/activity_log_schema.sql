-- ActivityLog / Audit Log Schema for MeanLeap Inventory
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "ActivityLog" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "action" TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
  "entityType" TEXT NOT NULL DEFAULT 'PRODUCT',
  "entityId" TEXT,
  "entityName" TEXT NOT NULL,
  barcode TEXT,
  "userId" TEXT,
  "userEmail" TEXT,
  "userName" TEXT,
  "userRole" TEXT,
  details JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for performant querying
CREATE INDEX IF NOT EXISTS "idx_activity_log_created_at" ON "ActivityLog" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_activity_log_action" ON "ActivityLog" ("action");
CREATE INDEX IF NOT EXISTS "idx_activity_log_entity_id" ON "ActivityLog" ("entityId");

-- Enable Row Level Security (RLS)
ALTER TABLE "ActivityLog" ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read and insert activity logs
DROP POLICY IF EXISTS "Allow authenticated read on ActivityLog" ON "ActivityLog";
CREATE POLICY "Allow authenticated read on ActivityLog" 
  ON "ActivityLog" FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert on ActivityLog" ON "ActivityLog";
CREATE POLICY "Allow authenticated insert on ActivityLog" 
  ON "ActivityLog" FOR INSERT TO authenticated WITH CHECK (true);

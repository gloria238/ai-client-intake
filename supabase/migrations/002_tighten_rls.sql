-- Migration: Tighten RLS policies for public intake flow
-- Removes anon mutation access — server API routes use service role instead

SET search_path TO clientintake;

-- Drop all previously over-permissive anon mutation policies
DROP POLICY IF EXISTS "Allow anon update projects" ON projects;
DROP POLICY IF EXISTS "Allow anon update clarifications" ON clarifications;
DROP POLICY IF EXISTS "Allow anon insert clarifications" ON clarifications;
DROP POLICY IF EXISTS "Allow anon read clarifications" ON clarifications;

-- Re-create anon INSERT for projects (intake form creates projects via server API)
DROP POLICY IF EXISTS "Allow anon insert projects" ON projects;
CREATE POLICY "Allow anon insert projects"
  ON projects FOR INSERT
  TO anon
  WITH CHECK (true);

-- Re-create anon SELECT for projects (result page and admin both need reads)
DROP POLICY IF EXISTS "Allow anon read projects" ON projects;
CREATE POLICY "Allow anon read projects"
  ON projects FOR SELECT
  TO anon
  USING (true);

-- Authenticated users get full access (admin dashboard via Supabase auth)
DROP POLICY IF EXISTS "Allow authenticated full access projects" ON projects;
CREATE POLICY "Allow authenticated full access projects"
  ON projects FOR ALL
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access clarifications" ON clarifications;
CREATE POLICY "Allow authenticated full access clarifications"
  ON clarifications FOR ALL
  TO authenticated
  USING (true);

-- Migration: Create projects and clarifications tables in clientIntake schema

CREATE SCHEMA IF NOT EXISTS clientintake;
SET search_path TO clientintake;

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_input text NOT NULL,
  parsed_output jsonb,
  missing_fields jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending','parsed','clarifying','reviewed','exported','contacted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clarifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text,
  category text,
  optional boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clarifications_project_id ON clarifications(project_id);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE clarifications ENABLE ROW LEVEL SECURITY;

-- Anonymous read/write for intake flow (public-facing)
CREATE POLICY "Allow anon insert projects"
  ON projects FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon read projects"
  ON projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon update projects"
  ON projects FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert clarifications"
  ON clarifications FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon read clarifications"
  ON clarifications FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon update clarifications"
  ON clarifications FOR UPDATE
  TO anon
  USING (true);

-- Authenticated users get full access (admin dashboard)
CREATE POLICY "Allow authenticated full access projects"
  ON projects FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated full access clarifications"
  ON clarifications FOR ALL
  TO authenticated
  USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

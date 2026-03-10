-- ==========================================
-- FIX: Auto-set projects.owner_id on insert
-- Rationale: ensure owner_id matches auth.uid() for RLS policy
-- Applied: 2026-03-10
-- ==========================================

-- Drop existing trigger if re-running
DROP TRIGGER IF EXISTS set_project_owner_id ON public.projects;
DROP FUNCTION IF EXISTS public.set_project_owner_id();

-- Set owner_id from auth.uid() before insert
CREATE OR REPLACE FUNCTION public.set_project_owner_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.owner_id := (SELECT auth.uid());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER set_project_owner_id
    BEFORE INSERT ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.set_project_owner_id();

-- ==========================================
-- FIX: Infinite RLS Recursion on project_members
-- Root cause: "View project members" policy queries project_members
--             from WITHIN a project_members RLS context → 42P17
-- Solution: Replace self-referencing policy with SECURITY DEFINER
--           helper that bypasses RLS, consistent with is_admin_or_owner pattern
-- ==========================================

-- ==========================================
-- FIX: project_members SELECT policy (đệ quy)
-- ==========================================

DROP POLICY IF EXISTS "View project members" ON public.project_members;

-- Tạo helper function SECURITY DEFINER để check membership mà KHÔNG bị RLS chặn
CREATE OR REPLACE FUNCTION public.is_project_member_bypass(p_project_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.project_members
        WHERE project_id = p_project_id
          AND user_id = p_user_id
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

-- Policy mới: dùng helper function thay vì subquery trực tiếp vào bảng
CREATE POLICY "View project members" ON public.project_members
FOR SELECT USING (
    public.is_project_member_bypass(project_id, (SELECT auth.uid()))
);

-- ==========================================
-- FIX: projects SELECT policy cũng bị cùng vấn đề về performance
-- (dùng is_project_member_bypass để nhất quán)
-- ==========================================

DROP POLICY IF EXISTS "Users can view projects they are members of" ON public.projects;

CREATE POLICY "Users can view projects they are members of"
ON public.projects FOR SELECT
USING (
    public.is_project_member_bypass(id, (SELECT auth.uid()))
);

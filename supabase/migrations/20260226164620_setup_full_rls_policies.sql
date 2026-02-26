-- 1. Helper function để kiểm tra xem user có phải là Owner hoặc Admin không
CREATE OR REPLACE FUNCTION public.is_admin_or_owner(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.project_members 
        WHERE project_id = p_id 
        AND user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. POLICIES CHO PROJECT_MEMBERS (Trang 2 PDF)
-- User chỉ được xem thành viên của project mà mình tham gia
CREATE POLICY "View project members" ON public.project_members
FOR SELECT USING (
    project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
);

-- Chỉ Owner/Admin mới được thêm/sửa thành viên
CREATE POLICY "Manage members" ON public.project_members
FOR ALL USING (public.is_admin_or_owner(project_id));

-- Chặn Admin xóa Owner (Trang 3 PDF)
CREATE POLICY "Protect owner from deletion" ON public.project_members
FOR DELETE USING (
    public.is_admin_or_owner(project_id) 
    AND role != 'owner' -- [cite: 39, 67]
);

-- 3. POLICIES CHO TASKS (Theo Matrix trang 1-2 PDF)
-- View: Mọi member trong project
CREATE POLICY "View tasks" ON public.tasks
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.project_members pm 
            JOIN public.board_columns bc ON bc.board_id IN (SELECT id FROM public.boards WHERE project_id = pm.project_id)
            WHERE bc.id = column_id AND pm.user_id = auth.uid())
);

-- Insert/Update: Owner, Admin, Member
CREATE POLICY "Create/Edit tasks" ON public.tasks
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.project_members pm 
            JOIN public.board_columns bc ON bc.board_id IN (SELECT id FROM public.boards WHERE project_id = pm.project_id)
            WHERE bc.id = column_id AND pm.user_id = auth.uid() AND pm.role != 'viewer')
);

-- Delete: Chỉ Creator hoặc Owner/Admin (Trang 2 PDF)
CREATE POLICY "Delete tasks" ON public.tasks
FOR DELETE USING (
    created_by = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.project_members pm 
            JOIN public.board_columns bc ON bc.board_id IN (SELECT id FROM public.boards WHERE project_id = pm.project_id)
            WHERE bc.id = column_id AND pm.user_id = auth.uid() AND pm.role IN ('owner', 'admin'))
);
-- ==========================================
-- Refactoring: Tasks & Dashboard (Robust Architecture)
-- ==========================================

-- 1. Thêm Tùy Chọn Bảng 'sprints'
CREATE TABLE public.sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR DEFAULT 'planned', -- 'planned', 'active', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- 2. ĐẠI PHẪU Bảng `tasks` (Cốt lõi)
-- ==========================================

-- Bước 1: Thêm cột `project_id` vào `tasks` để truy vấn siêu tốc cho Dashboard/Backlog
ALTER TABLE public.tasks
ADD COLUMN project_id UUID;

-- Backfill dữ liệu (Cập nhật project_id cho các task hiện có từ bảng `boards` -> `board_columns`)
UPDATE public.tasks t
SET project_id = b.project_id
FROM public.board_columns bc
JOIN public.boards b ON b.id = bc.board_id
WHERE t.column_id = bc.id;

-- Bây giờ mới ép kiểu NOT NULL cho `project_id` (để mọi Task tương lai đều bắt buộc có)
ALTER TABLE public.tasks
ALTER COLUMN project_id SET NOT NULL;

-- Tạo Foreign Key ràng buộc: Nếu xóa Project, xóa Task (Hợp lý)
ALTER TABLE public.tasks
ADD CONSTRAINT fk_task_project
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Bước 2: Tháo dỡ quả bom hẹn giờ "ON DELETE CASCADE" của cột Column
ALTER TABLE public.tasks
DROP CONSTRAINT tasks_column_id_fkey;

--- Chuyển `column_id` thành cho phép NULL (Task nằm mồ côi ở Backlog)
ALTER TABLE public.tasks
ALTER COLUMN column_id DROP NOT NULL;

-- Thêm lại Foreign Key AN TOÀN ('SET NULL'): Nếu xóa Cột, Task trả về Backlog (id = null) thay vì bị xóa
ALTER TABLE public.tasks
ADD CONSTRAINT tasks_column_id_fkey
FOREIGN KEY (column_id) REFERENCES public.board_columns(id) ON DELETE SET NULL;

-- Bước 3: Thêm các cột cho tính năng Frontend
ALTER TABLE public.tasks
ADD COLUMN tags text[] DEFAULT '{}';

ALTER TABLE public.tasks
ADD COLUMN sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL;

-- ==========================================
-- 3. Tạo bảng `activity_logs` cho Dashboard
-- ==========================================
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Ai thực hiện action
    action_type VARCHAR NOT NULL, -- Ví dụ: 'task_moved', 'task_created', 'task_completed'
    target_id UUID NOT NULL, -- Ví dụ: ID của cái Task
    details JSONB DEFAULT '{}'::jsonb, -- Dữ liệu flexible: { from_column: '...', to_column: '...' }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- 4. Trigger tự động lưu Log khi kéo thả Column (task_moved)
-- ==========================================
CREATE OR REPLACE FUNCTION public.log_task_column_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Chỉ chạy trigger nếu cột thực sự bị thay đổi (Kéo thả)
    IF OLD.column_id IS DISTINCT FROM NEW.column_id THEN
        INSERT INTO public.activity_logs (project_id, user_id, action_type, target_id, details)
        VALUES (
            NEW.project_id,
            -- Lấy ID người đang gọi API hiện tại thông qua hàm auth.uid() của Supabase JWT
            auth.uid(), 
            'task_moved',
            NEW.id,
            jsonb_build_object(
                'task_title', NEW.title,
                'from_column_id', OLD.column_id,
                'to_column_id', NEW.column_id
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_task_column_change
    AFTER UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.log_task_column_change();

-- ==========================================
-- 5. Kích hoạt Bảo Mật RLS cho các bảng mới
-- ==========================================
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 5.1 RLS: Sprints
CREATE POLICY "View sprints" ON public.sprints
FOR SELECT USING (
    project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
);
CREATE POLICY "Manage sprints" ON public.sprints
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.project_members WHERE project_id = sprints.project_id AND user_id = auth.uid() AND role != 'viewer')
);

-- 5.2 RLS: Activity Logs
CREATE POLICY "View activity logs" ON public.activity_logs
FOR SELECT USING (
    project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
);
-- Log chỉ được Insert từ Server/Trigger, không cho phép User tự Insert (Hoặc Insert có kiểm soát chặt)
CREATE POLICY "Insert activity logs" ON public.activity_logs
FOR INSERT WITH CHECK (
    project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
);
-- Không ai được sửa hay xóa log để đảm bảo Audit Trail
CREATE POLICY "Prevent update logs" ON public.activity_logs FOR UPDATE USING (false);
CREATE POLICY "Prevent delete logs" ON public.activity_logs FOR DELETE USING (false);

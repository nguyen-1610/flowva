-- ==========================================
-- 1. ENUMS & TYPES
-- ==========================================
CREATE TYPE project_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- ==========================================
-- 2. CORE TABLES
-- ==========================================

-- Bảng projects [cite: 11, 30]
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id), -- [cite: 8, 23]
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng project_members [cite: 15, 35]
CREATE TABLE public.project_members (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role project_role NOT NULL DEFAULT 'member', -- [cite: 16]
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (project_id, user_id)
);

-- Constraint: Chỉ có duy nhất 1 owner cho mỗi project [cite: 64, 86]
CREATE UNIQUE INDEX idx_unique_owner_per_project 
ON public.project_members (project_id) 
WHERE role = 'owner';

-- Bảng boards [cite: 40]
CREATE TABLE public.boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng board_columns [cite: 43]
CREATE TABLE public.board_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng tasks [cite: 47]
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    column_id UUID NOT NULL REFERENCES public.board_columns(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    priority task_priority DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Các bảng phụ hỗ trợ task [cite: 56]
CREATE TABLE public.task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.task_assignees (
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (task_id, user_id)
);

CREATE TABLE public.task_checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    content VARCHAR NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    position INT NOT NULL DEFAULT 0
);

CREATE TABLE public.task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- 3. FUNCTIONS & TRIGGERS
-- ==========================================

-- Trigger tự động thêm Creator vào project_members với role 'owner' [cite: 24, 73, 85]
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_created
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_project();

-- Helper function kiểm tra role của user trong project [cite: 84]
CREATE OR REPLACE FUNCTION public.get_project_role(p_id UUID)
RETURNS project_role AS $$
    SELECT role FROM public.project_members 
    WHERE project_id = p_id AND user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- ==========================================
-- 4. ENABLE RLS 
-- ==========================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 5. RLS POLICIES (Ví dụ cho bảng projects) [cite: 31, 32, 33, 34]
-- ==========================================

CREATE POLICY "Users can view projects they are members of"
ON public.projects FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = projects.id AND user_id = auth.uid()
));

CREATE POLICY "Users can insert projects"
ON public.projects FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners and Admins can update project info"
ON public.projects FOR UPDATE
USING (public.get_project_role(id) IN ('owner', 'admin'));

CREATE POLICY "Only Owners can delete projects"
ON public.projects FOR DELETE
USING (public.get_project_role(id) = 'owner');

-- (Bạn có thể tiếp tục thêm các Policy cho các bảng khác theo ma trận Permission trong file PDF) [cite: 27, 28]
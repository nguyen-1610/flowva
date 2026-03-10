import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import type { CreateProjectInput, UpdateProjectInput } from '@/shared/types/project';

export class ProjectService {
  /**
   * Tạo một dự án (Project) mới.
   * owner_id được lấy từ session — không để Frontend truyền vào.
   */
  static async create(projectData: CreateProjectInput) {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized: No active session');
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...projectData, owner_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }

    return data;
  }

  /**
   * Cập nhật thông tin dự án.
   */
  static async update(id: string, updateData: UpdateProjectInput) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // PGRST116 = "no rows" → project không tồn tại hoặc RLS từ chối
      if (error.code === 'PGRST116') {
        throw new Error('Project not found or access denied');
      }
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }

    return data;
  }

  /**
   * Xóa dự án.
   */
  static async delete(id: string) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }

    return { success: true };
  }

  /**
   * Lấy thông tin một dự án theo ID.
   */
  static async get(id: string) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('projects')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Project not found or access denied');
      }
      console.error('Error getting project:', error);
      throw new Error('Failed to get project');
    }

    return data;
  }

  /**
   * Lấy danh sách dự án của user hiện tại (RLS tự phân quyền).
   */
  static async getList() {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('projects')
      .select()
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }

    return data;
  }
}

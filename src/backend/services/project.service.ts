import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import { createSupabaseAdminClient } from '@/backend/lib/supabase/admin';
import type { CreateProjectInput, UpdateProjectInput } from '@/shared/types/project';

export class ProjectService {
  /**
   * Tạo một dự án (Project) mới.
   * owner_id được lấy từ session — không để Frontend truyền vào.
   * 
   * NOTE: Uses admin client to bypass RLS due to auth.uid() context issue
   * This is a temporary workaround until we fix the RLS session context
   */
  static async create(projectData: CreateProjectInput) {
    // First, verify user session with regular client
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized: No active session');
    }

    // Debug logging
    console.log('[ProjectService.create] User ID:', user.id);
    console.log('[ProjectService.create] Project data:', projectData);
    console.log('[ProjectService.create] Owner ID to insert:', user.id);

    // Use admin client to bypass RLS for INSERT
    // This is necessary because auth.uid() in RLS context is not working correctly
    const adminClient = createSupabaseAdminClient();

    const { data, error } = await adminClient
      .from('projects')
      .insert([{ ...projectData, owner_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('[ProjectService.create] Error:', error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
    if (!data) throw new Error('Project creation failed');

    console.log('[ProjectService.create] Success! Project created:', data);
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
      throw new Error(`Failed to update project: ${error.message}`);
    }
    
    if (!data) throw new Error('Project not found');

    return data;
  }

  /**
   * Xóa dự án.
   */
  static async delete(id: string): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) throw new Error(`Failed to delete project: ${error.message}`);
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
      throw new Error(`Failed to get project: ${error.message}`);
    }
    
    if (!data) throw new Error('Project not found');

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

    if (error) throw new Error(`Failed to fetch projects: ${error.message}`);

    return data || [];
  }
}

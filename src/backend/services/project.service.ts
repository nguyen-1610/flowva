import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import { Database } from '@/shared/types/database.types';

type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export class ProjectService {
  /**
   * Tạo một dự án (Project) mới
   * Lấy data theo kiểu Insert của Supabase (Bắt buộc phải có name và owner_id)
   */
  static async create(projectData: ProjectInsert) {
    try {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  /**
   * Cập nhật thông tin dự án
   */
  static async update(id: string, updateData: ProjectUpdate) {
    try {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }
  /**
   * Xóa dự án
   */
  static async delete(id: string) {
    try {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await supabase.from('projects').delete().eq('id', id);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }
  /**
   * Lấy thông tin dự án
   */
  static async get(id: string) {
    try {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await supabase.from('projects').select().eq('id', id).single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  /**
   * Lấy danh sách dự án (có RLS phân quyền bảo mật)
   */
  static async getList() {
    try {
      const supabase = await createSupabaseServerClient();

      // Supabase sẽ tự động áp dụng RLS
      const { data, error } = await supabase
        .from('projects')
        .select()
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }
}

import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import { Database } from '@/shared/types/database.types';

type UserRow = Database['public']['Tables']['User']['Row'];

export class AuthService {
  static async getUserById(id: string): Promise<UserRow | null> {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.from('User').select('*').eq('id', id).single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async updateUserProfile(id: string, data: { name?: string; avatarUrl?: string }) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data: updatedUser, error } = await supabase
        .from('User')
        .update({
          name: data.name,
          avatarUrl: data.avatarUrl,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user profile');
    }
  }
}

import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import { Database } from '@/shared/types/database.types';

import { User } from '@supabase/supabase-js';

export class AuthService {
  static async getUserById(id: string): Promise<User | null> {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.auth.admin.getUserById(id);

      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async updateUserProfile(id: string, userData: { name?: string; avatarUrl?: string }) {
    try {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await supabase.auth.admin.updateUserById(id, {
        user_metadata: {
          name: userData.name,
          avatarUrl: userData.avatarUrl,
        },
      });

      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user profile');
    }
  }
}

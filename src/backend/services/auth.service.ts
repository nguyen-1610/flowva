import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import type { Database } from '@/shared/types/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(email: string, password: string) {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Sign up new user with email, password, and name
   */
  static async signup(email: string, password: string, name: string) {
    const supabase = await createSupabaseServerClient();
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Store name in user metadata
      },
    });
    
    if (authError) throw new Error(authError.message);
    
    // Create user profile if user was created
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          name: name || email.split('@')[0],
          email,
        });
        
      // Ignore duplicate key error (user profile might already exist)
      if (profileError && profileError.code !== '23505') {
        console.error('Error creating user profile:', profileError);
        // Don't throw - auth user was created successfully
      }
    }
    
    return authData;
  }

  /**
   * Logout current user
   */
  static async logout() {
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) throw new Error(error.message);
  }

  /**
   * Get user profile by ID
   * Uses user_profiles table instead of admin API
   */
  static async getUserById(id: string): Promise<UserProfile> {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw new Error(`Failed to get user: ${error.message}`);
    if (!data) throw new Error('User not found');
    
    return data;
  }

  /**
   * Update user profile
   * Verifies current user before updating
   */
  static async updateUserProfile(
    id: string, 
    userData: { name?: string; avatar_url?: string }
  ): Promise<UserProfile> {
    const supabase = await createSupabaseServerClient();
    
    // Verify current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== id) {
      throw new Error('Unauthorized: Cannot update other user profiles');
    }
    
    // Update profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(`Failed to update profile: ${error.message}`);
    if (!data) throw new Error('Profile not found');
    
    return data;
  }
}

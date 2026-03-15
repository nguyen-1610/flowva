import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import type { CreateTaskInput, UpdateTaskInput, TaskDTO } from '@/shared/types/task';

export class TaskService {
  /**
   * Create a new task
   * Verifies user has permission to create tasks in the project
   */
  static async create(taskData: CreateTaskInput): Promise<TaskDTO> {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized: No active session');
    
    // Verify user has access to project and can create tasks
    const { data: member } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', taskData.project_id)
      .eq('user_id', user.id)
      .single();
      
    if (!member) {
      throw new Error('Unauthorized: Not a project member');
    }
    
    if (member.role === 'viewer') {
      throw new Error('Unauthorized: Viewers cannot create tasks');
    }
    
    // Create task
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        created_by: user.id,
      })
      .select()
      .single();
      
    if (error) throw new Error(`Failed to create task: ${error.message}`);
    if (!data) throw new Error('Task creation failed');
    
    return data as TaskDTO;
  }
  
  /**
   * Update an existing task
   * Verifies user has permission to edit tasks in the project
   */
  static async update(id: string, updateData: UpdateTaskInput): Promise<TaskDTO> {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized: No active session');
    
    // Get task to verify access
    const task = await this.get(id);
    
    // Verify user can edit
    const { data: member } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', task.project_id)
      .eq('user_id', user.id)
      .single();
      
    if (!member) {
      throw new Error('Unauthorized: Not a project member');
    }
    
    if (member.role === 'viewer') {
      throw new Error('Unauthorized: Viewers cannot edit tasks');
    }
    
    // Update task
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(`Failed to update task: ${error.message}`);
    if (!data) throw new Error('Task not found');
    
    return data as TaskDTO;
  }
  
  /**
   * Delete a task
   * Only creator or admin/owner can delete
   */
  static async delete(id: string): Promise<void> {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized: No active session');
    
    // Get task
    const task = await this.get(id);
    
    // Check if user is creator
    if (task.created_by === user.id) {
      // Creator can always delete
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) throw new Error(`Failed to delete task: ${error.message}`);
      return;
    }
    
    // Check if user is admin or owner
    const { data: member } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', task.project_id)
      .eq('user_id', user.id)
      .single();
      
    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      throw new Error('Unauthorized: Only task creator or project admin/owner can delete tasks');
    }
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
      
    if (error) throw new Error(`Failed to delete task: ${error.message}`);
  }
  
  /**
   * Get a single task by ID
   * RLS policies handle access control
   */
  static async get(id: string): Promise<TaskDTO> {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Task not found or access denied');
      }
      throw new Error(`Failed to get task: ${error.message}`);
    }
    
    if (!data) throw new Error('Task not found');
    
    return data as TaskDTO;
  }
  
  /**
   * Get all tasks for a project
   * RLS policies handle access control
   */
  static async getList(projectId: string): Promise<TaskDTO[]> {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized: No active session');
    
    // Verify user is project member
    const { data: member } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();
      
    if (!member) {
      throw new Error('Unauthorized: Not a project member');
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) throw new Error(`Failed to fetch tasks: ${error.message}`);
    
    return (data || []) as TaskDTO[];
  }
  
  /**
   * Get tasks by column (for Kanban board view)
   * Uses the new composite index for performance
   */
  static async getByColumn(projectId: string, columnId: string): Promise<TaskDTO[]> {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized: No active session');
    
    // Verify user is project member
    const { data: member } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();
      
    if (!member) {
      throw new Error('Unauthorized: Not a project member');
    }
    
    // This query will use idx_tasks_project_column index for fast performance
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('column_id', columnId)
      .order('position', { ascending: true });
      
    if (error) throw new Error(`Failed to fetch tasks: ${error.message}`);
    
    return (data || []) as TaskDTO[];
  }
  
  /**
   * Get backlog tasks (tasks not in any column)
   */
  static async getBacklog(projectId: string): Promise<TaskDTO[]> {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized: No active session');
    
    // Verify user is project member
    const { data: member } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();
      
    if (!member) {
      throw new Error('Unauthorized: Not a project member');
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .is('column_id', null)
      .order('created_at', { ascending: false });
      
    if (error) throw new Error(`Failed to fetch backlog tasks: ${error.message}`);
    
    return (data || []) as TaskDTO[];
  }
}

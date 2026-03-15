import { createSupabaseServerClient } from '@/backend/lib/supabase/server';

export class BoardService {
  /**
   * Get all columns for a project's default board
   */
  static async getColumns(projectId: string) {
    const supabase = await createSupabaseServerClient();
    
    // First, find the default board for this project
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('id')
      .eq('project_id', projectId)
      .limit(1)
      .single();
      
    if (boardError) {
      // If no board exists, return empty columns instead of failing
      if (boardError.code === 'PGRST116') return [];
      throw new Error(`Failed to fetch board: ${boardError.message}`);
    }
    
    // Get columns for this board
    const { data: columns, error: columnsError } = await supabase
      .from('board_columns')
      .select('*')
      .eq('board_id', board.id)
      .order('position', { ascending: true });
      
    if (columnsError) throw new Error(`Failed to fetch columns: ${columnsError.message}`);
    
    return columns || [];
  }
}

export interface BoardDTO {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface BoardColumnDTO {
  id: string;
  board_id: string;
  name: string;
  position: number;
  created_at: string;
}

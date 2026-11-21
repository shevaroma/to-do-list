export type ToDoBase = {
  title: string;
  description?: string | null;
  due_date?: string | null;
  priority?: number | null;
  todo_list_id?: number | null;
};

type ToDo = {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: number | null;
  todo_list_id: number | null;
  is_completed: boolean | null;
  owner_id: number;
  created_at: string;
  updated_at: string;
} & ToDoBase;

export default ToDo;

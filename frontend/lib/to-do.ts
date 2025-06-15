type ToDo = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: number | null;
  todo_list_id: string | null;
  is_completed: boolean | null;
  owner_id: number;
  created_at: string;
  updated_at: string;
};

export default ToDo;

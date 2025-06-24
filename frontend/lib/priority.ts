export const priorityColors: Record<number, string> = {
  1: "bg-red-400",
  2: "bg-yellow-400",
  3: "bg-blue-400",
};

export const getPriorityColor = (priority: number | null) => {
  switch (priority) {
    case 1:
      return "text-red-500";
    case 2:
      return "text-yellow-500";
    default:
      return "text-blue-500";
  }
};

export const getPriorityLabel = (priority: number | null) => {
  switch (priority) {
    case 1:
      return "High";
    case 2:
      return "Medium";
    default:
      return "Low";
  }
};

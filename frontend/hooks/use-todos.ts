import {useEffect, useState} from "react";
import Todo from "@/app/(main)/types/todo";
import {toast} from "sonner";

const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>();
    const [todoError, setTodoError] = useState<string>();
    const getTodos = async () => {
        try {
            const response = await fetch(`/api/to-dos`, {
                headers: {"Content-Type": "application/json"},
            });
            if (!response.ok) {
                setTodos(undefined);
                setTodoError("Something went wrong.");
                return;
            }
            setTodos(await response.json());
            setTodoError(undefined);
        } catch {
            setTodos(undefined);
            setTodoError("No connection.");
        }
    };
    const createTodo = async (todo: Todo) => {
        try {
            const response = await fetch(`/api/to-dos`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(todo),
            });
            if (!response.ok) {
                toast.error("Something went wrong.");
                return;
            }
            await getTodos();
        } catch {
            toast.error("No connection.");
        }
    };
    const updateTodo = async (todo: Todo) => {
        try {
            const response = await fetch(`/api/to-dos`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(todo),
            });
            if (!response.ok) {
                toast.error("Something went wrong.");
                return;
            }
            await getTodos();
        } catch {
            toast.error("No connection.");
        }
    }
    const deleteTodo = async (id: number) => {
        try {
            const response = await fetch(`/api/to-dos`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id}),
            });
            if (!response.ok) {
                toast.error("Something went wrong.");
                return;
            }
            await getTodos();
        } catch {
            toast.error("No connection.");
        }
    };
    useEffect(() => {
        void getTodos();
    }, []);
    return {
        todos,
        todoError,
        createTodo,
        updateTodo,
        deleteTodo,
    };
}

export default useTodos;

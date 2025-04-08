import { useState, useEffect } from "react";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const useTodoModel = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  // 模拟加载初始数据
  useEffect(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setTodos([
        { id: 1, title: "学习React", completed: false },
        { id: 2, title: "学习TypeScript", completed: true },
        { id: 3, title: "创建一个应用", completed: false },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // 添加新待办事项
  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  // 切换待办事项状态
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 删除待办事项
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
};

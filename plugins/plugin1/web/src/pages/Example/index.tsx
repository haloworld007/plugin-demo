import React, { useState } from 'react';
import { Button, Checkbox, Input, Card, Typography, Empty, Spin } from 'antd';
// import { DeleteOutlined } from '@ant-design/icons';
import { useTodoModel, Todo } from '../../models/todoModel';
import styles from './index.less';

const { Title } = Typography;

const ExamplePage: React.FC = () => {
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useTodoModel();
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      addTodo(newTodoTitle.trim());
      setNewTodoTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>待办事项示例</Title>
      
      <Card className={styles.todoList}>
        <Title level={4}>待办事项列表</Title>
        
        <div className={styles.todoHeader}>
          <Input
            className={styles.todoInput}
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onPressEnter={handleKeyPress}
            placeholder="添加新的待办事项"
          />
          <Button type="primary" onClick={handleAddTodo}>
            添加
          </Button>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <Spin />
          </div>
        ) : (
          <div>
            {todos.length === 0 ? (
              <Empty description="没有待办事项" />
            ) : (
              todos.map((todo: Todo) => (
                <div key={todo.id} className={styles.todoItem}>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span
                    className={`${styles.todoItemTitle} ${
                      todo.completed ? styles.todoItemCompleted : ''
                    }`}
                  >
                    {todo.title}
                  </span>
                  <Button
                    type="text"
                    danger
                    className={styles.todoItemDelete}
                    // icon={<DeleteOutlined />}
                    onClick={() => deleteTodo(todo.id)}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamplePage;

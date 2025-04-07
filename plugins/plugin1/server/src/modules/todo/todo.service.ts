import { Injectable, NotFoundException } from "@nestjs/common";
import { Todo } from "./todo.entity";
import { CreateTodoDto, UpdateTodoDto } from "./todo.dto";

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private idCounter = 1;

  constructor() {
    // 初始化一些示例数据
    const now = new Date();
    this.todos = [
      {
        id: this.idCounter++,
        title: "学习 NestJS",
        description: "学习如何使用 NestJS 框架开发后端应用",
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.idCounter++,
        title: "完成插件系统",
        description: "实现动态加载插件的功能",
        completed: true,
        createdAt: new Date(now.getTime() - 86400000), // 一天前
        updatedAt: now,
      },
      {
        id: this.idCounter++,
        title: "编写单元测试",
        description: "为 Todo 模块编写完整的单元测试",
        completed: false,
        createdAt: new Date(now.getTime() - 172800000), // 两天前
        updatedAt: new Date(now.getTime() - 172800000),
      },
    ];
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const now = new Date();
    const todo: Todo = {
      id: this.idCounter++,
      title: createTodoDto.title,
      description: createTodoDto.description || "",
      completed: createTodoDto.completed || false,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.push(todo);
    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const todo = this.findOne(id);

    if (updateTodoDto.title !== undefined) {
      todo.title = updateTodoDto.title;
    }

    if (updateTodoDto.description !== undefined) {
      todo.description = updateTodoDto.description;
    }

    if (updateTodoDto.completed !== undefined) {
      todo.completed = updateTodoDto.completed;
    }

    todo.updatedAt = new Date();
    return todo;
  }

  remove(id: number): void {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    this.todos.splice(index, 1);
  }
}

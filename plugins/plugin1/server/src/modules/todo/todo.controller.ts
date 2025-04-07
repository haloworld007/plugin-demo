import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { CreateTodoDto, UpdateTodoDto } from "./todo.dto";
import { Todo } from "./todo.entity";

@Controller("todos")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Todo {
    return this.todoService.findOne(id);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Todo {
    return this.todoService.create(createTodoDto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto
  ): Todo {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number): void {
    this.todoService.remove(id);
  }
}

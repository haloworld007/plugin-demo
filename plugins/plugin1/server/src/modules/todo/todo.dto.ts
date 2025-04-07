export class CreateTodoDto {
  title: string;
  description?: string;
  completed?: boolean;
}

export class UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

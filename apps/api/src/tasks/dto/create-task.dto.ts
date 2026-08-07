import { IsArray, IsDateString, IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['To Do', 'Doing', 'Completed', 'On Hold', 'Backlog'])
  status?: string;

  @IsOptional()
  @IsEnum(['No Priority', 'Urgent', 'High', 'Medium', 'Low'])
  priority?: string;

  @IsOptional()
  @IsMongoId()
  assignee?: string;

  @IsOptional()
  @IsMongoId()
  project?: string;

  @IsOptional()
  @IsMongoId()
  parentTask?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;
}

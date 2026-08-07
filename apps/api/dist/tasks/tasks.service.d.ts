import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
export declare class TasksService {
    private taskModel;
    constructor(taskModel: Model<Task>);
    create(dto: CreateTaskDto, user: JwtPayload): Promise<Task>;
    findAll(workspaceId: string, query: {
        status?: string;
        project?: string;
        assignee?: string;
        priority?: string;
        search?: string;
    }): Promise<Task[]>;
    findOne(id: string): Promise<Task | null>;
    update(id: string, dto: UpdateTaskDto): Promise<Task | null>;
    remove(id: string): Promise<any>;
    findSubtasks(parentTaskId: string): Promise<Task[]>;
}

import { JwtPayload } from '../auth/jwt-payload.interface';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
declare class FindTasksQuery {
    status?: string;
    project?: string;
    assignee?: string;
    priority?: string;
    search?: string;
}
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(query: FindTasksQuery, user: JwtPayload): Promise<import("./schemas/task.schema").Task[]>;
    findOne(id: string): Promise<import("./schemas/task.schema").Task | null>;
    create(dto: CreateTaskDto, user: JwtPayload): Promise<import("./schemas/task.schema").Task>;
    update(id: string, dto: UpdateTaskDto): Promise<import("./schemas/task.schema").Task | null>;
    updateStatus(id: string, status: string): Promise<import("./schemas/task.schema").Task | null>;
    remove(id: string): Promise<any>;
    getSubtasks(id: string): Promise<import("./schemas/task.schema").Task[]>;
}
export {};

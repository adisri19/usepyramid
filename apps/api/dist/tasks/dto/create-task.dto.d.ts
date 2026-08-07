export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    assignee?: string;
    project?: string;
    parentTask?: string;
    labels?: string[];
    dueDate?: string;
    startDate?: string;
}

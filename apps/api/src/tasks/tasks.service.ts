import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(dto: CreateTaskDto, user: JwtPayload): Promise<Task> {
    const taskData: any = {
      ...dto,
      workspace: new Types.ObjectId(user.workspaceId),
      reporter: new Types.ObjectId(user.sub),
    };

    if (dto.assignee) {
      taskData.assignee = new Types.ObjectId(dto.assignee);
    }
    if (dto.project) {
      taskData.project = new Types.ObjectId(dto.project);
    }
    if (dto.parentTask) {
      taskData.parentTask = new Types.ObjectId(dto.parentTask);
    }
    if (dto.dueDate) {
      taskData.dueDate = new Date(dto.dueDate);
    }
    if (dto.startDate) {
      taskData.startDate = new Date(dto.startDate);
    }

    const task = new this.taskModel(taskData);
    const saved = await task.save();
    return this.findOne(saved.id) as Promise<Task>;
  }

  async findAll(
    workspaceId: string,
    query: { status?: string; project?: string; assignee?: string; priority?: string; search?: string },
  ): Promise<Task[]> {
    const filter: any = {
      workspace: new Types.ObjectId(workspaceId),
    };

    if (query.status) {
      filter.status = query.status;
    }
    if (query.project) {
      filter.project = new Types.ObjectId(query.project);
    }
    if (query.assignee) {
      filter.assignee = new Types.ObjectId(query.assignee);
    }
    if (query.priority) {
      filter.priority = query.priority;
    }
    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    return this.taskModel
      .find(filter)
      .populate('assignee')
      .populate('reporter')
      .populate('project')
      .exec();
  }

  async findOne(id: string): Promise<Task | null> {
    return this.taskModel
      .findById(id)
      .populate('assignee')
      .populate('reporter')
      .populate('project')
      .exec();
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task | null> {
    const updateData: any = { ...dto };
    const unsets: any = {};

    if (dto.assignee) {
      updateData.assignee = new Types.ObjectId(dto.assignee);
    } else if (dto.assignee === null) {
      unsets.assignee = '';
      delete updateData.assignee;
    }

    if (dto.project) {
      updateData.project = new Types.ObjectId(dto.project);
    } else if (dto.project === null) {
      unsets.project = '';
      delete updateData.project;
    }

    if (dto.parentTask) {
      updateData.parentTask = new Types.ObjectId(dto.parentTask);
    } else if (dto.parentTask === null) {
      unsets.parentTask = '';
      delete updateData.parentTask;
    }

    if (dto.dueDate) {
      updateData.dueDate = new Date(dto.dueDate);
    } else if (dto.dueDate === null) {
      unsets.dueDate = '';
      delete updateData.dueDate;
    }

    if (dto.startDate) {
      updateData.startDate = new Date(dto.startDate);
    } else if (dto.startDate === null) {
      unsets.startDate = '';
      delete updateData.startDate;
    }

    const updateQuery: any = { $set: updateData };
    if (Object.keys(unsets).length > 0) {
      updateQuery.$unset = unsets;
    }

    const updated = await this.taskModel
      .findByIdAndUpdate(id, updateQuery, { new: true })
      .populate('assignee')
      .populate('reporter')
      .populate('project')
      .exec();

    if (!updated) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return updated;
  }

  async remove(id: string): Promise<any> {
    return this.taskModel.findByIdAndDelete(id).exec();
  }

  async findSubtasks(parentTaskId: string): Promise<Task[]> {
    return this.taskModel
      .find({ parentTask: new Types.ObjectId(parentTaskId) })
      .populate('assignee')
      .populate('reporter')
      .populate('project')
      .exec();
  }
}

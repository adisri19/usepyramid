import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './schemas/task.schema';
import { Project } from '../projects/schemas/project.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

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
    user?: JwtPayload,
  ): Promise<Task[]> {
    const wsId = new Types.ObjectId(workspaceId);

    // If workspace is completely empty, auto-seed with Figma sample data
    const count = await this.taskModel.countDocuments({ workspace: wsId }).exec();
    if (count === 0 && !query.search && !query.status && !query.project) {
      await this.seedWorkspace(workspaceId, user?.sub);
    }

    const filter: any = {
      workspace: wsId,
      parentTask: { $exists: false }, // Only top-level tasks on board/list
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

  async seedWorkspace(workspaceId: string, userId?: string) {
    const wsId = new Types.ObjectId(workspaceId);
    const uId = userId ? new Types.ObjectId(userId) : undefined;

    // 1. Create Sample Projects
    let webProj = await this.projectModel.findOne({ workspace: wsId, name: 'Web Platform' });
    if (!webProj) {
      webProj = await new this.projectModel({
        name: 'Web Platform',
        priority: 'High',
        workspace: wsId,
        lead: uId,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }).save();
    }

    let designProj = await this.projectModel.findOne({ workspace: wsId, name: 'Design System' });
    if (!designProj) {
      designProj = await new this.projectModel({
        name: 'Design System',
        priority: 'Medium',
        workspace: wsId,
        lead: uId,
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      }).save();
    }

    let mobileProj = await this.projectModel.findOne({ workspace: wsId, name: 'Mobile App' });
    if (!mobileProj) {
      mobileProj = await new this.projectModel({
        name: 'Mobile App',
        priority: 'Urgent',
        workspace: wsId,
        lead: uId,
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      }).save();
    }

    // 2. Create Sample Tasks
    const sampleTasks = [
      // To Do
      {
        title: 'Design Homepage & Hero Section',
        description: 'Create the initial wireframe and responsive layout mockups for the landing hero.',
        status: 'To Do',
        priority: 'High',
        labels: ['Design', 'UI'],
        workspace: wsId,
        project: webProj._id,
        assignee: uId,
        reporter: uId,
        dueDate: new Date('2026-09-12'),
      },
      {
        title: 'User Interview Synthesis',
        description: 'Summarize feedback from the 5 customer discovery calls conducted this week.',
        status: 'To Do',
        priority: 'Medium',
        labels: ['Research', 'Product'],
        workspace: wsId,
        project: mobileProj._id,
        assignee: uId,
        reporter: uId,
        dueDate: new Date('2026-09-18'),
      },
      {
        title: 'Create Onboarding Tour Flow',
        description: 'Map out step-by-step interactive tooltip tour for first-time workspace creators.',
        status: 'To Do',
        priority: 'Low',
        labels: ['UX'],
        workspace: wsId,
        project: designProj._id,
        assignee: uId,
        reporter: uId,
        dueDate: new Date('2026-09-25'),
      },
      // Doing
      {
        title: 'Implement Authentication Flow',
        description: 'Complete JWT session cookies and OAuth redirect callbacks with server verification.',
        status: 'Doing',
        priority: 'Urgent',
        labels: ['Backend', 'Security'],
        workspace: wsId,
        project: webProj._id,
        assignee: uId,
        reporter: uId,
        dueDate: new Date('2026-09-10'),
      },
      {
        title: 'Research Competitors & Feature Matrix',
        description: 'Analyze Linear, Jira, and Asana for kanban interaction patterns and shortcut conventions.',
        status: 'Doing',
        priority: 'Medium',
        labels: ['Research'],
        workspace: wsId,
        project: webProj._id,
        assignee: uId,
        reporter: uId,
        dueDate: new Date('2026-09-15'),
      },
      // Completed
      {
        title: 'Setup Monorepo & CI/CD Pipeline',
        description: 'Configure npm workspaces for @pyramid/web and @pyramid/api with TypeScript checks.',
        status: 'Completed',
        priority: 'Low',
        labels: ['DevOps'],
        workspace: wsId,
        project: webProj._id,
        assignee: uId,
        reporter: uId,
        dueDate: new Date('2026-09-05'),
      },
      {
        title: 'Design System Token Export',
        description: 'Sync Figma variable tokens with Tailwind CSS v4 custom theme properties.',
        status: 'Completed',
        priority: 'Medium',
        labels: ['Design System'],
        workspace: wsId,
        project: designProj._id,
        assignee: uId,
        reporter: uId,
        dueDate: new Date('2026-09-02'),
      },
      // On Hold
      {
        title: 'Fix Safari Drag Drop Glitch',
        description: 'Address pointer sensor offset bug on older iOS mobile safari WebKit versions.',
        status: 'On Hold',
        priority: 'Medium',
        labels: ['Bug', 'Frontend'],
        workspace: wsId,
        project: webProj._id,
        assignee: uId,
        reporter: uId,
        dueDate: new Date('2026-09-20'),
      },
    ];

    for (const taskData of sampleTasks) {
      const task = await new this.taskModel(taskData).save();

      // Add subtasks for Design Homepage
      if (task.title.includes('Design Homepage')) {
        await new this.taskModel({
          title: 'Wireframe responsive layout',
          status: 'Completed',
          parentTask: task._id,
          workspace: wsId,
        }).save();
        await new this.taskModel({
          title: 'Review typography hierarchy',
          status: 'To Do',
          parentTask: task._id,
          workspace: wsId,
        }).save();
        await new this.taskModel({
          title: 'Export icon assets in SVG format',
          status: 'To Do',
          parentTask: task._id,
          workspace: wsId,
        }).save();
      }
    }
  }
}

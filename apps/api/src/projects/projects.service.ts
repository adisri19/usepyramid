import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(data: any): Promise<Project> {
    const projectData: any = {
      ...data,
      workspace: new Types.ObjectId(data.workspace),
    };
    if (data.lead) {
      projectData.lead = new Types.ObjectId(data.lead.toString());
    }
    const project = new this.projectModel(projectData);
    return project.save();
  }

  async findAll(workspaceId: string): Promise<Project[]> {
    const wsId = new Types.ObjectId(workspaceId);
    let projects = await this.projectModel
      .find({ workspace: wsId })
      .populate('lead')
      .exec();

    if (projects.length === 0) {
      await new this.projectModel({
        name: 'Web Platform',
        priority: 'High',
        workspace: wsId,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }).save();
      await new this.projectModel({
        name: 'Design System',
        priority: 'Medium',
        workspace: wsId,
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      }).save();
      await new this.projectModel({
        name: 'Mobile App',
        priority: 'Urgent',
        workspace: wsId,
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      }).save();

      projects = await this.projectModel
        .find({ workspace: wsId })
        .populate('lead')
        .exec();
    }

    return projects;
  }

  async findOne(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).populate('lead').exec();
  }
}

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
    return this.projectModel
      .find({ workspace: new Types.ObjectId(workspaceId) })
      .populate('lead')
      .exec();
  }

  async findOne(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).populate('lead').exec();
  }
}

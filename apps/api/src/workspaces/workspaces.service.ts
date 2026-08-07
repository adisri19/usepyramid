import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workspace } from './schemas/workspace.schema';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
  ) {}

  async create(name: string, ownerId: string): Promise<Workspace> {
    const workspace = new this.workspaceModel({
      name,
      ownerId,
    });
    return workspace.save();
  }

  async findByOwner(ownerId: string): Promise<Workspace[]> {
    return this.workspaceModel.find({ ownerId }).exec();
  }

  async findOne(id: string): Promise<Workspace | null> {
    return this.workspaceModel.findById(id).exec();
  }

  async delete(id: string): Promise<any> {
    return this.workspaceModel.findByIdAndDelete(id).exec();
  }
}

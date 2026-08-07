import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(taskId: string, userId: string, body: string): Promise<Comment> {
    const comment = new this.commentModel({
      task: new Types.ObjectId(taskId),
      author: new Types.ObjectId(userId),
      body,
    });
    const saved = await comment.save();
    return saved.populate('author');
  }

  async findByTask(taskId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ task: new Types.ObjectId(taskId) })
      .populate('author')
      .sort({ createdAt: 1 }) // Chronological order
      .exec();
  }
}

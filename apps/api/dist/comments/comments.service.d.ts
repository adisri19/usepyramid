import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
export declare class CommentsService {
    private commentModel;
    constructor(commentModel: Model<Comment>);
    create(taskId: string, userId: string, body: string): Promise<Comment>;
    findByTask(taskId: string): Promise<Comment[]>;
}

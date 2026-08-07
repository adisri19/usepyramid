import { JwtPayload } from '../auth/jwt-payload.interface';
import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    getComments(taskId: string): Promise<import("./schemas/comment.schema").Comment[]>;
    addComment(taskId: string, user: JwtPayload, body: string): Promise<import("./schemas/comment.schema").Comment>;
}

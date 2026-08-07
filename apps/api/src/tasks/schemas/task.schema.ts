import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: ['To Do', 'Doing', 'Completed', 'On Hold', 'Backlog'], default: 'To Do' })
  status: string;

  @Prop({ enum: ['No Priority', 'Urgent', 'High', 'Medium', 'Low'], default: 'No Priority' })
  priority: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignee?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reporter?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspace: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  parentTask?: Types.ObjectId; // for subtasks

  @Prop([String])
  labels: string[];

  @Prop()
  dueDate?: Date;

  @Prop()
  startDate?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret: any) => {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_, ret: any) => {
      ret.id = ret._id.toString();
      return ret;
    },
  },
})
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['No Priority', 'Urgent', 'High', 'Medium', 'Low'], default: 'No Priority' })
  priority: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  lead?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspace: Types.ObjectId;

  @Prop()
  dueDate?: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  email?: string;

  @Prop()
  fullName?: string;

  @Prop()
  title?: string;

  @Prop()
  username?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ default: false })
  isGuest: boolean;

  @Prop({ enum: ['google', 'guest'], default: 'guest' })
  provider: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

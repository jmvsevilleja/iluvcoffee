import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Event {
  @Prop()
  id: number;

  @Prop()
  type: string;

  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ id: 1, type:-1 });
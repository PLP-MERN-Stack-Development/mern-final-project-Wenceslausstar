import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

export enum AppointmentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  CHECKUP = 'checkup',
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ required: true })
  duration: number; // in minutes

  @Prop({
    type: String,
    enum: AppointmentType,
    default: AppointmentType.CONSULTATION,
  })
  type: AppointmentType;

  @Prop({
    type: String,
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Prop()
  symptoms?: string;

  @Prop()
  notes?: string;

  @Prop()
  diagnosis?: string;

  @Prop()
  prescription?: string;

  @Prop()
  meetingLink?: string; // For video consultations

  @Prop()
  cancellationReason?: string;

  @Prop({ default: false })
  isEmergency: boolean;

  @Prop()
  followUpDate?: Date;

  @Prop({ type: Object })
  metadata?: {
    createdBy?: string;
    updatedBy?: string;
    source?: string; // web, mobile, etc.
  };
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// Add indexes for better query performance
AppointmentSchema.index({ patientId: 1, appointmentDate: -1 });
AppointmentSchema.index({ doctorId: 1, appointmentDate: -1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ appointmentDate: 1 });

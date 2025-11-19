import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PrescriptionDocument = Prescription & Document;

export enum PrescriptionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class Prescription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Appointment' })
  appointmentId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MedicalRecord' })
  medicalRecordId?: Types.ObjectId;

  @Prop({ required: true })
  prescriptionNumber: string; // Unique prescription identifier

  @Prop({
    type: [
      {
        medicationName: { type: String, required: true },
        genericName: String,
        strength: String,
        dosage: { type: String, required: true }, // e.g., "500mg"
        frequency: { type: String, required: true }, // e.g., "twice daily"
        duration: { type: String, required: true }, // e.g., "7 days"
        quantity: { type: Number, required: true },
        instructions: String,
        refills: { type: Number, default: 0 },
      },
    ],
    required: true,
  })
  medications: Array<{
    medicationName: string;
    genericName?: string;
    strength?: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions?: string;
    refills: number;
  }>;

  @Prop()
  diagnosis?: string;

  @Prop()
  notes?: string;

  @Prop({
    type: String,
    enum: PrescriptionStatus,
    default: PrescriptionStatus.ACTIVE,
  })
  status: PrescriptionStatus;

  @Prop({ required: true })
  issueDate: Date;

  @Prop()
  expiryDate?: Date;

  @Prop({ type: [String] })
  allergies?: string[];

  @Prop({ type: Object })
  pharmacy?: {
    name?: string;
    address?: string;
    phone?: string;
  };

  @Prop()
  pdfUrl?: string; // URL to generated PDF

  @Prop({ type: Object })
  metadata?: {
    createdBy?: string;
    updatedBy?: string;
    source?: string;
  };
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);

// Add indexes for better query performance
PrescriptionSchema.index({ patientId: 1, createdAt: -1 });
PrescriptionSchema.index({ doctorId: 1, createdAt: -1 });
PrescriptionSchema.index({ prescriptionNumber: 1 }, { unique: true });
PrescriptionSchema.index({ status: 1 });
PrescriptionSchema.index({ expiryDate: 1 });

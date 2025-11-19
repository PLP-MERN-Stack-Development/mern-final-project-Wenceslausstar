import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MedicalRecordDocument = MedicalRecord & Document;

export enum VitalSigns {
  BLOOD_PRESSURE = 'blood_pressure',
  HEART_RATE = 'heart_rate',
  TEMPERATURE = 'temperature',
  WEIGHT = 'weight',
  HEIGHT = 'height',
  BMI = 'bmi',
  OXYGEN_SATURATION = 'oxygen_saturation',
}

export enum RecordType {
  CONSULTATION = 'consultation',
  DIAGNOSIS = 'diagnosis',
  TREATMENT = 'treatment',
  TEST_RESULTS = 'test_results',
  VITAL_SIGNS = 'vital_signs',
  ALLERGY = 'allergy',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
}

@Schema({ timestamps: true })
export class MedicalRecord {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Appointment' })
  appointmentId?: Types.ObjectId;

  @Prop({ type: String, enum: RecordType, required: true })
  type: RecordType;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  symptoms?: string[];

  @Prop()
  diagnosis?: string;

  @Prop()
  treatment?: string;

  @Prop()
  notes?: string;

  @Prop({ type: Object })
  vitalSigns?: {
    [VitalSigns.BLOOD_PRESSURE]?: string; // e.g., "120/80"
    [VitalSigns.HEART_RATE]?: number; // bpm
    [VitalSigns.TEMPERATURE]?: number; // celsius
    [VitalSigns.WEIGHT]?: number; // kg
    [VitalSigns.HEIGHT]?: number; // cm
    [VitalSigns.BMI]?: number;
    [VitalSigns.OXYGEN_SATURATION]?: number; // percentage
  };

  @Prop({ type: [String] })
  attachments?: string[]; // file URLs

  @Prop({ type: Object })
  testResults?: {
    testName?: string;
    result?: string;
    normalRange?: string;
    unit?: string;
    date?: Date;
  };

  @Prop({ type: Object })
  medications?: {
    name?: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  };

  @Prop({ default: false })
  isConfidential: boolean;

  @Prop({ type: Object })
  metadata?: {
    createdBy?: string;
    updatedBy?: string;
    source?: string;
    tags?: string[];
  };
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);

// Add indexes for better query performance
MedicalRecordSchema.index({ patientId: 1, createdAt: -1 });
MedicalRecordSchema.index({ doctorId: 1, createdAt: -1 });
MedicalRecordSchema.index({ appointmentId: 1 });
MedicalRecordSchema.index({ type: 1 });

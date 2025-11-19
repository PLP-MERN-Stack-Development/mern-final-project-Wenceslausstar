import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicalRecord,
  MedicalRecordSchema,
} from './schemas/medical-record.schema';
import {
  Prescription,
  PrescriptionSchema,
} from './schemas/prescription.schema';
import { EmrService } from './emr.service';
import { EmrController } from './emr.controller';
import { PdfService } from './pdf.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
    ]),
  ],
  providers: [EmrService, PdfService],
  controllers: [EmrController],
  exports: [MongooseModule, EmrService],
})
export class EmrModule {}

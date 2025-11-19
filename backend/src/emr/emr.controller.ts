import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { EmrService } from './emr.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { PrescriptionStatus } from './schemas/prescription.schema';

@Controller('emr')
@UseGuards(JwtAuthGuard)
export class EmrController {
  constructor(private readonly emrService: EmrService) {}

  // Medical Records Endpoints
  @Post('records')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  async createMedicalRecord(@Body() createData: any, @Request() req) {
    return this.emrService.createMedicalRecord({
      ...createData,
      doctorId: req.user.id,
    });
  }

  @Get('records')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async findAllMedicalRecords() {
    return this.emrService.findAllMedicalRecords();
  }

  @Get('records/my-patients')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  async getMyPatientsRecords(@Request() req) {
    return this.emrService.findMedicalRecordsByDoctor(req.user.id);
  }

  @Get('records/my-records')
  async getMyMedicalRecords(@Request() req) {
    return this.emrService.findMedicalRecordsByPatient(req.user.id);
  }

  @Get('records/:id')
  async findMedicalRecord(@Param('id') id: string, @Request() req) {
    const record = await this.emrService.findMedicalRecordById(id);

    // Check permissions
    const { role, id: userId } = req.user;
    if (role === UserRole.PATIENT && record.patientId.toString() !== userId) {
      throw new Error('Access denied');
    }
    if (
      role === UserRole.DOCTOR &&
      record.doctorId.toString() !== userId &&
      record.patientId.toString() !== userId
    ) {
      throw new Error('Access denied');
    }

    return record;
  }

  @Put('records/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  async updateMedicalRecord(
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req,
  ) {
    const record = await this.emrService.findMedicalRecordById(id);

    // Check if doctor owns this record
    if (record.doctorId.toString() !== req.user.id) {
      throw new Error('Access denied');
    }

    return this.emrService.updateMedicalRecord(id, updateData);
  }

  @Delete('records/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async deleteMedicalRecord(@Param('id') id: string, @Request() req) {
    const record = await this.emrService.findMedicalRecordById(id);

    // Check permissions
    const { role, id: userId } = req.user;
    if (role === UserRole.DOCTOR && record.doctorId.toString() !== userId) {
      throw new Error('Access denied');
    }

    await this.emrService.deleteMedicalRecord(id);
    return { message: 'Medical record deleted successfully' };
  }

  // Prescription Endpoints
  @Post('prescriptions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  async createPrescription(@Body() createData: any, @Request() req) {
    return this.emrService.createPrescription({
      ...createData,
      doctorId: req.user.id,
    });
  }

  @Get('prescriptions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async findAllPrescriptions() {
    return this.emrService.findAllPrescriptions();
  }

  @Get('prescriptions/my-prescriptions')
  async getMyPrescriptions(@Request() req) {
    const { role, id } = req.user;

    if (role === UserRole.DOCTOR) {
      return this.emrService.findPrescriptionsByDoctor(id);
    } else {
      return this.emrService.findPrescriptionsByPatient(id);
    }
  }

  @Get('prescriptions/:id')
  async findPrescription(@Param('id') id: string, @Request() req) {
    const prescription = await this.emrService.findPrescriptionById(id);

    // Check permissions
    const { role, id: userId } = req.user;
    if (
      role === UserRole.PATIENT &&
      prescription.patientId.toString() !== userId
    ) {
      throw new Error('Access denied');
    }
    if (
      role === UserRole.DOCTOR &&
      prescription.doctorId.toString() !== userId
    ) {
      throw new Error('Access denied');
    }

    return prescription;
  }

  @Put('prescriptions/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  async updatePrescription(
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req,
  ) {
    const prescription = await this.emrService.findPrescriptionById(id);

    // Check if doctor owns this prescription
    if (prescription.doctorId.toString() !== req.user.id) {
      throw new Error('Access denied');
    }

    return this.emrService.updatePrescription(id, updateData);
  }

  @Put('prescriptions/:id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  async updatePrescriptionStatus(
    @Param('id') id: string,
    @Body() body: { status: PrescriptionStatus },
    @Request() req,
  ) {
    const prescription = await this.emrService.findPrescriptionById(id);

    // Check permissions
    const { role, id: userId } = req.user;
    if (
      role === UserRole.DOCTOR &&
      prescription.doctorId.toString() !== userId
    ) {
      throw new Error('Access denied');
    }

    return this.emrService.updatePrescriptionStatus(id, body.status);
  }

  @Delete('prescriptions/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async deletePrescription(@Param('id') id: string, @Request() req) {
    const prescription = await this.emrService.findPrescriptionById(id);

    // Check permissions
    const { role, id: userId } = req.user;
    if (
      role === UserRole.DOCTOR &&
      prescription.doctorId.toString() !== userId
    ) {
      throw new Error('Access denied');
    }

    await this.emrService.deletePrescription(id);
    return { message: 'Prescription deleted successfully' };
  }

  // Patient History and Summary
  @Get('patients/:patientId/history')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  async getPatientHistory(@Param('patientId') patientId: string) {
    return this.emrService.getPatientMedicalHistory(patientId);
  }

  @Get('patients/:patientId/summary')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  async getPatientSummary(@Param('patientId') patientId: string) {
    return this.emrService.getPatientSummary(patientId);
  }

  @Get('my-history')
  async getMyHistory(@Request() req) {
    return this.emrService.getPatientMedicalHistory(req.user.id);
  }

  @Get('my-summary')
  async getMySummary(@Request() req) {
    return this.emrService.getPatientSummary(req.user.id);
  }

  // PDF Download Endpoints
  @Get('prescriptions/:id/pdf')
  async downloadPrescriptionPdf(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const prescription = await this.emrService.findPrescriptionById(id);

    // Check permissions
    const { role, id: userId } = req.user;
    if (
      role === UserRole.PATIENT &&
      prescription.patientId.toString() !== userId
    ) {
      throw new Error('Access denied');
    }
    if (
      role === UserRole.DOCTOR &&
      prescription.doctorId.toString() !== userId
    ) {
      throw new Error('Access denied');
    }

    const pdfBuffer = await this.emrService.generatePrescriptionPdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=prescription-${prescription.prescriptionNumber}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  @Get('records/:id/pdf')
  async downloadMedicalRecordPdf(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const record = await this.emrService.findMedicalRecordById(id);

    // Check permissions
    const { role, id: userId } = req.user;
    if (role === UserRole.PATIENT && record.patientId.toString() !== userId) {
      throw new Error('Access denied');
    }
    if (
      role === UserRole.DOCTOR &&
      record.doctorId.toString() !== userId &&
      record.patientId.toString() !== userId
    ) {
      throw new Error('Access denied');
    }

    const pdfBuffer = await this.emrService.generateMedicalRecordPdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=medical-record-${record._id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }
}

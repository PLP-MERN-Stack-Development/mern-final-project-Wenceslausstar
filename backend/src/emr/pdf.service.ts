import { Injectable } from '@nestjs/common';
import * as PDFKit from 'pdfkit';
import { PrescriptionDocument } from './schemas/prescription.schema';

@Injectable()
export class PdfService {
  async generatePrescriptionPdf(
    prescription: PrescriptionDocument,
  ): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFKit();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // PDF Header
      doc.fontSize(20).text('PRESCRIPTION', { align: 'center' });
      doc.moveDown();

      // Prescription Details
      doc.fontSize(12);
      doc.text(`Prescription Number: ${prescription.prescriptionNumber}`);
      doc.text(`Issue Date: ${prescription.issueDate.toLocaleDateString()}`);
      if (prescription.expiryDate) {
        doc.text(
          `Expiry Date: ${prescription.expiryDate.toLocaleDateString()}`,
        );
      }
      doc.moveDown();

      // Patient Information
      doc.fontSize(14).text('Patient Information:', { underline: true });
      doc.fontSize(12);
      doc.text(
        `Name: ${prescription.patientId['firstName']} ${prescription.patientId['lastName']}`,
      );
      doc.text(`Email: ${prescription.patientId['email']}`);
      if (prescription.patientId['phoneNumber']) {
        doc.text(`Phone: ${prescription.patientId['phoneNumber']}`);
      }
      if (prescription.patientId['dateOfBirth']) {
        doc.text(
          `Date of Birth: ${new Date(prescription.patientId['dateOfBirth']).toLocaleDateString()}`,
        );
      }
      doc.moveDown();

      // Doctor Information
      doc.fontSize(14).text('Prescribed By:', { underline: true });
      doc.fontSize(12);
      doc.text(
        `Dr. ${prescription.doctorId['firstName']} ${prescription.doctorId['lastName']}`,
      );
      doc.text(
        `Specialization: ${prescription.doctorId['specialization'] || 'N/A'}`,
      );
      if (prescription.doctorId['licenseNumber']) {
        doc.text(`License Number: ${prescription.doctorId['licenseNumber']}`);
      }
      doc.moveDown();

      // Diagnosis
      if (prescription.diagnosis) {
        doc.fontSize(14).text('Diagnosis:', { underline: true });
        doc.fontSize(12).text(prescription.diagnosis);
        doc.moveDown();
      }

      // Medications
      doc.fontSize(14).text('Medications:', { underline: true });
      doc.moveDown(0.5);

      prescription.medications.forEach((medication, index) => {
        doc.fontSize(12);
        doc.text(`${index + 1}. ${medication.medicationName}`);
        if (medication.genericName) {
          doc.text(`   Generic: ${medication.genericName}`);
        }
        if (medication.strength) {
          doc.text(`   Strength: ${medication.strength}`);
        }
        doc.text(`   Dosage: ${medication.dosage}`);
        doc.text(`   Frequency: ${medication.frequency}`);
        doc.text(`   Duration: ${medication.duration}`);
        doc.text(`   Quantity: ${medication.quantity}`);
        if (medication.instructions) {
          doc.text(`   Instructions: ${medication.instructions}`);
        }
        if (medication.refills > 0) {
          doc.text(`   Refills: ${medication.refills}`);
        }
        doc.moveDown();
      });

      // Notes
      if (prescription.notes) {
        doc.fontSize(14).text('Additional Notes:', { underline: true });
        doc.fontSize(12).text(prescription.notes);
        doc.moveDown();
      }

      // Allergies
      if (prescription.allergies && prescription.allergies.length > 0) {
        doc.fontSize(14).text('Known Allergies:', { underline: true });
        doc.fontSize(12).text(prescription.allergies.join(', '));
        doc.moveDown();
      }

      // Pharmacy Information
      if (prescription.pharmacy) {
        doc.fontSize(14).text('Pharmacy Information:', { underline: true });
        doc.fontSize(12);
        if (prescription.pharmacy.name) {
          doc.text(`Name: ${prescription.pharmacy.name}`);
        }
        if (prescription.pharmacy.address) {
          doc.text(`Address: ${prescription.pharmacy.address}`);
        }
        if (prescription.pharmacy.phone) {
          doc.text(`Phone: ${prescription.pharmacy.phone}`);
        }
        doc.moveDown();
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(10);
      doc.text(
        'This prescription is electronically generated and valid only when presented with proper identification.',
        { align: 'center' },
      );
      doc.text(`Generated on: ${new Date().toLocaleString()}`, {
        align: 'center',
      });

      // Doctor Signature
      doc.moveDown(2);
      doc.text('_______________________________', { align: 'right' });
      doc.text("Doctor's Signature", { align: 'right' });

      doc.end();
    });
  }

  async generateMedicalRecordPdf(record: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFKit();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // PDF Header
      doc.fontSize(20).text('MEDICAL RECORD', { align: 'center' });
      doc.moveDown();

      // Record Details
      doc.fontSize(12);
      doc.text(`Record Type: ${record.type.toUpperCase()}`);
      doc.text(`Date: ${record.createdAt.toLocaleDateString()}`);
      doc.moveDown();

      // Patient Information
      doc.fontSize(14).text('Patient Information:', { underline: true });
      doc.fontSize(12);
      doc.text(
        `Name: ${record.patientId.firstName} ${record.patientId.lastName}`,
      );
      doc.text(`Email: ${record.patientId.email}`);
      doc.moveDown();

      // Doctor Information
      doc.fontSize(14).text('Attending Physician:', { underline: true });
      doc.fontSize(12);
      doc.text(`Dr. ${record.doctorId.firstName} ${record.doctorId.lastName}`);
      doc.text(`Specialization: ${record.doctorId.specialization || 'N/A'}`);
      doc.moveDown();

      // Record Content
      doc.fontSize(14).text('Medical Record Details:', { underline: true });
      doc.fontSize(12);

      if (record.title) {
        doc.text(`Title: ${record.title}`);
      }

      if (record.description) {
        doc.text(`Description: ${record.description}`);
      }

      if (record.symptoms && record.symptoms.length > 0) {
        doc.text(`Symptoms: ${record.symptoms.join(', ')}`);
      }

      if (record.diagnosis) {
        doc.text(`Diagnosis: ${record.diagnosis}`);
      }

      if (record.treatment) {
        doc.text(`Treatment: ${record.treatment}`);
      }

      if (record.vitalSigns) {
        doc.text('Vital Signs:');
        const vitals = record.vitalSigns;
        if (vitals.blood_pressure)
          doc.text(`  Blood Pressure: ${vitals.blood_pressure}`);
        if (vitals.heart_rate)
          doc.text(`  Heart Rate: ${vitals.heart_rate} bpm`);
        if (vitals.temperature)
          doc.text(`  Temperature: ${vitals.temperature}°C`);
        if (vitals.weight) doc.text(`  Weight: ${vitals.weight} kg`);
        if (vitals.height) doc.text(`  Height: ${vitals.height} cm`);
        if (vitals.bmi) doc.text(`  BMI: ${vitals.bmi}`);
        if (vitals.oxygen_saturation)
          doc.text(`  Oxygen Saturation: ${vitals.oxygen_saturation}%`);
      }

      if (record.testResults) {
        doc.text('Test Results:');
        const tests = record.testResults;
        if (tests.testName) doc.text(`  Test: ${tests.testName}`);
        if (tests.result) doc.text(`  Result: ${tests.result}`);
        if (tests.normalRange) doc.text(`  Normal Range: ${tests.normalRange}`);
        if (tests.unit) doc.text(`  Unit: ${tests.unit}`);
      }

      if (record.notes) {
        doc.text(`Notes: ${record.notes}`);
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(10);
      doc.text(
        'This medical record is electronically generated and confidential.',
        { align: 'center' },
      );
      doc.text(`Generated on: ${new Date().toLocaleString()}`, {
        align: 'center',
      });

      doc.end();
    });
  }
}

import {
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { AppointmentType } from '../schemas/appointment.schema';

export class CreateAppointmentDto {
  @IsNotEmpty()
  doctorId: string;

  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @IsNumber()
  @Min(15)
  duration: number = 30;

  @IsEnum(AppointmentType)
  @IsOptional()
  type?: AppointmentType;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isEmergency?: boolean;
}

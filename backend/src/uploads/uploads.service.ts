import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
}

@Injectable()
export class UploadsService {
  private readonly uploadDir = 'uploads';

  constructor() {
    this.ensureUploadDirectoryExists();
  }

  private async ensureUploadDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      // Create subdirectories for different file types
      await fs.mkdir(path.join(this.uploadDir, 'images'), { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'documents'), {
        recursive: true,
      });
      await fs.mkdir(path.join(this.uploadDir, 'medical'), { recursive: true });
    }
  }

  async saveFile(
    file: Express.Multer.File,
    userId: string,
    category: string = 'general',
  ): Promise<UploadedFile> {
    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomUUID()}${fileExtension}`;
    const subDir = this.getSubDirectory(file.mimetype, category);
    const filePath = path.join(this.uploadDir, subDir, fileName);

    // Ensure subdirectory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Write file
    await fs.writeFile(filePath, file.buffer);

    // Return file info
    const uploadedFile: UploadedFile = {
      filename: fileName,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${subDir}/${fileName}`,
      path: filePath,
    };

    return uploadedFile;
  }

  async saveMultipleFiles(
    files: Express.Multer.File[],
    userId: string,
    category: string = 'general',
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map((file) =>
      this.saveFile(file, userId, category),
    );
    return Promise.all(uploadPromises);
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      // Remove the 'uploads/' prefix if present
      const relativePath = filePath.startsWith('/uploads/')
        ? filePath.substring(9)
        : filePath;
      const fullPath = path.join(this.uploadDir, relativePath);
      await fs.unlink(fullPath);
    } catch (error) {
      // File might not exist, ignore error
      console.warn(`Failed to delete file ${filePath}:`, error);
    }
  }

  async deleteMultipleFiles(filePaths: string[]): Promise<void> {
    const deletePromises = filePaths.map((filePath) =>
      this.deleteFile(filePath),
    );
    await Promise.all(deletePromises);
  }

  private getSubDirectory(mimetype: string, category: string): string {
    // Determine subdirectory based on file type and category
    if (mimetype.startsWith('image/')) {
      return 'images';
    } else if (
      mimetype === 'application/pdf' ||
      mimetype.startsWith('text/') ||
      mimetype.includes('document')
    ) {
      return category === 'medical' ? 'medical' : 'documents';
    } else {
      return 'documents';
    }
  }

  validateFileType(mimetype: string): boolean {
    const allowedTypes = [
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/rtf',
      // Medical images
      'image/dicom',
      'application/dicom',
    ];

    return allowedTypes.includes(mimetype);
  }

  validateFileSize(size: number, maxSize: number = 10 * 1024 * 1024): boolean {
    // Default max size: 10MB
    return size <= maxSize;
  }

  getFileStats(): Promise<any> {
    // This could be implemented to return upload statistics
    return Promise.resolve({
      totalFiles: 0,
      totalSize: 0,
      categories: {},
    });
  }
}

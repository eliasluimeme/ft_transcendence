import { Injectable, NestInterceptor, CallHandler, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import { UserService } from '../user.service';

@Injectable()
export class ValidateFileInterceptor implements NestInterceptor {
  constructor() {}

  validateFile(file: Express.Multer.File) {
    const fileSize = 10 * 1024 * 1024;
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (!file)
        throw new BadRequestException('No file provided');

    const sizeInBytes = fs.statSync(file.path).size;
    if (sizeInBytes > fileSize)
        throw new BadRequestException('File size too large');

    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension))
        throw new BadRequestException('File size too large');
}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const file = req.file as Express.Multer.File;
    console.log(file)
    try {
        this.validateFile(file);
        return next.handle();
    } catch( error ) {
        throw error;
    }
  }
}

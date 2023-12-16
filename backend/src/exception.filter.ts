import { ExceptionFilter, Catch, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, response) {
    if (exception) {
      console.log('filter')
        response.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access mn filter',
        });
        return response;
    }

    // else if (exception instanceof BadRequestException) {
    //     response.status(HttpStatus.UNAUTHORIZED).json({
    //         statusCode: HttpStatus.UNAUTHORIZED,
    //         message: 'Login Unauthorized access mn filter',
    //       });
    // }
  }
}

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception, response) {
    switch (exception.code) {
      case 'P2002': // Unique constraint violation
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'Unique constraint violated',
        });
        break;
      case 'P2003': // Entity not found
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Entity not found',
        });
        break;
      default:
        // Handle other Prisma errors
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        });
    }
  }
}
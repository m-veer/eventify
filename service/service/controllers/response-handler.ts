import { Response } from 'express';

// Type definitions for the success and error response
interface SuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: boolean;
  code: string;
  message: string;
}

const handleSuccess = <T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

const handleError = (
  res: Response,
  error: { code?: string; message?: string },
  statusCode: number = 500
): void => {
  const response: ErrorResponse = {
    success: false,
    code: error.code ?? "INTERNAL_SERVER_ERROR",
    message: error.message ?? "Something went wrong!",
  };
  res.status(statusCode).json(response);
};

export {
  handleSuccess,
  handleError,
};

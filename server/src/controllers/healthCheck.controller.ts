import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";

interface HealthCheckData {
  message: string;
}

export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  const responseData: HealthCheckData = { message: "Healthy" };
  return res
    .status(200)
    .json(new ApiResponse<HealthCheckData>(200, responseData));
});

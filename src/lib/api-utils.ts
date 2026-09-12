import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api.types';

export const sendError = (message: string, status: number = 500) => {
  return NextResponse.json<ApiResponse<null>>({
    success: false,
    message,
    data: null,
  }, { status });
};

export const cleanAiResponse = (text: string): string => {
  return text.replace(/```json|```/g, "").trim();
};

import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    try {
        const response = NextResponse.json<ApiResponse<null>>({
            success: true,
            message: "logged out successfully",
            data: null,
        }, {
            status: 200
        });

        // Clear both accessToken and refreshToken cookies
        response.cookies.set('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
        });

        response.cookies.set('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json<ApiResponse<null>>({
            success: false,
            message: "internal server error",
            data: null,
        }, {
            status: 500
        });
    }
}

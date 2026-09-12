import connectDB from "@/lib/mongo";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { AuthResponse } from "@/types/user.types";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
    try {
       const cookieStore = await cookies()
       const token = cookieStore.get('accessToken')?.value;

        if (!token) {
            return NextResponse.json<ApiResponse<null>>({
                success: false,
                message: "unauthorized",
                data: null
            }, {
                status: 401
            });
        }
        
        const decoded = verifyAccessToken(token);
        if (!decoded) {
            return NextResponse.json<ApiResponse<null>>({
                success: false,
                message: "unauthorized",
                data: null
            }, {
                status: 401
            });
        }



        await connectDB();

        const user = await User.findById(decoded.userId).select('-password').lean();

        if (!user) {
            return NextResponse.json<ApiResponse<null>>({
                success: false,
                message: "user not found",
                data: null
            }, {
                status: 404
            });
        }

        return NextResponse.json<ApiResponse<AuthResponse>>({
            success: true,
            message: "user fetched successfully",
            data: {
                accessToken: token,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    mobile: user.mobile,
                }
            }
        }, {
            status: 200
        });

    } catch (error) {
        console.error("Error fetching user me:", error);
        return NextResponse.json<ApiResponse<null>>({
            success: false,
            message: "internal server error",
            data: null
        }, {
            status: 500
        });
    }
}

import connectDB from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { generateAccessToken } from "@/lib/jwt";
import { LoginBody } from "@/types/user.types";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        let body: LoginBody = await req.json();
        let { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Email and password are required",
            }, {
                status: 400
            });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials",
            }, {
                status: 401
            });
        }

        let isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials",
            }, {
                status: 401
            });
        }

        const accessToken = generateAccessToken({ userId: user._id });

        const response = NextResponse.json({
            success: true,
            message: "User logged in successfully",
        }, { status: 200 });

        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        }, {
            status: 500
        });
    }
}

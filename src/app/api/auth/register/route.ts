import connectDB from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { generateAccessToken } from "@/lib/jwt";


export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, email, password, mobile } = body;

        if (!name || !email || !password || !mobile) {
            return NextResponse.json({
                success: false,
                message: "All fields (name, email, password, mobile) are required",
            }, {
                status: 400
            });
        }

        const isExisted = await User.findOne({ email });
        if (isExisted) {
            return NextResponse.json({
                success: false,
                message: "User already exists",
            }, {
                status: 409
            });
        }

        const newUser = await User.create({ name, email, password, mobile });

        const userId = newUser._id.toString();
        const accessToken = generateAccessToken({ userId });
       

        const response = NextResponse.json({
            success: true,
            message: "User created successfully",
            
        }, { status: 201 });

        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, 
        });

        return response;

    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        }, {
            status: 500
        });
    }
}

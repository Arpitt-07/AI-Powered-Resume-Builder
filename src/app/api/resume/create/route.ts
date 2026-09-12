import connectDB from "@/lib/mongo";
import getCurrentUser from "@/lib/getcurrentUser";
import Resume from "@/models/resume.model";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { IResume } from "@/types/resume.types";


export async function POST(request:NextRequest){

    try{
        await connectDB();
        const userId = await getCurrentUser();

        if (!userId) {
            return NextResponse.json<ApiResponse<null>>({
                success: false,
                message: "Unauthorized. Please log in again.",
                data:null
            }, {
                status: 401
            });
        }
        const resume = await Resume.create({
            userId,
            title:"",
            summary:"",
            personalInfo:{},
            workExperience:[],
            education:[],
            projects:[],
            certifications:[],
            skills:[],
        });

        return NextResponse.json<ApiResponse<IResume>>({
            success:true,
            message:"Resume created successfully",
            data:resume
        },{
            status:201
        })

       
    }catch(error){
        console.error("Error creating resume:", error);
        return NextResponse.json<ApiResponse<null>>({
            success:false,
            message:"Failed to create resume",
            data:null
        },{
            status:500
        })
    }
}
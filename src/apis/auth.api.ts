import { LoginBody, RegisterBody } from "@/types/user.types";
import axios from "axios";

export const registerApi = async (payload:RegisterBody)=>{
    const response = await axios.post("/api/auth/register",payload);
    return response.data;
}

export const loginApi = async (payload:LoginBody)=>{
    const response = await axios.post("/api/auth/login",payload);
    return response.data;
}

export const logoutApi = async ()=>{
    const response = await axios.post("/api/auth/logout");
    return response.data;
}

export const getUserApi = async ()=>{
    const response = await axios.get("/api/auth/me");
    return response.data;
}
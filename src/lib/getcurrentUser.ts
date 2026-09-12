import { cookies } from "next/headers";
import { verifyAccessToken } from "./jwt";



async function getCurrentUser(){
     const cookieStore = await cookies()
     const token = cookieStore.get("accessToken")?.value;
     if(!token){
         return null;
     }

     try {
         const decode = verifyAccessToken(token);
         if(!decode) return null;
         return decode.userId as string;
     } catch (error) {
         return null;
     }
     


}

export default getCurrentUser;

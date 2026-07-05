import { auth } from "@/auth"
import connectDb from "@/lib/db"
import Admin from "@/models/admin.models"

export async function GET(req:Request){
    try{
        await connectDb()
        const session = await auth()
        if(!session || !session.user){
            return Response.json(
                {message:"Admin not found"},
                {status:400}
            )
        }
        const admin = await Admin.findOne({email:session.user.email})

        if(!admin){
            return Response.json(
                {message:"Admin not found"},
                {status:400}
            )
        }

        return Response.json(
            admin,
            {status:200}
        )
        
    }catch(err){
         return Response.json(
                {message:`Internal server error ${err}`},
                {status:500}
            )
    }
}
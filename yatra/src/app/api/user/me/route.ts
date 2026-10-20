import { auth } from "../../../../../src/auth"
import connectDb from "../../../../../src/lib/db"
import User from "../../../../../src/models/user.models"

export async function GET(req:Request){
    try{
        await connectDb()
        const session = await auth()
        if(!session || !session.user){
            return Response.json(
                {message:"user not found"},
                {status:400}
            )
        }
        const user = await User.findOne({email:session.user.email})

        if(!user){
            return Response.json(
                {message:"User not found"},
                {status:400}
            )
        }

        return Response.json(
            user,
            {status:200}
        )
        
    }catch(err){
         return Response.json(
                {message:`Internal server error ${err}`},
                {status:500}
            )
    }
}
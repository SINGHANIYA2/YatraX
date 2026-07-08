import { auth } from "@/auth"
import connectDb from "@/lib/db"
import Admin from "@/models/admin.models"
import Vehicle from "@/models/vehicle.models"
import Partner from "@/models/partner.models"

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

        // Live counts: total vehicles/partners owned by this admin
        // (available + assigned + maintenance covers every vehicle status,
        // so this is simply every vehicle/partner document linked to the admin)
        const [totalVehicles, totalPartners] = await Promise.all([
            Vehicle.countDocuments({ adminId: admin._id }),
            Partner.countDocuments({ adminId: admin._id }),
        ])

        const adminObj = admin.toObject()
        adminObj.totalVehicles = totalVehicles
        adminObj.totalPartners = totalPartners

        return Response.json(
            adminObj,
            {status:200}
        )
        
    }catch(err){
         return Response.json(
                {message:`Internal server error ${err}`},
                {status:500}
            )
    }
}
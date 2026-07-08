import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {id , role , newPassword , currentPassword} = await req.json()

        let account;
        if(role == "user"){
            account = await User.findById(id);
        }else if(role == "partner"){
            account = await Partner.findById(id);
        }else account = await Admin.findById(id);

        if(!account){
            return NextResponse.json(
                {message:`${role} not found`},
                {status:400}
            )
        }

        const isMatch = await bcrypt.compare(currentPassword, account.password);

        if (!isMatch && account.password) {
            return NextResponse.json(
                { message: "Current password is incorrect" },
                { status: 400 }
            );
        }

        const newHashedPassword = await bcrypt.hash(newPassword,10)
        account.password = newHashedPassword;
        await account.save();

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
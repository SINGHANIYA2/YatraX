import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import User from "@/models/user.models";

export async function POST(req: Request) {
  try {
    await connectDb();

    const {
      email,
      organizationName,
      organizationType,
      gstNumber,
      panNumber,
      registrationNumber,
      address,
      city,
      state,
      pincode,
      totalVehicles,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      upiId,
    } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return Response.json(
        {
          success: false,
          message: "Admin already exists",
        },
        { status: 400 }
      );
    }

    const admin = await Admin.create({
      name: user.name,
      email: user.email,
      phone: user.mobileNumber,
      password: user.password,
      role:"admin",

      // extra admin details
      organizationName,
      organizationType,
      gstNumber,
      registrationNumber,

      panNumber,
      address,
      city,
      state,
      pincode,

      totalVehicles: Number(totalVehicles),

      bankDetails: {
        bankName,
        accountHolder: accountHolderName,
        accountNumber,
        ifsc: ifscCode,
        upiId,
      },
    });

    // delete the temporary user record
   console.log("User before delete:", user);

    const deletedUser =
    await User.findByIdAndDelete(user._id);

    console.log("Deleted User:", deletedUser);

    return Response.json(
      {
        success: true,
        message: "Admin profile created successfully",
        admin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create admin profile",
      },
      { status: 500 }
    );
  }
}
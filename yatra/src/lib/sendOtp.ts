import "server-only";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendOtp(
  phone: string,
  otp: string
): Promise<boolean> {
  try {
    const message = await client.messages.create({
      body: `Your YatraX verification code is ${otp}. It is valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phone,
    });

    console.log("OTP sent:", message.sid);
    return true;
  } catch (error) {
    console.error("OTP sending failed:", error);
    throw error;
  }
}
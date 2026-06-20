import "server-only";

import nodemailer from "nodemailer";
import { Verification_Email_Template } from "@/models/EmailTemplate";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(
  to: string,
  subject: string,
  verificationCode: string
) {
  try {
    await transporter.sendMail({
      from: `YatraX <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html: Verification_Email_Template(verificationCode),
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}


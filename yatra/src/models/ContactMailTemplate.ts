interface ContactEmailProps {
  name: string;
  email: string;
  role: string;
  userId: string;
  phone?: string;
  message: string;
  date: string;
}

export const contactEmailTemplate = ({
  name,
  email,
  role,
  userId,
  phone,
  message,
  date,
}: ContactEmailProps) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="font-family: Arial, sans-serif; background:#f8fafc; padding:20px;">

  <div style="max-width:700px; margin:auto; background:white; border-radius:16px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.08);">

    <div style="background:#2563eb; padding:25px; text-align:center;">
      <h1 style="color:white; margin:0;">
        📩 New Contact Request
      </h1>

      <p style="color:#dbeafe; margin-top:8px;">
        YatraX Support Portal
      </p>
    </div>

    <div style="padding:30px;">

      <h2 style="margin-top:0; color:#0f172a;">
        User Information
      </h2>

      <table width="100%" cellpadding="10" style="border-collapse:collapse;">

        <tr>
          <td style="font-weight:bold;">Name</td>
          <td>${name}</td>
        </tr>

        <tr style="background:#f8fafc;">
          <td style="font-weight:bold;">Email</td>
          <td>${email}</td>
        </tr>

        <tr>
          <td style="font-weight:bold;">Role</td>
          <td>${role}</td>
        </tr>

        <tr style="background:#f8fafc;">
          <td style="font-weight:bold;">User ID</td>
          <td>${userId}</td>
        </tr>

        <tr>
          <td style="font-weight:bold;">Phone</td>
          <td>${phone || "Not Provided"}</td>
        </tr>

      </table>

      <hr style="margin:30px 0;" />

      <h2 style="color:#0f172a;">
        Message
      </h2>

      <div
        style="
          background:#f8fafc;
          padding:20px;
          border-radius:12px;
          line-height:1.7;
          color:#334155;
        "
      >
        ${message}
      </div>

      <hr style="margin:30px 0;" />

      <h2 style="color:#0f172a;">
        Additional Information
      </h2>

      <table width="100%" cellpadding="10" style="border-collapse:collapse;">

        <tr>
          <td style="font-weight:bold;">Date</td>
          <td>${date}</td>
        </tr>

        <tr style="background:#f8fafc;">
          <td style="font-weight:bold;">Platform</td>
          <td>YatraX Web Application</td>
        </tr>

      </table>

    </div>

    <div
      style="
        background:#0f172a;
        color:#94a3b8;
        padding:20px;
        text-align:center;
      "
    >
      © ${new Date().getFullYear()} YatraX • Transportation Management Platform
    </div>

  </div>

</body>
</html>
`;
};
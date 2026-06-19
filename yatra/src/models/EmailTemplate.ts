
export const Verification_Email_Template = (otp:string) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Email Verification</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .header {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            text-align: center;
            padding: 30px 20px;
        }

        .header h1 {
            font-size: 28px;
        }

        .content {
            padding: 40px 30px;
            text-align: center;
        }

        .content h2 {
            color: #333;
            margin-bottom: 15px;
        }

        .content p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
        }

        .otp-box {
            display: inline-block;
            background: #f3f4f6;
            color: #4f46e5;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 15px 30px;
            border-radius: 10px;
            margin-bottom: 25px;
            border: 2px dashed #4f46e5;
        }

        .warning {
            color: #ef4444;
            font-size: 14px;
            margin-top: 20px;
        }

        .footer {
            background: #f9fafb;
            text-align: center;
            padding: 20px;
            color: #888;
            font-size: 14px;
            border-top: 1px solid #eee;
        }

        @media(max-width: 600px) {
            .content {
                padding: 30px 20px;
            }

            .otp-box {
                font-size: 24px;
                letter-spacing: 5px;
                padding: 12px 20px;
            }
        }
    </style>
</head>

<body>

    <div class="container">

        <div class="header">
            <h1>OTP Verification</h1>
        </div>

        <div class="content">
            <h2>Verify Your Email</h2>

            <p>
                Thank you for registering. Use the OTP below to verify your email address.
            </p>

            <div class="otp-box">
                ${otp}
            </div>

            <p>
                This OTP is valid for only 5 minutes.
            </p>

            <p class="warning">
                Do not share this OTP with anyone.
            </p>
        </div>

        <div class="footer">
            © 2026 OTP Verification App. All rights reserved.
        </div>

    </div>

</body>

</html>
`
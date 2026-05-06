import { sendMail } from "../lib/mail.js";

export const sendVerificationEmail = async (username, to, subject, code) => {
  const html = `
<div style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial, sans-serif;">
  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; padding:30px; text-align:center;">
    
    <h2 style="margin-bottom:10px; color:#333;">Verify Your Email</h2>
    
    <p style="font-size:16px; color:#555; margin-bottom:20px;">
      Hi ${username},
    </p>

    <p style="font-size:15px; color:#555; margin-bottom:30px;">
      Use the verification code below to complete your signup process:
    </p>

    <div style="display:inline-block; padding:15px 25px; font-size:24px; letter-spacing:4px; font-weight:bold; color:#ffffff; background-color:#4f46e5; border-radius:6px; margin-bottom:30px;">
      ${code}
    </div>

    <p style="font-size:14px; color:#777; margin-bottom:10px;">
      This code is valid for 3 hours.
    </p>

    <p style="font-size:14px; color:#999;">
      If you didn't request this, you can safely ignore this email.
    </p>

  </div>
</div>
`;

  return await sendMail(to, subject, html);
};

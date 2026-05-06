import { transporter } from "../config/nodemailer.config.js";

export const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"SecureX" <admin@securex.com>',
      to,
      subject,
      html,
    });

    return !!info.messageId;
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

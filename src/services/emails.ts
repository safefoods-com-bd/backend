/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import nodeMailer from "nodemailer";
export const sendEmailWithNodemailer = async (emailData: any) => {
  const transporter = nodeMailer.createTransport({
    host: `${process.env.EMAIL_HOST}`,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: `${process.env.MAILTRAP_USER}`,
      pass: `${process.env.MAILTRAP_PASSWORD}`,
    },
  });

  try {
    const info = await transporter.sendMail(emailData);
    return info;
  } catch (error: any) {
    throw error;
  }
};

export const sendEmailUsingMailhog = async (emailData: any) => {
  const transporter = nodeMailer.createTransport({
    host: `mailhog`,
    port: 1025,
    secure: false,
    requireTLS: false,
  });

  try {
    const info = await transporter.sendMail(emailData);
    return info;
  } catch (error: any) {
    throw error;
  }
};

// export const sendBulkEmailsWithNodemailer = async (emailData: any) => {
//   const transporter = nodeMailer.createTransport({
//     host: `bulk.smtp.mailtrap.io`,
//     port: 587,
//     auth: {
//       user: `api`,
//       pass: `26096d17226fc47471e3ca0ccf9448cf`,
//     },
//   });

//   try {
//     const info = await transporter.sendMail(emailData);
//     console.log(`Message sent: ${info.response}`);
//     return info;
//   } catch (error: any) {
//     console.error(`Problem sending email: ${error.message}`);
//     throw error;
//   }
// };

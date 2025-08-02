export const onRegisterVerificationEmail = ({
  email,
  code,
}: {
  email: string;
  code: number;
}) => {
  return `
      <!DOCTYPE html>
      <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }}
                    .container {{
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}
                    h4 {{
                        font-size: 1.2em;
                        margin-bottom: 20px;
                        color: #333;
                    }}
                    h3 {{
                        font-size: 2em;
                        margin-bottom: 20px;
                        color: #007BFF;
                    }}
                    p {{
                        font-size: 1em;
                        color: #666;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Greetings! ${email}</h2>
                    <h3>Use the following code to verify your email address and complete the registration process. </h3>
                    <h3>${code}</h3>
                    <p>This code will be valid for 60 minutes.</p>
                    <p>If you didn't initiate this action or if you think you received this email by mistake, please contact</p>
                    <p style= "color:blue, font-wight:600">support@softeko.co</p>
                    <hr />
                    <p>Regards,</p>
                    <p style="font-size:17px;font-weight:600">Softeko Team</p>
                    

                </div>
            </body>
            </html>
    `;
};

export const onResetPasswordVerificationEmail = ({
  email,
  otp,
}: {
  email: string;
  otp: number;
}) => {
  return `
        <!DOCTYPE html>
                 <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }}
                    .container {{
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}
                    h4 {{
                        font-size: 1.2em;
                        margin-bottom: 20px;
                        color: #333;
                    }}
                    h3 {{
                        font-size: 2em;
                        margin-bottom: 20px;
                        color: #007BFF;
                    }}
                    p {{
                        font-size: 1em;
                        color: #666;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Greetings! ${email}</h2>
                    <h3>Use the following otp to Reset Password. </h3>
                    <h3>${otp}</h3>
                    <p>This otp will be valid for 60 minutes.</p>
                    <p>If you didn't initiate this action or if you think you received this email by mistake, please contact</p>
                    <p style= "color:blue, font-wight:600">support@softeko.co</p>
                    <hr />
                    <p>Regards,</p>
                    <p style="font-size:17px;font-weight:600">Softeko Team</p>
                </div>
            </body>
            </html>
      `;
};

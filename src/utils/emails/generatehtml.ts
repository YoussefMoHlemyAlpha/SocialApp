export function Template(Otp: string, firstName: string, subject: string) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 30px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
        
        <h2 style="color: #2c3e50; margin-bottom: 10px;">Hello ${firstName},</h2>
        <p style="margin: 0 0 15px;">Thank you for signing up!</p>
        
        <p style="font-size: 16px; font-weight: 500; color: #444;">
          <strong>${subject}</strong>
        </p>
        
        <p style="margin: 20px 0;">Please use the code below to confirm your email address:</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <span style="display: inline-block; background: #2c3e50; color: #fff; padding: 12px 25px; font-size: 26px; font-weight: bold; letter-spacing: 3px; border-radius: 8px;">
            ${Otp}
          </span>
        </div>
        
        <p style="margin: 20px 0; color: #666; font-size: 14px;">
          If you didn’t request this, you can safely ignore this email.
        </p>
        
        <p style="margin-top: 30px; font-size: 15px;">
          Best regards,<br>
          <span style="color: #2c3e50; font-weight: 600;">Your Company Team</span>
        </p>
      </div>
    </div>
  `;
}

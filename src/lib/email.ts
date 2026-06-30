import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  // If SMTP not configured, log and return silently (dev mode)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured. Password reset email not sent. Set SMTP_USER and SMTP_PASS in .env");
    return { success: false, message: "SMTP not configured" };
  }

  try {
    await transporter.sendMail({
      from: `"RickshareBD" <${process.env.SMTP_USER}>`,
      to,
      subject: "Password Reset Request - RickshareBD",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 30 minutes.\n\nIf you didn't request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #123c2f;">Password Reset</h2>
          <p>You requested a password reset for your RickshareBD account.</p>
          <p><a href="${resetUrl}" style="display: inline-block; background: #f6c15b; color: #123c2f; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a></p>
          <p style="color: #666; font-size: 12px;">This link expires in 30 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return { success: false, message: "Failed to send email" };
  }
}

export async function sendRideJoinedNotification(posterEmail: string, requesterName: string, rideDetails: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured. Notification email not sent.");
    return { success: false };
  }

  try {
    await transporter.sendMail({
      from: `"RickshareBD" <${process.env.SMTP_USER}>`,
      to: posterEmail,
      subject: "New Join Request - RickshareBD",
      text: `${requesterName} wants to join your ride: ${rideDetails}. Log in to accept or reject the request.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #123c2f;">New Join Request</h2>
          <p><strong>${requesterName}</strong> wants to join your ride:</p>
          <p style="background: #fbf7ef; padding: 12px; border-radius: 8px;">${rideDetails}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/my-rides" style="display: inline-block; background: #123c2f; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Manage Requests</a></p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to send notification email:", err);
    return { success: false };
  }
}

import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.ethereal.email',
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
  });

  static async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

    if (env.NODE_ENV !== 'production') {
      logger.info('--- DEVELOPMENT EMAIL VERIFICATION ---');
      logger.info(`To: ${email}`);
      logger.info(`Verification URL: ${verificationUrl}`);
      logger.info('--------------------------------------');
    }

    try {
      if (!env.SMTP_USER || !env.SMTP_HOST) {
        if (env.NODE_ENV === 'production') {
          throw new Error('SMTP credentials missing in production');
        }
        logger.warn('SMTP credentials missing. Email not sent, but link logged above.');
        return;
      }

      const info = await EmailService.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: email,
        subject: 'Verify your email - Clean Cut',
        html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #3b82f6;">Welcome to Clean Cut, ${name}!</h1>
                        <p>Thank you for registering. Please verify your email address to get full access to your account, including API key generation.</p>
                        <div style="margin: 30px 0;">
                            <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
                        </div>
                        <p style="color: #6b7280; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="color: #3b82f6; font-size: 14px;">${verificationUrl}</p>
                    </div>
                `,
      });

      logger.info(`Verification email sent to ${email}: ${info.messageId}`);
      if (env.NODE_ENV !== 'production' && info) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) logger.info(`Preview URL: ${previewUrl}`);
      }
    } catch (error) {
      logger.error(`Error sending verification email to ${email}`, error);
      if (env.NODE_ENV === 'production') {
        throw error;
      }
      logger.warn('Email sending failed, but continuing in development mode.');
    }
  }

  static async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

    if (env.NODE_ENV !== 'production') {
      logger.info('--- DEVELOPMENT PASSWORD RESET EMAIL ---');
      logger.info(`To: ${email}`);
      logger.info(`Password reset URL: ${resetUrl}`);
      logger.info('----------------------------------------');
    }

    try {
      if (!env.SMTP_USER || !env.SMTP_HOST) {
        if (env.NODE_ENV === 'production') {
          throw new Error('SMTP credentials missing in production');
        }
        logger.warn('SMTP credentials missing. Email not sent, but link logged above.');
        return;
      }

      const info = await EmailService.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: email,
        subject: 'Reset your password - Clean Cut',
        html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #3b82f6;">Password reset request</h1>
                        <p>Hello ${name},</p>
                        <p>We received a request to reset your password. Use the button below to set a new password. This link expires in 30 minutes.</p>
                        <div style="margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                        </div>
                        <p style="color: #6b7280; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="color: #3b82f6; font-size: 14px;">${resetUrl}</p>
                    </div>
                `,
      });

      logger.info(`Password reset email sent to ${email}: ${info.messageId}`);
      if (env.NODE_ENV !== 'production' && info) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) logger.info(`Preview URL: ${previewUrl}`);
      }
    } catch (error) {
      logger.error(`Error sending password reset email to ${email}`, error);
      if (env.NODE_ENV === 'production') {
        throw error;
      }
      logger.warn('Email sending failed, but continuing in development mode.');
    }
  }
}

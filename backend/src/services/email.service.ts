import { Resend } from 'resend';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export class EmailService {
  private static resend: Resend | null = null;

  private static getClient(): Resend {
    if (!env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    if (!EmailService.resend) {
      EmailService.resend = new Resend(env.RESEND_API_KEY);
    }

    return EmailService.resend;
  }

  static async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

    if (env.NODE_ENV !== 'production') {
      logger.info('--- DEVELOPMENT EMAIL VERIFICATION ---');
      logger.info(`To: ${email}`);
      logger.info(`Verification URL: ${verificationUrl}`);
      logger.info('--------------------------------------');
    }

    try {
      const result = await EmailService.getClient().emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: 'Verify your email - Korta',
        html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #3b82f6;">Welcome to Korta, ${name}!</h1>
                        <p>Thank you for registering. Please verify your email address to get full access to your account, including API key generation.</p>
                        <div style="margin: 30px 0;">
                            <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
                        </div>
                        <p style="color: #6b7280; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="color: #3b82f6; font-size: 14px;">${verificationUrl}</p>
                    </div>
                `,
      });

      if (result.error) {
        throw new Error(`Resend API error: ${result.error.message}`);
      }

      logger.info(`Verification email sent to ${email}: ${result.data?.id || 'no-id-returned'}`);
    } catch (error) {
      logger.error(`Error sending verification email to ${email}`, error);
      throw error;
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
      const result = await EmailService.getClient().emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: 'Reset your password - Korta',
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

      if (result.error) {
        throw new Error(`Resend API error: ${result.error.message}`);
      }

      logger.info(`Password reset email sent to ${email}: ${result.data?.id || 'no-id-returned'}`);
    } catch (error) {
      logger.error(`Error sending password reset email to ${email}`, error);
      throw error;
    }
  }
}

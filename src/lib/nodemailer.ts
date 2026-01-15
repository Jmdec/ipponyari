// ===== FINAL lib/nodemailer.ts =====
// Includes logo.png + 🍜 Izakaya Tori Ichizu in header
// All text centered for clean, consistent layout

import nodemailer from 'nodemailer'

// Create transporter - UPDATED to match your .env names
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // false for 587, true for 465
  auth: {
    user: process.env.SMTP_USER,     // matches SMTP_USER in your .env
    pass: process.env.SMTP_PASS,     // matches SMTP_PASS in your .env
  },
  debug: false,
  logger: false,
})

// Verify transporter configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    return false
  }
}

// Generate verification token
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials are not configured. Please check SMTP_USER and SMTP_PASS in .env.local')
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const verificationUrl = `${appUrl}/verify-email?token=${verificationToken}`

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Izakaya Tori Ichizu" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your Email - Izakaya Tori Ichizu',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #f7f7f7;
              text-align: center;
            }
            .container {
              background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
              border-radius: 10px;
              padding: 30px;
              text-align: center;
            }
            .logo img {
              width: 120px;
              height: auto;
              margin-bottom: 10px;
            }
            .brand {
              font-size: 26px;
              font-weight: bold;
              color: white;
              margin-bottom: 20px;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 30px;
              margin-top: 20px;
              text-align: center;
            }
            .content h2 {
              color: #ff6b35;
              margin-bottom: 10px;
            }
            .content p {
              margin: 10px 0;
            }
            .button {
              display: inline-block;
              padding: 15px 40px;
              background: linear-gradient(135deg, #f7931e 0%, #ff6b35 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px auto;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="${appUrl}/logonew.png" alt="Izakaya Tori Ichizu Logo" />
            </div>
            <div class="brand">🍜 Izakaya Tori Ichizu</div>
            <div class="content">
              <h2>Welcome, ${name}!</h2>
              <p>Thank you for registering with <strong>Izakaya Tori Ichizu</strong>.</p>
              <p>Please verify your email address by clicking the button below:</p>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Or copy and paste this link into your browser:<br>
                <span style="word-break: break-all;">${verificationUrl}</span>
              </p>
              <div class="footer">
                <p>If you didn't create an account, please ignore this email.</p>
                <p>This link will expire in 24 hours.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to Izakaya Tori Ichizu, ${name}!

      Thank you for registering. Please verify your email address by clicking the link below:

      ${verificationUrl}

      If you didn't create an account, please ignore this email.
      This link will expire in 24 hours.
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        throw new Error('Invalid email credentials. Please check SMTP_USER and SMTP_PASS')
      }
      if (error.message.includes('ECONNREFUSED')) {
        throw new Error('Cannot connect to email server. Please check SMTP_HOST and SMTP_PORT')
      }
      if (error.message.includes('EAUTH')) {
        throw new Error('Authentication failed. Please verify your Gmail App Password')
      }
    }
    throw error
  }
}

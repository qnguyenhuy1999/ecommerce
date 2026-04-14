import nodemailer from 'nodemailer'

import { emailConfig } from './index'

export * from './index'
export { emailConfig }

export function createTransporter() {
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth.user
      ? {
          user: emailConfig.auth.user,
          pass: emailConfig.auth.pass,
        }
      : undefined,
  })
}

export async function sendEmail(options: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: options.from || process.env.SMTP_FROM || 'noreply@ecommerce.local',
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}

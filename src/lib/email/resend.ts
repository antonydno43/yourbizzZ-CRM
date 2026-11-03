import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';

// Create Resend client
const resend = new Resend(resendApiKey);

// Email configuration
const emailConfig = {
  from: process.env.RESEND_FROM_EMAIL || 'noreply@yourbizz.com',
  replyTo: process.env.RESEND_REPLY_TO || 'support@yourbizz.com',
};

// Send email function
export const sendEmail = async (
  to: string | string[],
  subject: string,
  html: string,
  text?: string
) => {
  try {
    const data = await resend.emails.send({
      from: emailConfig.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send template email
export const sendTemplateEmail = async (
  to: string | string[],
  subject: string,
  template: string,
  variables: Record<string, string | number> = {}
) => {
  try {
    // Replace variables in template
    let html = template;
    for (const [key, value] of Object.entries(variables)) {
      html = html.replace(new RegExp(`\{\{${key}\}\}`, 'g'), String(value));
    }
    
    return await sendEmail(to, subject, html);
  } catch (error) {
    console.error('Error sending template email:', error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (to: string, name: string) => {
  const subject = 'Welcome to YourBizz!';
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h1 style="color: #2563eb;">Welcome to YourBizz, ${name}!</h1>
      <p>Thank you for joining YourBizz. We're excited to have you on board.</p>
      <p>Get started by exploring our features and building your first website.</p>
      <button style="background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
        Get Started
      </button>
    </div>
  `;
  
  return await sendEmail(to, subject, html);
};

// Send appointment confirmation email
export const sendAppointmentConfirmation = async (
  to: string,
  customerName: string,
  serviceName: string,
  date: string,
  time: string,
  staffName: string
) => {
  const subject = 'Appointment Confirmation';
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h1 style="color: #2563eb;">Appointment Confirmed</h1>
      <p>Hello ${customerName},</p>
      <p>Your appointment has been confirmed:</p>
      <ul>
        <li><strong>Service:</strong> ${serviceName}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Staff:</strong> ${staffName}</li>
      </ul>
      <p>Thank you for choosing YourBizz!</p>
    </div>
  `;
  
  return await sendEmail(to, subject, html);
};

// Send order confirmation email
export const sendOrderConfirmation = async (
  to: string,
  customerName: string,
  orderNumber: string,
  orderTotal: string,
  items: string
) => {
  const subject = `Order Confirmation #${orderNumber}`;
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h1 style="color: #2563eb;">Order Confirmation</h1>
      <p>Hello ${customerName},</p>
      <p>Your order has been received:</p>
      <h3>Order #${orderNumber}</h3>
      <p><strong>Total:</strong> ${orderTotal}</p>
      <h4>Items:</h4>
      ${items}
      <p>Thank you for your purchase!</p>
    </div>
  `;
  
  return await sendEmail(to, subject, html);
};

// Send password reset email
export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  const subject = 'Password Reset Request';
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h1 style="color: #2563eb;">Password Reset</h1>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href="${resetLink}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Reset Password
      </a>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  
  return await sendEmail(to, subject, html);
};

export { resend, emailConfig };

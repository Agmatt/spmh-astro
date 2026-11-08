// src/lib/resend.ts
import { Resend } from 'resend';

export const resend = new Resend(import.meta.env.RESEND_API_KEY);
export const fromEmail =
  import.meta.env.RESEND_FROM_EMAIL ||
  'SPMH Procurement <onboarding@resend.dev>';

export const getVendorEmailHtml = (companyName: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #125276;">Vendor Registration Received</h2>
    <p>Dear <strong>${companyName}</strong>,</p>
    <p>Thank you for registering with St Paul's Mission Hospital Procurement Portal.</p>
    <p>We have successfully received your vendor application. Our procurement team will review your details and notify you once your account is verified.</p>
    <p>You do not need to reply to this email.</p>
    <br />
    <p>Best regards,</p>
    <p><strong>Procurement Team</strong><br/>St Paul's Mission Hospital</p>
    <hr style="border: 1px solid #eee; margin: 20px 0;" />
    <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply directly to this email.</p>
  </div>
`;

export const getTenderEmailHtml = (
  companyName: string,
  contactName: string,
  tenderCode: string,
  tenderTitle: string,
) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #125276;">Tender Application Received</h2>
    <p>Dear <strong>${contactName}</strong> from <strong>${companyName}</strong>,</p>
    <p>We have successfully received your application for the following tender:</p>
    <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #125276; margin: 20px 0;">
      <p style="margin: 0;"><strong>Code:</strong> ${tenderCode}</p>
      <p style="margin: 5px 0 0 0;"><strong>Title:</strong> ${tenderTitle}</p>
    </div>
    <p>Our procurement team will review your submission. You will be notified of the outcome in due course.</p>
    <p>You do not need to reply to this email.</p>
    <br />
    <p>Best regards,</p>
    <p><strong>Procurement Team</strong><br/>St Paul's Mission Hospital</p>
    <hr style="border: 1px solid #eee; margin: 20px 0;" />
    <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply directly to this email.</p>
  </div>
`;

// src/routes/api/send-email/+server.ts
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const POST = async ({ request }) => {
    try {
        const { to, subject, body } = await request.json();

        const smtpSecure = process.env.SMTP_SECURE === 'yes';

        // Create a transporter object using the nodemailer library
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: smtpSecure,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Set up email data
        const mail_options = {
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.VITE_SMTP_FROM_EMAIL}>`,
            to: to,
            subject: subject,
            text: body
        };

        // Send email
        const info = await transporter.sendMail(mail_options);

        // Return a Response object
        return new Response(JSON.stringify({
            message: 'Email sent successfully',
            messageId: info.messageId
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new Response(JSON.stringify({
            error: 'Internal server error'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

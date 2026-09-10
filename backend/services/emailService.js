const nodemailer = require('nodemailer');
const Setting = require('../models/Setting');

/**
 * Helper to fetch dynamic SMTP configuration from DB settings or .env
 */
async function getEmailConfig() {
    let settings = {};
    try {
        settings = await Setting.getAll();
    } catch (e) {
        console.warn('Could not load settings from DB, using fallback env:', e.message);
    }

    const host = settings.smtp_host || process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(settings.smtp_port || process.env.SMTP_PORT || '587', 10);
    const secure = settings.smtp_secure === 'true' || process.env.SMTP_SECURE === 'true' || port === 465;
    const user = settings.smtp_user || process.env.SMTP_USER || '';
    const pass = settings.smtp_pass || process.env.SMTP_PASS || '';
    const adminEmail = settings.notification_email || settings.email || process.env.ADMIN_NOTIFICATION_EMAIL || 'glowflosports@gmail.com';
    const siteName = settings.siteName || 'SK Sports Academy';

    return { host, port, secure, user, pass, adminEmail, siteName };
}

/**
 * Creates Nodemailer transporter
 */
function createTransporter(config) {
    if (!config.user || !config.pass) {
        return null;
    }

    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.user,
            pass: config.pass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

/**
 * Send notification to Admin when a new contact inquiry arrives
 */
async function sendContactNotification(contact) {
    try {
        const config = await getEmailConfig();
        const transporter = createTransporter(config);

        if (!transporter) {
            console.log('⚠️ [Mail] SMTP credentials (user/password) not yet configured. Email trigger skipped. Message safely stored in database.');
            return { sent: false, reason: 'SMTP credentials not configured' };
        }

        const { name, email, phone, age, message } = contact;
        const timeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px 28px; color: #ffffff;">
                    <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700;">🏸 New Contact Message Received</h2>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">Someone submitted the contact form on ${config.siteName}.</p>
                </div>
                
                <div style="padding: 28px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr>
                            <td style="padding: 10px 0; color: #6b7280; width: 130px; font-weight: 600;">Sender Name:</td>
                            <td style="padding: 10px 0; color: #111827; font-weight: 600;">${name}</td>
                        </tr>
                        <tr style="border-top: 1px solid #f3f4f6;">
                            <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Email Address:</td>
                            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #059669; text-decoration: none; font-weight: 500;">${email}</a></td>
                        </tr>
                        <tr style="border-top: 1px solid #f3f4f6;">
                            <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Phone Number:</td>
                            <td style="padding: 10px 0;"><a href="tel:${phone}" style="color: #059669; text-decoration: none; font-weight: 500;">${phone}</a></td>
                        </tr>
                        ${age ? `
                        <tr style="border-top: 1px solid #f3f4f6;">
                            <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Age:</td>
                            <td style="padding: 10px 0; color: #111827;">${age}</td>
                        </tr>` : ''}
                        <tr style="border-top: 1px solid #f3f4f6;">
                            <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Received At:</td>
                            <td style="padding: 10px 0; color: #6b7280;">${timeStr}</td>
                        </tr>
                    </table>

                    <div style="margin-top: 20px; padding: 16px 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #10b981;">
                        <div style="font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Message:</div>
                        <div style="color: #1f2937; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message || '(No message content provided)'}</div>
                    </div>

                    <div style="margin-top: 26px; text-align: center;">
                        <a href="mailto:${email}?subject=Re: Your enquiry at ${config.siteName}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-weight: 600; padding: 11px 24px; border-radius: 8px; font-size: 14px;">Reply to ${name}</a>
                    </div>
                </div>

                <div style="background: #f9fafb; padding: 16px 28px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
                    This notification was automatically sent from the ${config.siteName} website contact form.
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"${config.siteName}" <${config.user}>`,
            to: config.adminEmail,
            replyTo: email,
            subject: `🏸 New Contact Message from ${name} - ${config.siteName}`,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [Mail] Admin notification successfully sent to ${config.adminEmail} (MsgID: ${info.messageId})`);
        return { sent: true, messageId: info.messageId };
    } catch (err) {
        console.error('❌ [Mail] Error sending admin notification:', err.message);
        return { sent: false, error: err.message };
    }
}

/**
 * Send auto-reply acknowledgment email to the visitor
 */
async function sendContactAutoReply(contact) {
    try {
        const config = await getEmailConfig();
        const transporter = createTransporter(config);

        if (!transporter) {
            return { sent: false, reason: 'SMTP not configured' };
        }

        const { name, email, message } = contact;
        if (!email) return { sent: false, reason: 'No recipient email' };

        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px 28px; color: #ffffff; text-align: center;">
                    <h2 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 700;">${config.siteName}</h2>
                    <p style="margin: 0; font-size: 15px; opacity: 0.95;">Thank you for getting in touch with us!</p>
                </div>
                
                <div style="padding: 28px; color: #374151; font-size: 15px; line-height: 1.6;">
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>We have successfully received your inquiry. Our team is reviewing your message and will get back to you as soon as possible.</p>

                    ${message ? `
                    <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #10b981;">
                        <span style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Your Message:</span>
                        <p style="margin: 6px 0 0 0; color: #4b5563; font-style: italic;">"${message}"</p>
                    </div>` : ''}

                    <p style="margin-top: 24px;">If you have any urgent queries, feel free to call us directly or reply to this email.</p>

                    <div style="margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                        <p style="margin: 0; font-weight: 600; color: #111827;">Warm Regards,</p>
                        <p style="margin: 2px 0 0 0; color: #059669; font-weight: 600;">${config.siteName} Team</p>
                    </div>
                </div>

                <div style="background: #f9fafb; padding: 16px 28px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} ${config.siteName}. All rights reserved.
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"${config.siteName}" <${config.user}>`,
            to: email,
            subject: `Thank you for contacting ${config.siteName}!`,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [Mail] Auto-reply email sent to visitor ${email} (MsgID: ${info.messageId})`);
        return { sent: true, messageId: info.messageId };
    } catch (err) {
        console.error('❌ [Mail] Error sending auto-reply email:', err.message);
        return { sent: false, error: err.message };
    }
}

/**
 * Send test email to verify credentials
 */
async function sendTestEmail(targetEmail, customConfig = {}) {
    const baseConfig = await getEmailConfig();
    const config = { ...baseConfig, ...customConfig };
    const to = targetEmail || config.adminEmail;

    if (!config.user || !config.pass) {
        throw new Error('SMTP user and password are required. Please configure them in Site Settings or .env');
    }

    const transporter = createTransporter(config);
    if (!transporter) {
        throw new Error('Could not create mail transporter with provided credentials.');
    }

    // Verify SMTP connection
    await transporter.verify();

    const info = await transporter.sendMail({
        from: `"${config.siteName}" <${config.user}>`,
        to: to,
        subject: `✅ Test Email - ${config.siteName} Mail System Working!`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #10b981; border-radius: 8px; max-width: 500px;">
                <h2 style="color: #10b981; margin-top: 0;">🎉 SMTP Configuration Successful!</h2>
                <p>This is a confirmation test email from <strong>${config.siteName}</strong>.</p>
                <p>Your SMTP mail server (${config.host}:${config.port}) is properly configured and capable of sending notification emails!</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #6b7280; margin: 0;">Sent at: ${new Date().toLocaleString()}</p>
            </div>
        `
    });

    return { success: true, messageId: info.messageId, recipient: to };
}

module.exports = {
    getEmailConfig,
    sendContactNotification,
    sendContactAutoReply,
    sendTestEmail
};

const nodemailer = require('nodemailer');
const Setting = require('../models/Setting');

/**
 * Helper to clean phone and format WhatsApp URL
 */
function getWhatsAppUrl(phone, name) {
    if (!phone) return null;
    let digits = String(phone).replace(/\D/g, '');
    if (digits.length === 10) {
        digits = '91' + digits;
    }
    const text = encodeURIComponent(`Hello ${name || ''}, thank you for contacting SK Sports Academy! We received your details.`);
    return `https://wa.me/${digits}?text=${text}`;
}

/**
 * Format Indian Standard Time nicely
 */
function getFormattedDateTime() {
    return new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

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

    const host = process.env.SMTP_HOST || settings.smtp_host || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || settings.smtp_port || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || settings.smtp_secure === 'true' || port === 465;
    const user = process.env.SMTP_USER || settings.smtp_user || '';
    const pass = process.env.SMTP_PASS || settings.smtp_pass || '';

    // Priority: .env ADMIN_NOTIFICATION_EMAIL first, then DB notification_email, then DB email
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || settings.notification_email || settings.email || 'sasirekha.sts@gmail.com';
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
            console.log('⚠️ [Mail] SMTP credentials not configured. Contact email skipped.');
            return { sent: false, reason: 'SMTP credentials not configured' };
        }

        const { name, email, phone, age, message } = contact;
        const timeStr = getFormattedDateTime();
        const waUrl = getWhatsAppUrl(phone, name);

        const html = `
            <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif; max-width: 620px; margin: 20px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
                <!-- Header Banner -->
                <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 26px 32px; color: #ffffff;">
                    <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">Contact Inquiry</span>
                    <h2 style="margin: 10px 0 4px 0; font-size: 22px; font-weight: 800;">🏸 New Contact Message Received</h2>
                    <p style="margin: 0; font-size: 14px; opacity: 0.95;">A customer sent an inquiry through ${config.siteName}.</p>
                </div>
                
                <!-- Content Area -->
                <div style="padding: 30px;">
                    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 12px;">Customer Details:</div>
                    
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr style="background: #f8fafc;">
                            <td style="padding: 12px 14px; color: #475569; width: 140px; font-weight: 600; border-radius: 6px 0 0 6px;">👤 Full Name:</td>
                            <td style="padding: 12px 14px; color: #0f172a; font-weight: 700; border-radius: 0 6px 6px 0;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600;">📧 Email Address:</td>
                            <td style="padding: 12px 14px;"><a href="mailto:${email}" style="color: #059669; text-decoration: none; font-weight: 600;">${email}</a></td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600; border-radius: 6px 0 0 6px;">📱 Phone Number:</td>
                            <td style="padding: 12px 14px; border-radius: 0 6px 6px 0;">
                                <a href="tel:${phone}" style="color: #059669; text-decoration: none; font-weight: 600;">${phone}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600;">🎂 Age:</td>
                            <td style="padding: 12px 14px; color: #0f172a; font-weight: 500;">${age ? `${age} Years` : 'Not specified'}</td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600; border-radius: 6px 0 0 6px;">🕒 Received At:</td>
                            <td style="padding: 12px 14px; color: #64748b; font-size: 13px; border-radius: 0 6px 6px 0;">${timeStr}</td>
                        </tr>
                    </table>

                    <!-- Message Card -->
                    <div style="margin-top: 24px; padding: 18px 20px; background: #f0fdf4; border-radius: 10px; border-left: 4px solid #10b981;">
                        <div style="font-weight: 700; color: #166534; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">💬 Message Content:</div>
                        <div style="color: #1e293b; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message || '(No message text provided)'}</div>
                    </div>
                   
                </div>

                <!-- Footer -->
                <div style="background: #f8fafc; padding: 16px 30px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
                    This notification was automatically sent to the Admin of <strong>${config.siteName}</strong>.
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"${config.siteName}" <${config.user}>`,
            to: config.adminEmail,
            replyTo: email,
            subject: `🏸 New Contact Message: ${name} (${phone}) - ${config.siteName}`,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [Mail] Admin contact notification sent to ${config.adminEmail} (MsgID: ${info.messageId})`);
        return { sent: true, messageId: info.messageId };
    } catch (err) {
        console.error('❌ [Mail] Error sending admin contact notification:', err.message);
        return { sent: false, error: err.message };
    }
}

/**
 * Send notification to Admin when a new Academy Registration (Join now) arrives
 */
async function sendRegistrationNotification(registration) {
    try {
        const config = await getEmailConfig();
        const transporter = createTransporter(config);

        if (!transporter) {
            console.log('⚠️ [Mail] SMTP credentials not configured. Registration email skipped.');
            return { sent: false, reason: 'SMTP credentials not configured' };
        }

        const { name, email, phone, gender, dob, sport, skill_level, training_time, message } = registration;
        const timeStr = getFormattedDateTime();
        const waUrl = getWhatsAppUrl(phone, name);

        const html = `
            <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif; max-width: 620px; margin: 20px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
                <!-- Header Banner -->
                <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 26px 32px; color: #ffffff;">
                    <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">Academy Membership Registration</span>
                    <h2 style="margin: 10px 0 4px 0; font-size: 22px; font-weight: 800;">🏸 New Player Registration (Join Now)</h2>
                    <p style="margin: 0; font-size: 14px; opacity: 0.95;">A new member submitted a registration request on ${config.siteName}.</p>
                </div>
                
                <!-- Content Area -->
                <div style="padding: 30px;">
                    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 12px;">Candidate Registration Details:</div>
                    
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr style="background: #f8fafc;">
                            <td style="padding: 12px 14px; color: #475569; width: 160px; font-weight: 600; border-radius: 6px 0 0 6px;">👤 Full Name:</td>
                            <td style="padding: 12px 14px; color: #0f172a; font-weight: 700; border-radius: 0 6px 6px 0;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600;">📱 Mobile Number:</td>
                            <td style="padding: 12px 14px; border-radius: 0 6px 6px 0;">
                                <a href="tel:${phone}" style="color: #0284c7; text-decoration: none; font-weight: 700;">${phone}</a>
                            </td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600;">📧 Email Address:</td>
                            <td style="padding: 12px 14px;">${email ? `<a href="mailto:${email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${email}</a>` : '<span style="color: #94a3b8;">Not provided</span>'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600;">📅 Date of Birth:</td>
                            <td style="padding: 12px 14px; color: #0f172a;">${dob || 'Not provided'}</td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600;">🚻 Gender:</td>
                            <td style="padding: 12px 14px; color: #0f172a; font-weight: 600; text-transform: capitalize;">${gender || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600;">🏸 Sport Interested In:</td>
                            <td style="padding: 12px 14px; color: #0284c7; font-weight: 700;">${sport || 'Badminton'}</td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600;">📊 Skill Level:</td>
                            <td style="padding: 12px 14px; color: #0f172a; font-weight: 600;">${skill_level || 'Beginner'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600;">⏰ Preferred Training:</td>
                            <td style="padding: 12px 14px; color: #0f172a; font-weight: 600;">${training_time || 'Flexible'}</td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 12px 14px; color: #475569; font-weight: 600;">🕒 Registered At:</td>
                            <td style="padding: 12px 14px; color: #64748b; font-size: 13px;">${timeStr}</td>
                        </tr>
                    </table>

                    <!-- Message Card if available -->
                    ${message ? `
                    <div style="margin-top: 20px; padding: 16px 18px; background: #f0fdf4; border-radius: 10px; border-left: 4px solid #10b981;">
                        <div style="font-weight: 700; color: #166534; font-size: 12px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">💬 Message / Requirements:</div>
                        <div style="color: #1e293b; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${message}</div>
                    </div>` : ''}

                    <!-- Quick Action Buttons -->
                    <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                        <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.5px;">Contact Candidate Immediately:</div>
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            ${email ? `<a href="mailto:${email}?subject=Welcome to SK Sports Academy - Membership Confirmation" style="display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; font-weight: 600; padding: 10px 18px; border-radius: 8px; font-size: 13px; margin: 4px;">✉️ Send Welcome Email</a>` : ''}
                            ${waUrl ? `<a href="${waUrl}" target="_blank" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; font-weight: 600; padding: 10px 18px; border-radius: 8px; font-size: 13px; margin: 4px;">💬 WhatsApp Chat</a>` : ''}
                            <a href="tel:${phone}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; padding: 10px 18px; border-radius: 8px; font-size: 13px; margin: 4px;">📞 Call Candidate</a>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #f8fafc; padding: 16px 30px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
                    This notification was automatically sent to the Admin of <strong>${config.siteName}</strong>.
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"${config.siteName}" <${config.user}>`,
            to: config.adminEmail,
            replyTo: email,
            subject: `🏆 New Registration: ${name} (${phone}) - ${config.siteName}`,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [Mail] Admin registration notification sent to ${config.adminEmail} (MsgID: ${info.messageId})`);
        return { sent: true, messageId: info.messageId };
    } catch (err) {
        console.error('❌ [Mail] Error sending admin registration notification:', err.message);
        return { sent: false, error: err.message };
    }
}

/**
 * Send auto-reply acknowledgment email to the contact visitor
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
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
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
 * Send auto-reply acknowledgment email to registered trainee
 */
async function sendRegistrationAutoReply(registration) {
    try {
        const config = await getEmailConfig();
        const transporter = createTransporter(config);

        if (!transporter) {
            return { sent: false, reason: 'SMTP not configured' };
        }

        const { name, email, phone, gender } = registration;
        if (!email) return { sent: false, reason: 'No recipient email' };

        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 24px 28px; color: #ffffff; text-align: center;">
                    <h2 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 700;">${config.siteName}</h2>
                    <p style="margin: 0; font-size: 15px; opacity: 0.95;">Registration Received Successfully!</p>
                </div>
                
                <div style="padding: 28px; color: #374151; font-size: 15px; line-height: 1.6;">
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>Thank you for registering with <strong>${config.siteName}</strong>! We are excited to have you join our sports community.</p>

                    <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #0284c7;">
                        <span style="font-size: 12px; font-weight: 700; color: #0369a1; text-transform: uppercase;">Your Submitted Details:</span>
                        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #475569; font-size: 14px;">
                            <li><strong>Name:</strong> ${name}</li>
                            <li><strong>Phone:</strong> ${phone}</li>
                            <li><strong>Gender:</strong> ${gender || 'Not specified'}</li>
                        </ul>
                    </div>

                    <p>Our academy coach and coordination team will contact you shortly via phone/WhatsApp to guide you regarding coaching timings, batches, and court trial sessions.</p>

                    <div style="margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                        <p style="margin: 0; font-weight: 600; color: #111827;">Warm Regards,</p>
                        <p style="margin: 2px 0 0 0; color: #0284c7; font-weight: 600;">${config.siteName} Team</p>
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
            subject: `Welcome to ${config.siteName} - Registration Received!`,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [Mail] Registration auto-reply email sent to ${email} (MsgID: ${info.messageId})`);
        return { sent: true, messageId: info.messageId };
    } catch (err) {
        console.error('❌ [Mail] Error sending registration auto-reply:', err.message);
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
    sendRegistrationNotification,
    sendContactAutoReply,
    sendRegistrationAutoReply,
    sendTestEmail
};

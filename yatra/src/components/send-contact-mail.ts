import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

export type ContactRole = 'user' | 'partner' | 'admin'

export interface ContactSubmission {
    role: ContactRole
    name: string
    email: string
    subject: string
    message: string
}

interface RoleMeta {
    label: string
    to: string
    context: string
}


const ROLE_META: Record<ContactRole, RoleMeta> = {
    user: {
        label: 'User Inquiry',
        to: 'support@yatrax.com',
        context: '',
    },
    partner: {
        label: 'Partner Inquiry',
        to: 'partners@yatrax.com',
        context: ' as a potential partner',
    },
    admin: {
        label: 'Admin Report',
        to: 'internal-alerts@yatrax.com',
        context: '',
    },
}

type TemplateVars = Record<string, string>

// Replaces every {{key}} in the template with the matching value.
// Any keys not provided are replaced with an empty string.
function renderTemplate(templateHtml: string, vars: TemplateVars): string {
    return templateHtml.replace(/{{\s*([\w]+)\s*}}/g, (_match, key: string) => {
        return vars[key] !== undefined ? String(vars[key]) : ''
    })
}

function loadTemplate(fileName: string): string {
    const filePath = path.join(__dirname, fileName)
    return fs.readFileSync(filePath, 'utf8')
}


function createTransport() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
        },
    })
}

/**
 * Sends the internal notification email + the auto-reply confirmation
 * for a single contact form submission.
 */
export async function sendContactEmails({
    role,
    name,
    email,
    subject,
    message,
}: ContactSubmission): Promise<void> {
    const meta = ROLE_META[role] ?? ROLE_META.user
    const transporter = createTransport()

    // 1. Notification email -> your team's inbox
    const notificationTemplate = loadTemplate('contact-notification.html')
    const notificationHtml = renderTemplate(notificationTemplate, {
        roleLabel: meta.label,
        name,
        email,
        subject,
        message,
    })

    await transporter.sendMail({
        from: '"YatraX Contact Form" <no-reply@yatrax.com>',
        to: meta.to,
        replyTo: email,
        subject: `[${meta.label}] ${subject}`,
        html: notificationHtml,
    })

    // 2. Auto-reply -> back to the person who submitted the form
    const autoReplyTemplate = loadTemplate('contact-autoreply.html')
    const autoReplyHtml = renderTemplate(autoReplyTemplate, {
        name,
        subject,
        message,
        roleContext: meta.context,
    })

    await transporter.sendMail({
        from: '"YatraX" <support@yatrax.com>',
        to: email,
        subject: `We received your message: ${subject}`,
        html: autoReplyHtml,
    })
}

export { renderTemplate, ROLE_META }
// app/api/contact/route.ts
import fs from 'fs'
import path from 'path'

const roleMeta: Record<string, { label: string; to: string; context: string }> = {
  user:    { label: 'User Inquiry',    to: 'support@yatrax.com',  context: '' },
  partner: { label: 'Partner Inquiry', to: 'partners@yatrax.com', context: ' as a potential partner' },
  admin:   { label: 'Admin Report',    to: 'internal-alerts@yatrax.com', context: '' },
}

function render(template: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce(
    (html, [key, val]) => html.replaceAll(`{{${key}}}`, val),
    template
  )
}

export async function POST(req: Request) {
  const { role, name, email, subject, message } = await req.json()
  const meta = roleMeta[role] ?? roleMeta.user

  const notifTemplate = fs.readFileSync(path.join(process.cwd(), 'emails/contact-notification.html'), 'utf8')
  const replyTemplate  = fs.readFileSync(path.join(process.cwd(), 'emails/contact-autoreply.html'), 'utf8')

  const notifHtml = render(notifTemplate, { roleLabel: meta.label, name, email, subject, message })
  const replyHtml  = render(replyTemplate, { name, subject, message, roleContext: meta.context })

  // send notifHtml -> meta.to
  // send replyHtml -> email
}
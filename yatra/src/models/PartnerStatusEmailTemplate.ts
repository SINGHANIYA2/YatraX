export function Partner_Approved_Email_Template(name: string) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
    <div style="background: #16A34A; padding: 24px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 20px;">You're approved! 🎉</h1>
    </div>
    <div style="padding: 24px; color: #333;">
      <p>Hi ${name},</p>
      <p>Great news — your application to become a YatraX driving partner has been <b>approved</b>.</p>
      <p>You can now log in to your partner dashboard to view your assigned vehicle, routes, and start accepting rides.</p>
      <p style="margin-top: 24px;">Welcome aboard,<br/>Team YatraX</p>
    </div>
  </div>
  `;
}

export function Partner_Rejected_Email_Template(name: string, reason: string) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
    <div style="background: #EF4444; padding: 24px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 20px;">Application update</h1>
    </div>
    <div style="padding: 24px; color: #333;">
      <p>Hi ${name},</p>
      <p>Thank you for applying to become a YatraX driving partner. After review, we're unable to approve your application at this time.</p>
      <p><b>Reason:</b> ${reason}</p>
      <p>You're welcome to reapply once the above is addressed.</p>
      <p style="margin-top: 24px;">Regards,<br/>Team YatraX</p>
    </div>
  </div>
  `;
}

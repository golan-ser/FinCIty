function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function displayOptional(value) {
    return value ? escapeHtml(value) : "לא נמסר";
}

function buildCeoNotificationEmail({ lead } = {}) {
    const fullName = escapeHtml(lead?.fullName || "");
    const municipality = escapeHtml(lead?.municipality || "");
    const email = escapeHtml(lead?.email || "");
    const role = displayOptional(lead?.role);
    const phone = displayOptional(lead?.phone);
    const subject = `פנייה חדשה מ־Fincity — ${lead?.municipality || ""}`;

    const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;background:#F8FAFC;font-family:'Segoe UI',Tahoma,Arial,Helvetica,sans-serif;color:#0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;box-shadow:0 8px 24px rgba(15,23,42,0.05);">
          <tr>
            <td style="height:4px;background-color:#2563EB;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 32px;text-align:right;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#2563EB;">Fincity Leads</p>
              <h1 style="margin:0 0 20px;font-size:24px;line-height:1.35;font-weight:900;color:#0F172A;">פנייה חדשה מהאתר</h1>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.8;color:#334155;">שלום שלו,</p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.8;color:#334155;">התקבלה פנייה חדשה דרך אתר Fincity.</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#64748B;">פרטי הפנייה</p>
                    <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#334155;"><span style="color:#64748B;font-weight:700;">שם מלא:</span> <strong style="color:#0F172A;font-size:17px;">${fullName}</strong></p>
                    <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#334155;"><span style="color:#64748B;font-weight:700;">רשות:</span> <strong style="color:#2563EB;font-size:17px;">${municipality}</strong></p>
                    <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#334155;"><span style="color:#64748B;font-weight:700;">מייל:</span> <span style="direction:ltr;display:inline-block;">${email}</span></p>
                    <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#334155;"><span style="color:#64748B;font-weight:700;">תפקיד:</span> ${role}</p>
                    <p style="margin:0;font-size:15px;line-height:1.7;color:#334155;"><span style="color:#64748B;font-weight:700;">טלפון:</span> ${phone}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#475569;">מייל אישור אוטומטי נשלח למגיש הבקשה.</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#475569;">מומלץ לבחון את הפנייה ולהחליט האם ליצור קשר בהתאם.</p>
              <p style="margin:0;font-size:16px;line-height:1.8;color:#334155;">בברכה,<br><strong style="color:#0F172A;">Fincity</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = [
        "שלום שלו,",
        "",
        "התקבלה פנייה חדשה דרך אתר Fincity.",
        "",
        "פרטי הפנייה:",
        `שם מלא: ${lead?.fullName || ""}`,
        `רשות: ${lead?.municipality || ""}`,
        `מייל: ${lead?.email || ""}`,
        `תפקיד: ${lead?.role || "לא נמסר"}`,
        `טלפון: ${lead?.phone || "לא נמסר"}`,
        "",
        "מייל אישור אוטומטי נשלח למגיש הבקשה.",
        "",
        "מומלץ לבחון את הפנייה ולהחליט האם ליצור קשר בהתאם.",
        "",
        "בברכה,",
        "Fincity"
    ].join("\n");

    return {
        subject,
        html,
        text,
        senderDisplayName: "Fincity Leads"
    };
}

module.exports = {
    buildCeoNotificationEmail
};

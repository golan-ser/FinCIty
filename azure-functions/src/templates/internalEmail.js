function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function buildInternalEmail({ lead, submittedAt }) {
    const subject = `ליד חדש מ־Fincity — ${lead.municipality}`;

    const optionalRows = [
        lead.role ? `<tr><td style="padding:8px 0;color:#64748B;font-weight:700;">תפקיד</td><td style="padding:8px 0;color:#0F172A;">${escapeHtml(lead.role)}</td></tr>` : "",
        lead.phone ? `<tr><td style="padding:8px 0;color:#64748B;font-weight:700;">טלפון</td><td style="padding:8px 0;color:#0F172A;direction:ltr;text-align:right;">${escapeHtml(lead.phone)}</td></tr>` : ""
    ].join("");

    const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;background:#F8FAFC;font-family:Arial,Helvetica,sans-serif;color:#0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;">
          <tr>
            <td style="padding:28px 32px;">
              <h1 style="margin:0 0 8px;font-size:22px;color:#2563EB;">ליד חדש מדף הנחיתה</h1>
              <p style="margin:0 0 24px;color:#64748B;font-size:14px;">Fincity · דף נחיתה</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:15px;line-height:1.6;">
                <tr><td style="padding:8px 0;color:#64748B;font-weight:700;width:140px;">שם מלא</td><td style="padding:8px 0;color:#0F172A;">${escapeHtml(lead.fullName)}</td></tr>
                <tr><td style="padding:8px 0;color:#64748B;font-weight:700;">מייל</td><td style="padding:8px 0;color:#0F172A;direction:ltr;text-align:right;">${escapeHtml(lead.email)}</td></tr>
                <tr><td style="padding:8px 0;color:#64748B;font-weight:700;">שם הרשות</td><td style="padding:8px 0;color:#0F172A;">${escapeHtml(lead.municipality)}</td></tr>
                ${optionalRows}
                <tr><td style="padding:8px 0;color:#64748B;font-weight:700;">תאריך ושעה</td><td style="padding:8px 0;color:#0F172A;">${escapeHtml(submittedAt)}</td></tr>
                <tr><td style="padding:8px 0;color:#64748B;font-weight:700;">מקור</td><td style="padding:8px 0;color:#0F172A;">דף נחיתה Fincity</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const textLines = [
        "ליד חדש מדף הנחיתה Fincity",
        "",
        `שם מלא: ${lead.fullName}`,
        `מייל: ${lead.email}`,
        `שם הרשות: ${lead.municipality}`
    ];

    if (lead.role) textLines.push(`תפקיד: ${lead.role}`);
    if (lead.phone) textLines.push(`טלפון: ${lead.phone}`);
    textLines.push(`תאריך ושעה: ${submittedAt}`);
    textLines.push("מקור: דף נחיתה Fincity");

    return {
        subject,
        html,
        text: textLines.join("\n")
    };
}

module.exports = {
    buildInternalEmail
};

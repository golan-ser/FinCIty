function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function buildAutoReplyEmail({ lead, replyToEmail }) {
    const greetingName = lead.fullName ? escapeHtml(lead.fullName) : "";
    const greeting = greetingName ? `שלום ${greetingName},` : "שלום,";
    const municipality = escapeHtml(lead.municipality);
    const replyTo = encodeURIComponent(replyToEmail);
    const subject = "קיבלנו את הפנייה שלך ל־Fincity";

    const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F6F8FB;font-family:'Segoe UI',Tahoma,Arial,Helvetica,sans-serif;color:#0F172A;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F6F8FB;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;">
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <span style="display:inline-block;font-size:24px;font-weight:900;color:#2563EB;letter-spacing:-0.5px;">Fincity</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:20px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.06);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,#2563EB 0%,#06B6D4 100%);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:36px 32px 28px;text-align:right;">
                    <h1 style="margin:0 0 10px;font-size:28px;line-height:1.3;font-weight:900;color:#0F172A;">הפנייה התקבלה</h1>
                    <p style="margin:0 0 28px;font-size:16px;line-height:1.7;color:#64748B;font-weight:600;">נחזור אליך בהקדם לתיאום שיחה קצרה</p>

                    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#334155;">${greeting}</p>
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#334155;">תודה שפנית אלינו בנוגע ל־Fincity.</p>
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#334155;">קיבלנו את הפרטים של <strong style="color:#0F172A;">${municipality}</strong>, ונחזור אליך בהקדם לתיאום שיחה קצרה והבנת הצורך אצלכם.</p>
                    <p style="margin:0 0 24px;font-size:16px;line-height:1.8;color:#334155;">Fincity היא מערכת AI לניהול תב&quot;רים, הרשאות, מסמכים ודיווחים — במטרה לעזור לרשויות לעבוד בצורה מסודרת, מהירה ושקופה יותר מול גורמי מימון ומשרדי ממשלה.</p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px;background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;">
                      <tr>
                        <td style="padding:16px 18px;font-size:15px;line-height:1.6;color:#475569;text-align:right;">
                          <span style="display:block;font-size:12px;font-weight:700;color:#64748B;margin-bottom:4px;">הרשות</span>
                          <span style="font-size:17px;font-weight:800;color:#0F172A;">${municipality}</span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#475569;">אם נוח לך, אפשר להשיב למייל הזה עם זמן מועדף לשיחה או מספר טלפון לחזרה.</p>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 28px;">
                      <tr>
                        <td align="center" bgcolor="#2563EB" style="border-radius:14px;">
                          <a href="mailto:${escapeHtml(replyToEmail)}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:800;color:#FFFFFF;text-decoration:none;border-radius:14px;background-color:#2563EB;">השיבו למייל לתיאום שיחה</a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0;font-size:16px;line-height:1.8;color:#334155;">בברכה,<br><strong style="color:#0F172A;">צוות Fincity</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 12px 8px;font-size:12px;line-height:1.6;color:#94A3B8;text-align:center;">
              Fincity · מערכת AI לניהול תב&quot;רים לרשויות מקומיות
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = [
        greeting,
        "",
        "תודה שפנית אלינו בנוגע ל־Fincity.",
        "",
        `קיבלנו את הפרטים של ${lead.municipality}, ונחזור אליך בהקדם לתיאום שיחה קצרה והבנת הצורך אצלכם.`,
        "",
        "Fincity היא מערכת AI לניהול תב\"רים, הרשאות, מסמכים ודיווחים — במטרה לעזור לרשויות לעבוד בצורה מסודרת, מהירה ושקופה יותר מול גורמי מימון ומשרדי ממשלה.",
        "",
        `הרשות: ${lead.municipality}`,
        "",
        "אם נוח לך, אפשר להשיב למייל הזה עם זמן מועדף לשיחה או מספר טלפון לחזרה.",
        "",
        "בברכה,",
        "צוות Fincity"
    ].join("\n");

    return {
        subject,
        html,
        text
    };
}

module.exports = {
    buildAutoReplyEmail
};

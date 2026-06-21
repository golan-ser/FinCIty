function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getFirstName(fullName) {
    const trimmed = String(fullName || "").trim();
    if (!trimmed) {
        return null;
    }

    return trimmed.split(/\s+/)[0];
}

function buildAutoReplyEmail({ lead, replyToEmail = "" } = {}) {
    const firstName = getFirstName(lead?.fullName);
    const greeting = firstName ? `שלום ${escapeHtml(firstName)},` : "שלום,";
    const municipality = escapeHtml(lead?.municipality || "");
    const subject = "קיבלנו את פנייתך ל־Fincity";

    const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:'Segoe UI',Tahoma,Arial,Helvetica,sans-serif;color:#0F172A;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F8FAFC;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="display:block;font-size:26px;font-weight:900;color:#2563EB;letter-spacing:-0.5px;margin-bottom:8px;">Fincity</span>
              <span style="display:inline-block;padding:6px 12px;background-color:#EFF6FF;border:1px solid #BFDBFE;border-radius:999px;font-size:12px;font-weight:700;color:#2563EB;">AI לניהול תב&quot;רים</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.05);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="height:4px;background-color:#2563EB;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:36px 32px 32px;text-align:right;">
                    <h1 style="margin:0 0 8px;font-size:26px;line-height:1.35;font-weight:900;color:#0F172A;">הפנייה התקבלה</h1>
                    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#64748B;font-weight:600;">נבחן את הפנייה וניצור קשר בהתאם</p>
                    <p style="margin:0 0 24px;font-size:20px;line-height:1.6;font-weight:800;color:#0F172A;">${greeting}</p>
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.85;color:#334155;">תודה שפנית אלינו בנוגע ל־Fincity.</p>
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.85;color:#334155;">קיבלנו את פנייתך מטעם <strong style="color:#0F172A;">${municipality}</strong>, ונבחן אותה בהתאם לצרכים שעלו ולשלב ההתאמה של הרשות למערכת.</p>
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.85;color:#334155;">Fincity היא מערכת AI לניהול תב&quot;רים, הרשאות, מסמכים, דיווחים ומעקב תקציבי — במטרה לעזור לרשויות לעבוד בצורה פשוטה, מסודרת וחכמה יותר, ולרכז במקום אחד את המידע, המסמכים והמשימות הקשורות לתקציבים ייעודיים.</p>
                    <p style="margin:0 0 24px;font-size:16px;line-height:1.85;color:#334155;">לאחר בחינת הפנייה, ניצור קשר במידת הצורך לצורך היכרות קצרה, הבנת הצרכים והצגת האפשרויות הרלוונטיות עבורכם.</p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px;background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;">
                      <tr>
                        <td style="padding:16px 18px;text-align:right;">
                          <span style="display:block;font-size:12px;font-weight:700;color:#64748B;margin-bottom:4px;">רשות</span>
                          <span style="font-size:17px;font-weight:800;color:#0F172A;">${municipality}</span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0;font-size:16px;line-height:1.85;color:#334155;">בברכה,<br><strong style="color:#0F172A;">שלו</strong><br><span style="color:#64748B;font-size:15px;">מנכ&quot;ל Fincity</span></p>
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
        `קיבלנו את פנייתך מטעם ${lead?.municipality || ""}, ונבחן אותה בהתאם לצרכים שעלו ולשלב ההתאמה של הרשות למערכת.`,
        "",
        "Fincity היא מערכת AI לניהול תב\"רים, הרשאות, מסמכים, דיווחים ומעקב תקציבי — במטרה לעזור לרשויות לעבוד בצורה פשוטה, מסודרת וחכמה יותר, ולרכז במקום אחד את המידע, המסמכים והמשימות הקשורות לתקציבים ייעודיים.",
        "",
        "לאחר בחינת הפנייה, ניצור קשר במידת הצורך לצורך היכרות קצרה, הבנת הצרכים והצגת האפשרויות הרלוונטיות עבורכם.",
        "",
        `רשות: ${lead?.municipality || ""}`,
        "",
        "בברכה,",
        "שלו",
        "מנכ\"ל Fincity"
    ].join("\n");

    return {
        subject,
        html,
        text,
        senderDisplayName: "שלו | Fincity"
    };
}

module.exports = {
    buildAutoReplyEmail
};

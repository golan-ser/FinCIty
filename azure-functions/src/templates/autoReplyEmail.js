const LOGO_ICON_URL = process.env.MAIL_LOGO_ICON_URL || "https://www.fincity.co.il/finCity-logo_only.png";
const LOGO_TEXT_URL = process.env.MAIL_LOGO_TEXT_URL || "https://www.fincity.co.il/finCity-logotext.png";

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

function ltr(text) {
    return `<span dir="ltr" style="unicode-bidi:isolate;">${text}</span>`;
}

function rtlLine(content) {
    return `<p dir="rtl" style="margin:0 0 16px;font-size:16px;line-height:1.9;color:#334155;text-align:right;direction:rtl;">${content}</p>`;
}

function endPunct(content, mark) {
    return `${content}&#8206;${mark}`;
}

function buildAutoReplyEmail({ lead, replyToEmail = "" } = {}) {
    const firstName = getFirstName(lead?.fullName);
    const greetingName = firstName ? escapeHtml(firstName) : null;
    const greeting = greetingName
        ? `<p dir="rtl" style="margin:0 0 24px;font-size:20px;line-height:1.6;font-weight:800;color:#0F172A;text-align:right;">שלום ${greetingName}&#8206;,</p>`
        : `<p dir="rtl" style="margin:0 0 24px;font-size:20px;line-height:1.6;font-weight:800;color:#0F172A;text-align:right;">שלום,</p>`;
    const municipality = escapeHtml(lead?.municipality || "");
    const subject = "קיבלנו את פנייתך ל־Fincity";
    const fincity = ltr("Fincity");

    const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:'Segoe UI',Tahoma,Arial,Helvetica,sans-serif;color:#0F172A;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F1F5F9;">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;">
          <tr>
            <td align="center" style="padding:0 0 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <img src="${LOGO_ICON_URL}" alt="Fincity" width="44" height="44" style="display:block;border:0;outline:none;">
                  </td>
                  <td style="vertical-align:middle;">
                    <img src="${LOGO_TEXT_URL}" alt="Fincity" width="120" height="32" style="display:block;border:0;outline:none;max-width:120px;height:auto;">
                  </td>
                </tr>
              </table>
              <p dir="rtl" style="margin:14px 0 0;font-size:12px;font-weight:700;color:#2563EB;letter-spacing:0.2px;">AI לניהול תב&quot;רים לרשויות מקומיות</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:20px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.06);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="height:5px;background:linear-gradient(90deg,#2563EB 0%,#3B82F6 100%);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:36px 32px 28px;text-align:right;direction:rtl;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;">
                      <tr>
                        <td style="width:36px;height:36px;background-color:#EFF6FF;border-radius:999px;text-align:center;vertical-align:middle;font-size:18px;line-height:36px;color:#2563EB;">✓</td>
                        <td style="padding-right:12px;vertical-align:middle;">
                          <h1 dir="rtl" style="margin:0;font-size:24px;line-height:1.35;font-weight:900;color:#0F172A;text-align:right;">הפנייה התקבלה</h1>
                        </td>
                      </tr>
                    </table>
                    <p dir="rtl" style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#64748B;font-weight:600;text-align:right;">נבחן את הפנייה וניצור קשר בהתאם</p>

                    ${greeting}

                    ${rtlLine(endPunct(`תודה שפנית אלינו בנוגע ל־${fincity}`, "."))}
                    ${rtlLine(endPunct(`קיבלנו את פנייתך מטעם <strong style="color:#0F172A;">${municipality}</strong>`, ", ונבחן אותה בהתאם לצרכים שעלו ולשלב ההתאמה של הרשות למערכת."))}
                    ${rtlLine(endPunct(`${fincity} היא מערכת AI לניהול תב&quot;רים, הרשאות, מסמכים, דיווחים ומעקב תקציבי — במטרה לעזור לרשויות לעבוד בצורה פשוטה, מסודרת וחכמה יותר, ולרכז במקום אחד את המידע, המסמכים והמשימות הקשורות לתקציבים ייעודיים`, "."))}
                    ${rtlLine(endPunct("לאחר בחינת הפנייה, ניצור קשר במידת הצורך לצורך היכרות קצרה, הבנת הצרכים והצגת האפשרויות הרלוונטיות עבורכם", "."))}

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 28px;background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;">
                      <tr>
                        <td dir="rtl" style="padding:18px 20px;text-align:right;">
                          <span style="display:block;font-size:12px;font-weight:700;color:#64748B;margin-bottom:6px;">רשות</span>
                          <span style="font-size:18px;font-weight:800;color:#0F172A;">${municipality}</span>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:1px solid #E2E8F0;">
                      <tr>
                        <td dir="rtl" style="padding-top:24px;text-align:right;">
                          <p style="margin:0 0 6px;font-size:16px;line-height:1.7;color:#334155;">בברכה,</p>
                          <p style="margin:0 0 4px;font-size:17px;line-height:1.6;font-weight:800;color:#0F172A;">שלו</p>
                          <p dir="rtl" style="margin:0;font-size:15px;line-height:1.6;color:#64748B;text-align:right;">${fincity} · מנכ&quot;ל</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" dir="rtl" style="padding:24px 12px 8px;font-size:12px;line-height:1.7;color:#94A3B8;text-align:center;">
              ${fincity} · מערכת AI לניהול תב&quot;רים לרשויות מקומיות
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = [
        greetingName ? `שלום ${firstName},` : "שלום,",
        "",
        "תודה שפנית אלינו בנוגע ל-Fincity.",
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
        "Fincity · מנכ\"ל"
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
